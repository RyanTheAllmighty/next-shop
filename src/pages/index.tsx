import Link from 'next/link';
import { NextPage } from 'next';
import { PrismaClient } from '@prisma/client';

import type { CategoryGetPayload } from '@prisma/client';

import Layout from '../components/Layout/Layout';

declare global {
    namespace NodeJS {
        interface Global {
            prisma: PrismaClient;
        }
    }
}

interface IndexProps {
    categories: { createdAt: string; updatedAt: string } & Omit<
        CategoryGetPayload<{ include: { children: true; products: true } }>,
        'createdAt' | 'updatedAt'
    >[];
}

const Index: NextPage<IndexProps> = ({ categories }) => {
    return (
        <Layout>
            <div>
                <h2 className="font-bold text-2xl my-2">Categories</h2>
                <div className="flex flex-wrap items-center">
                    {categories.map(({ id, name, slug }) => (
                        <Link href="/[category]" as={`/${slug}`} key={id}>
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
    const categories = await prisma.category.findMany({
        where: { parentId: null },
    });

    return {
        props: {
            categories: categories.map((category) => ({
                ...category,
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString(),
            })),
        },
    };
}

export default Index;
