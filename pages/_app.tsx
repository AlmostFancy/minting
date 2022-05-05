import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import {
    apiProvider,
    configureChains,
    connectorsForWallets,
    getDefaultWallets,
    lightTheme,
    RainbowKitProvider,
    Theme,
    wallet,
} from '@rainbow-me/rainbowkit';
import merge from 'lodash.merge';
import { chain, createClient, WagmiProvider } from 'wagmi';

const { chains, provider } = configureChains(
    [process.env.NODE_ENV === 'production' ? chain.mainnet : chain.rinkeby],
    [apiProvider.alchemy(process.env.ALCHEMY_ID), apiProvider.fallback()],
);

const { wallets } = getDefaultWallets({
    appName: 'AlmostFancy',
    chains,
});

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: 'More',
        wallets: [wallet.ledger({ chains }), wallet.argent({ chains })],
    },
]);

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiProvider client={wagmiClient}>
            <RainbowKitProvider
                chains={chains}
                showRecentTransactions
                theme={lightTheme()}
            >
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiProvider>
    );
}

export default MyApp;
