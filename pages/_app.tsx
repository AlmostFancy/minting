import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Config, DAppProvider, Rinkeby } from '@usedapp/core';

const dappConfig: Config = {
    readOnlyChainId: Rinkeby.chainId,
    readOnlyUrls: {
        [Rinkeby.chainId]:
            'https://eth-rinkeby.alchemyapi.io/v2/9R_yWpWjLB7vKcGfCR_I2HU-X5Fuahol',
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
