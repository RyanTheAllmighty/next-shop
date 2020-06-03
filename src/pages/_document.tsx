import Document, { Html, Head, Main, NextScript } from 'next/document';

import Header from '../components/Header/Header';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head />

                <body className="flex flex-col bg-gray-500 text-white min-h-screen antialiased leading-tight antialiased pb-5 px-5 md:px-10 container mx-auto ">
                    <Header />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
