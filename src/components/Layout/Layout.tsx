import { NextPage } from 'next';
import Header from '../Header/Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: NextPage<LayoutProps> = ({ children }) => (
    <>
        <Header />
        <main>{children}</main>
    </>
);

export default Layout;
