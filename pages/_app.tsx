import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Config, DAppProvider, Rinkeby } from '@usedapp/core';

const dappConfig: Config = {
    readOnlyChainId: Rinkeby.chainId,
    readOnlyUrls: {
        [Rinkeby.chainId]: process.env.ALCHEMY_URL || '',
    },
    autoConnect: true,
};

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <DAppProvider config={dappConfig}>
            <Component {...pageProps} />
        </DAppProvider>
    );
}

export default MyApp;
