import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import Layout from '../../components/Layout/Layout';

import type { CategoryGetPayload, ProductGetPayload } from '@prisma/client';

declare global {
    namespace NodeJS {
        interface Global {
            prisma: PrismaClient;
        }
    }
}

interface ProductPageProps {
    category: { createdAt: string; updatedAt: string } & Omit<
        CategoryGetPayload<{ include: { parent: true } }>,
        'createdAt' | 'updatedAt'
    >;
    product: { createdAt: string; updatedAt: string } & Omit<
        ProductGetPayload<{ include: { brand: true; images: true; specifications: true } }>,
        'createdAt' | 'updatedAt'
    >;
}

const ProductPage: NextPage<ProductPageProps> = ({ category, product }) => {
    const router = useRouter();

    if (!router.isFallback && !category) {
        return <ErrorPage statusCode={404} />;
    }

    if (router.isFallback) {
        return (
            <Layout>
                <h2 className="font-bold text-2xl my-2">Loading...</h2>
            </Layout>
        );
    }

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

export async function getStaticProps({
    params: { category: categorySlug, product: productSlug },
}: {
    params: { category: string; product: string };
}) {
    const prisma: PrismaClient = global.prisma || (global.prisma = new PrismaClient());
    const category = await prisma.category.findOne({ where: { slug: categorySlug }, include: { parent: true } });
    const product = await prisma.product.findOne({
        where: { slug: productSlug },
        include: { brand: true, images: true, specifications: true },
    });

    const parent = category.parent
        ? {
              parent: {
                  ...category.parent,
                  createdAt: category.parent.createdAt.toISOString(),
                  updatedAt: category.parent.updatedAt.toISOString(),
              },
          }
        : {};

    return {
        props: {
            category: {
                ...category,
                ...parent,
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString(),
            },
            product: {
                ...product,
                brand: {
                    ...product.brand,
                    createdAt: product.brand.createdAt.toISOString(),
                    updatedAt: product.brand.updatedAt.toISOString(),
                },
                images: product.images.map((image) => ({
                    ...image,
                    createdAt: image.createdAt.toISOString(),
                    updatedAt: image.updatedAt.toISOString(),
                })),
                specifications: product.specifications.map((specification) => ({
                    ...specification,
                    createdAt: specification.createdAt.toISOString(),
                    updatedAt: specification.updatedAt.toISOString(),
                })),
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString(),
            },
        },
    };
}

export async function getStaticPaths() {
    const prisma: PrismaClient = global.prisma || (global.prisma = new PrismaClient());

    const categoriesWithProducts = await prisma.category.findMany({ include: { products: true } });

    return {
        paths: categoriesWithProducts.flatMap((category) => {
            return category.products.map((product) => ({
                params: {
                    category: category.slug,
                    product: product.slug,
                },
            }));
        }),
        fallback: false,
    };
}

export default ProductPage;
