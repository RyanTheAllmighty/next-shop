import slugify from 'slugify';
import {
    PrismaClient,
    CategoryCreateInput,
    CategoryUpdateInput,
    ProductCreateInput,
    ProductUpdateInput,
} from '@prisma/client';

import categories from './seed-data/categories';
import type { Category } from './seed-data/categories';

import products from './seed-data/products';
import type { Product } from './seed-data/products';

const client = new PrismaClient();

main();

export async function createCategory(category: Category, parentCategory: number | null = null): Promise<void> {
    try {
        const slug = slugify(category.name).toLowerCase();

        const data: CategoryCreateInput | CategoryUpdateInput = {
            name: category.name,
            slug,
        };

        if (parentCategory) {
            data.parent = {
                connect: {
                    id: parentCategory,
                },
            };
        }

        const thisCategory = await client.category.upsert({
            where: { slug },
            create: data as CategoryCreateInput,
            update: data as CategoryUpdateInput,
        });

        if (category.children) {
            await Promise.all(
                category.children.flatMap((childCategory) => createCategory(childCategory, thisCategory.id)),
            );
        }
    } catch (e) {
        console.log(category);
        console.error(e);
        process.exit(1);
    }
}

async function createProduct(product: Product): Promise<void> {
    try {
        const slug = slugify(product.name).toLowerCase();
        const brandSlug = slugify(product.brand).toLowerCase();
        const categorySlug = slugify(product.category).toLowerCase();

        const brand = await client.brand.upsert({
            where: { slug: brandSlug },
            create: {
                name: product.brand,
                slug: brandSlug,
            },
            update: {
                name: product.brand,
            },
        });

        const category = await client.category.findOne({ where: { slug: categorySlug } });

        if (!category) {
            console.error(`No category with the slug of ${categorySlug} not found when adding product ${product.name}`);
            process.exit(1);
            return;
        }

        const data: ProductCreateInput | ProductUpdateInput = {
            sku: product.sku,
            name: product.name,
            slug,
            description: product.description,
            price: product.price,
            brand: {
                connect: {
                    id: brand.id,
                },
            },
            category: {
                connect: {
                    id: category.id,
                },
            },
        };

        // create the product
        const thisProduct = await client.product.upsert({
            where: { slug },
            create: data as ProductCreateInput,
            update: data as ProductUpdateInput,
        });

        // create all the images
        await Promise.all(
            product.images.map((image) =>
                client.productImage.upsert({
                    where: { url_productId: { url: image.url, productId: thisProduct.id } },
                    create: { ...image, product: { connect: { id: thisProduct.id } } },
                    update: { ...image, product: { connect: { id: thisProduct.id } } },
                }),
            ),
        );

        // create all the specifications
        await Promise.all(
            product.specifications.map((specification) =>
                client.productSpecification.create({
                    data: { ...specification, product: { connect: { id: thisProduct.id } } },
                }),
            ),
        );
    } catch (e) {
        console.log(product);
        console.error(e);
        process.exit(1);
    }
}

async function main() {
    await Promise.all(categories.map((category) => createCategory(category)));
    console.log('Seeded categories');

    await Promise.all(products.map((product) => createProduct(product)));
    console.log('Seeded products');

    client.disconnect();

    process.exit(0);
}
