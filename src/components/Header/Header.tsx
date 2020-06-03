import { NextPage } from 'next';
import Link from 'next/link';

const Header: NextPage = () => (
    <header className="flex flex-col justify-center mb-5">
        <nav className="flex flex-col md:flex-row rounded-b bg-shark-700 px-4 py-2">
            <div className="flex items-center justify-center md:justify-end mt-4 md:mt-0">
                <Link href="/">
                    <a className="border rounded-lg border-patina-500 hover:bg-patina-500 py-1 px-3 mr-2">Home</a>
                </Link>

                <Link href="/blog">
                    <a className="border rounded-lg border-patina-500 hover:bg-patina-500 py-1 px-3 mr-2">Blog</a>
                </Link>
            </div>
        </nav>
    </header>
);

export default Header;
