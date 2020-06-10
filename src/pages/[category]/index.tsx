import useSWR from 'swr';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { request } from 'graphql-request';
import { PrismaClient } from '@prisma/client';
import Layout from '../../components/Layout/Layout';

import type { CategoryGetPayload } from '@prisma/client';

const CategoryPage: NextPage = () => {
    const router = useRouter();

    const { data } = useSWR<{
        categories: CategoryGetPayload<{ include: { parent: true; products: true; children: true } }>[];
    }>(
        `query getProductAndCategory {
            categories(where: { slug: { equals: "${router.query.category}" } }) {
                name
                slug
                parent {
                    id
                    name
                    slug
                }
                children {
                    id
                    name
                    slug
                }
                products {
                    id
                    name
                    slug
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

    if (!router.isFallback && !data.categories.length) {
        return <ErrorPage statusCode={404} />;
    }

    const [category] = data.categories;

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

export default CategoryPage;
