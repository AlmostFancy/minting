import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext,
} from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300&display=swap"
                        rel="stylesheet"
                    />
                    <meta content="❌❌❌" name="description" />
                    <meta content="AlmostFancy" property="og:title" />
                    <meta content="❌❌❌" property="og:description" />
                    <meta
                        content="https://uploads-ssl.webflow.com/5fcb81ed8faed27783085906/6229324a6d36a66705f4f3ff_af_og.png"
                        property="og:image"
                    />
                    <meta content="AlmostFancy" property="twitter:title" />
                    <meta content="❌❌❌" property="twitter:description" />
                    <meta
                        content="https://uploads-ssl.webflow.com/5fcb81ed8faed27783085906/6229324a6d36a66705f4f3ff_af_og.png"
                        property="twitter:image"
                    />
                    <meta property="og:type" content="website" />
                    <meta content="summary_large_image" name="twitter:card" />
                </Head>
                <body className="min-h-screen">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
