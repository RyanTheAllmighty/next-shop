import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import { request } from 'graphql-request';
import type { Category } from '@prisma/client';

const Header: NextPage = () => {
    const { data } = useSWR<{ categories: Category[] }>(
        `query { categories(where: { parentId: { equals: null }}) { id name slug } }`,
        (query) => request('/api/graphql', query),
    );

    return (
        <header className="flex flex-col justify-center mb-5">
            <nav className="flex flex-col md:flex-row rounded-b px-4 py-2 justify-end">
                <div className="flex items-center mt-4 md:mt-0">
                    <Link href="/login">
                        <a className="border rounded-lg border-blue-300 hover:bg-blue-300 py-1 px-3 mr-2">Login</a>
                    </Link>
                    <Link href="/register">
                        <a className="border rounded-lg border-blue-300 hover:bg-blue-300 py-1 px-3 mr-2">Register</a>
                    </Link>
                </div>
            </nav>

            <nav className="flex flex-col md:flex-row rounded-b bg-shark-700 px-4 py-2">
                <div className="flex items-center justify-center md:justify-end mt-4 md:mt-0">
                    <Link href="/">
                        <a className="font-bold text-5xl">NEXT Shop</a>
                    </Link>

                    <div className="flex flex-wrap space-y-2">
                        {data?.categories?.map(({ id, name, slug }) => (
                            <div className="ml-4" key={id}>
                                <Link href={`/${slug}`}>
                                    <a className="py-1 px-3 mr-2 border-b border-blue-200 hover:border-blue-800 transition-colors duration-300">
                                        {name}
                                    </a>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
