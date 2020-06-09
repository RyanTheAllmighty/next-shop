import fs from 'fs';
import path from 'path';
import ky from 'ky-universal';
import puppeteer, { Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';

import type { Product } from './seed-data/products';
import type { Category } from './seed-data/categories';

const categories: Category[] = [];
const products: Product[] = [];

main();

async function scrapeProduct(page: Page, url: string): Promise<void> {
    await page.goto(url, {
        waitUntil: 'networkidle2',
    });

    // ensure the categories for this product has been made

    let stringCategories = (await page.$$eval('.breadcrumb li:not(:first-child):not(:last-child) a > span', (el) =>
        el.map((e) => e.textContent?.trim()),
    )) as string[];

    let category: Category | null = null;
    let children;

    // this is not great, but he MSY structure is shallow. Could be simplified with some loop potentially
    do {
        const [name, ...rest] = stringCategories;
        children = rest;
        stringCategories = rest;

        if (!category) {
            category = { name };
        } else {
            if (category.children?.length) {
                if (category.children[0].children?.length) {
                    category.children[0].children[0].children = [{ name }];
                } else {
                    category.children[0].children = [{ name }];
                }
            } else {
                category.children = [{ name }];
            }
        }
    } while (children.length);

    categories.push(category);

    // now to the product

    let brand;
    let description;

    try {
        description = (await page.$eval('.short-description', (el) => el.textContent?.trim())) || 'No Description';
    } catch (e) {
        description = 'No Description';
    }

    try {
        brand = (await page.$eval('.manufacturers > .value', (el) => el.textContent?.trim())) || 'Unknown';
    } catch (e) {
        brand = 'Unknown';
    }

    const product = {
        brand,
        sku: (await page.$eval('.sku > .value', (el) => el.textContent?.trim())) || '',
        name: (await page.$eval('.product-name', (el) => el.textContent?.trim())) || '',
        description,
        price:
            ((await page.$eval('.prices [class^="price-value"]', (el) =>
                parseFloat(el.innerHTML.trim().replace(/[^0-9\.]/, '')),
            )) as number) || 0,
        images: [
            ...(Array.from(
                // use a Set so we only get the unique values
                new Set([
                    // grab the main image
                    (await page.$eval('.picture .picture-link', (el) =>
                        el.getAttribute('data-full-image-url')?.trim(),
                    )) || null,
                    // grab all the items in the slideshow
                    ...((await page.$$eval('.slick-track a', (el) =>
                        el.map((e) => e.getAttribute('data-cloudzoom')?.match(/zoomImage: '(.*?)'/m)?.[1] || null),
                    )) as string[]),
                ]),
            )
                .filter(Boolean)
                .map((url) => ({ url })) as Array<{ url: string }>),
        ],
        specifications: (await page.$$eval('#specification tr', (el) =>
            el.map((e) => ({
                name: e.querySelector('.spec-name')?.innerHTML?.trim(),
                value: e.querySelector('.spec-value')?.innerHTML?.trim(),
            })),
        )) as Array<{ name: string; value: string }>,
        category: stringCategories[stringCategories.length - 1],
    };

    console.log(`Scraped product ${url}`);

    products.push(product);
}

async function scrapeCategory(categoryId: number, limit: number = 100, page: number = 1): Promise<string[]> {
    const response = await ky
        .post('https://www.msy.com.au/GetFilteredProduct', {
            json: {
                categoryId,
                manufacturerId: '0',
                vendorId: '0',
                orderby: 'CreatedOn',
                viewmode: 'grid',
                pagesize: limit,
                queryString: '',
                pageNumber: page,
                shouldNotStartFromFirstPage: false,
                keyword: '',
                searchCategoryId: '0',
                searchManufacturerId: '0',
                searchVendorId: '0',
                priceFrom: '0',
                priceTo: '0',
                includeSubcategories: 'False',
                searchInProductDescriptions: 'False',
                advancedSearch: 'False',
                isOnSearchPage: 'False',
            },
        })
        .text();

    let match;
    let regex = /<div class="picture">.*?<a href="(.*?)"/gms;
    const urls = [];

    while ((match = regex.exec(response)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        urls.push(`https://www.msy.com.au${match[1]}`);
    }

    console.log(`Category ${categoryId} has ${urls.length} products`);

    return urls;
}

async function main() {
    // approximately 2,657 items as of 4/6/2020. Category 0 is all, 200 is the page size and 1 is the page number
    const urls = await scrapeCategory(0, 200, 1);

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 10,
        monitor: true,
    });

    await cluster.task(async ({ page, data: url }) => {
        await scrapeProduct(page, url);
    });

    cluster.on('taskerror', (err, data) => {
        console.log(`Error crawling ${data}: ${err.message}`);
    });

    urls.forEach((url) => cluster.queue(url));

    await cluster.idle();
    await cluster.close();

    console.log(`Grabbed ${products.length} products`);

    fs.writeFileSync(
        path.join(__dirname, `seed-data/json/products-${Math.floor(Date.now() / 1000)}.json`),
        JSON.stringify(products, null, 4),
    );
    fs.writeFileSync(
        path.join(__dirname, `seed-data/json/categories-${Math.floor(Date.now() / 1000)}.json`),
        JSON.stringify(categories, null, 4),
    );
}
