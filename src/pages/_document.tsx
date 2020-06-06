import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head />

                <body className="text-black min-h-screen antialiased leading-tight bg-blue-800">
                    <div className="bg-white min-h-screen flex flex-col pb-5 px-5 md:px-10 container mx-auto">
                        <Main />
                        <NextScript />
                    </div>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
