import useSWR from 'swr';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { request } from 'graphql-request';
import { PrismaClient } from '@prisma/client';
import Layout from '../../components/Layout/Layout';

import type { CategoryGetPayload, ProductGetPayload } from '@prisma/client';
import categories from '../../../prisma/seed-data/categories';
import products from '../../../prisma/seed-data/products';

const ProductPage: NextPage = () => {
    const router = useRouter();

    const { data } = useSWR<{
        categories: CategoryGetPayload<{ include: { parent: true } }>[];
        products: ProductGetPayload<{ include: { images: true; specifications: true } }>[];
    }>(
        `query getProductAndCategory {
            categories(where: { slug: { equals: "${router.query.category}" } }) {
                name
                slug
                parent {
                    name
                    slug
                }
            }
            products(where: { slug: { equals: "${router.query.product}" } }) {
                name
                description
                images {
                    url
                }
                price
                specifications {
                    id
                    name
                    value
                }
            }
        }`,
        (query) => request('/api/graphql', query),
    );

    if (router.isFallback || !data) {
        return (
            <Layout>
                <h2 className="font-bold text-2xl my-2">Loading...</h2>
            </Layout>
        );
    }

    if (!router.isFallback && !data.categories.length && !data.products.length) {
        return <ErrorPage statusCode={404} />;
    }

    const [category] = data.categories;
    const [product] = data.products;

    return (
        <Layout>
            <Head>
                <title>NEXT Shop | {product.name}</title>
            </Head>

            <ul className="flex flex-row space-x-2">
                <li>
                    <Link href="/">
                        <a className="underline">Home</a>
                    </Link>
                </li>
                <li>&gt;</li>
                {category.parent && (
                    <>
                        <li>
                            <Link href="/[category]" as={`/${category.parent.slug}`}>
                                <a className="underline">{category.parent.name}</a>
                            </Link>
                        </li>
                        <li>&gt;</li>
                    </>
                )}
                <li>
                    <Link href="/[category]" as={`/${category.slug}`}>
                        <a className="underline">{category.name}</a>
                    </Link>
                </li>
                <li>&gt;</li>
                <li>{product.name}</li>
            </ul>

            <h1 className="font-bold text-4xl my-2">{product.name}</h1>

            <h2 className="font-bold text-2xl my-2">{product.description}</h2>

            <div className="flex items-center flex-wrap my-2">
                <div className="w-full lg:w-1/2 space-y-2">
                    <img src={product.images[0].url} alt={product.name} className="h-64 bg-cover mx-auto" />

                    <div className="flex flex-col my-2 items-center space-y-2">
                        <span className="text-green-800 font-bold text-xl">${product.price.toLocaleString()}</span>

                        <button className="text-white bg-green-800 hover:bg-green-600 border rounded border-green-600 font-bold text-xl py-2 px-4">
                            Add to Cart
                        </button>
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    {product.specifications.map((specification) => (
                        <div className="grid grid-cols-2" key={specification.id}>
                            <div className="font-bold">{specification.name}</div>
                            <div>{specification.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ProductPage;
