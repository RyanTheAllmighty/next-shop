import { NextPage } from 'next';
import Link from 'next/link';

const Header: NextPage = () => {
    return (
        <header className="flex flex-col justify-center mb-5">
            <nav className="flex flex-col md:flex-row px-4 py-2 items-center border-b border-blue-600">
                <div className="flex flex-grow">
                    <Link href="/">
                        <a className="font-bold text-5xl">NEXT Shop</a>
                    </Link>
                </div>
                <div className="flex mt-4 md:mt-0">
                    <Link href="/login">
                        <a className="border rounded-lg border-blue-300 hover:bg-blue-300 py-1 px-3 mr-2">Login</a>
                    </Link>
                    <Link href="/register">
                        <a className="border rounded-lg border-blue-300 hover:bg-blue-300 py-1 px-3 mr-2">Register</a>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
