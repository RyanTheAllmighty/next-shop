import Head from 'next/head';
import * as React from 'react';
import { AppProps } from 'next/app';

import '../styles.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
    <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta charSet="utf-8" />
            <meta httpEquiv="x-ua-compatible" content="ie=edge" />
            <title>Next Shop</title>

            <link href="https://fonts.gstatic.com" rel="preconnect" />
            <link href="https://fonts.googleapis.com" rel="preconnect" crossOrigin="anonymous" />

            <meta name="description" content="Next Shop - The place to buy stuff and things online" />
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
        </Head>
        <Component {...pageProps} />
    </>
);

export default MyApp;
