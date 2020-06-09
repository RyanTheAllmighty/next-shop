import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import Layout from '../../components/Layout/Layout';

import type { CategoryGetPayload } from '@prisma/client';

declare global {
    namespace NodeJS {
        interface Global {
            prisma: PrismaClient;
        }
    }
}

interface CategoryPageProps {
    category: { createdAt: string; updatedAt: string } & Omit<
        CategoryGetPayload<{ include: { parent: true; children: true; products: true } }>,
        'createdAt' | 'updatedAt'
    >;
}

const CategoryPage: NextPage<CategoryPageProps> = ({ category }) => {
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
                <title>NEXT Shop | {category.name}</title>
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
                <li>{category.name}</li>
            </ul>

            <div>
                <h2 className="font-bold text-2xl my-2">Sub Categories</h2>
                <div className="flex flex-wrap items-center">
                    {category.children.map(({ id, name, slug }) => (
                        <Link href="/[category]" as={`/${slug}`} key={id}>
                            <a className="m-2 px-4 border-b border-blue-200 hover:border-blue-800 transition-colors duration-300">
                                {name}
                            </a>
                        </Link>
                    ))}
                </div>
            </div>

            <hr />

            <div>
                <h2 className="font-bold text-2xl my-2">Products in {category.name}</h2>
                <div className="flex flex-wrap items-center">
                    {category.products.map(({ id, name, slug }) => (
                        <Link href="/[category]/[product]" as={`/${category.slug}/${slug}`} key={id}>
                            <a className="m-2 px-4 border-b border-blue-200 hover:border-blue-800 transition-colors duration-300">
                                {name}
                            </a>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export async function getStaticProps({ params }: { params: { category: string } }) {
    const prisma: PrismaClient = global.prisma || (global.prisma = new PrismaClient());
    const category = await prisma.category.findOne({
        where: { slug: params.category },
        include: { children: true, products: true, parent: true },
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
                children: category.children.map((childCategory) => ({
                    ...childCategory,
                    createdAt: childCategory.createdAt.toISOString(),
                    updatedAt: childCategory.updatedAt.toISOString(),
                })),
                products: category.products.map((product) => ({
                    ...product,
                    createdAt: product.createdAt.toISOString(),
                    updatedAt: product.updatedAt.toISOString(),
                })),
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString(),
            },
        },
    };
}

export async function getStaticPaths() {
    const prisma: PrismaClient = global.prisma || (global.prisma = new PrismaClient());
    const categories = await prisma.category.findMany();

    return {
        paths: categories.map((category) => {
            return {
                params: {
                    category: category.slug,
                },
            };
        }),
        fallback: false,
    };
}

export default CategoryPage;
