import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import {
    apiProvider,
    configureChains,
    connectorsForWallets,
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

const connectors = connectorsForWallets([
    {
        groupName: 'Fancy Ones',
        wallets: [
            wallet.metaMask({ chains }),
            wallet.walletConnect({ chains }),
            wallet.rainbow({ chains }),
        ],
    },
    {
        groupName: 'Almost Fancy Ones',
        wallets: [
            wallet.ledger({ chains }),
            wallet.coinbase({ appName: 'Almost Fancy', chains }),
            wallet.argent({ chains }),
        ],
    },
]);

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

const rainbowTheme = merge(
    lightTheme({
        borderRadius: 'none',
        accentColor: 'black',
    }),
    {
        colors: {
            modalBorder: 'black',
        },
    } as Theme,
);

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiProvider client={wagmiClient}>
            <RainbowKitProvider
                chains={chains}
                showRecentTransactions
                theme={rainbowTheme}
            >
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiProvider>
    );
}

export default MyApp;
