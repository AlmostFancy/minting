import { Rinkeby, useEthers } from '@usedapp/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import React, {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import useHasMetaMask from '../hooks/useHasMetaMask';

enum ConnectType {
    META_MASK,
    WALLET_CONNECT,
}

enum TicketStatus {
    DISCONNECTED,
    CONNECTED,
    MINTING,
}

type MintingCtx = {
    connect: (type: ConnectType) => void;
    disconnect: () => void;
    account: string | null | undefined;
    ticketStatus: TicketStatus;
    setTicketStatus: (status: TicketStatus) => void;

    error: string;
    setError: (error: string) => void;
};

const MintingContext = React.createContext<MintingCtx | null>(null);

const walletConnect = new WalletConnectConnector({
    rpc: {
        [Rinkeby.chainId]:
            'https://eth-rinkeby.alchemyapi.io/v2/9R_yWpWjLB7vKcGfCR_I2HU-X5Fuahol',
    },
    qrcode: true,
});

type MintingProviderProps = {
    children: ReactNode;
};

function MintingProvider({ children }: MintingProviderProps) {
    const {
        activate,
        activateBrowserWallet,
        deactivate,
        error: ethersErr,
        account,
    } = useEthers();
    const [error, setError] = useState('');
    const hasMetaMask = useHasMetaMask();
    const [ticketStatus, setTicketStatus] = useState<TicketStatus>(
        TicketStatus.DISCONNECTED,
    );

    useEffect(() => {
        if (!account) {
            setTicketStatus(TicketStatus.DISCONNECTED);
        }
    }, [account]);

    useEffect(() => {
        if (ethersErr) {
            if (typeof ethersErr === 'string') {
                setError(ethersErr);
            } else {
                setError(ethersErr.message);
            }
        }
    }, [ethersErr]);

    const connect = useCallback(
        (type: ConnectType) => {
            setError('');
            if (type === ConnectType.META_MASK) {
                try {
                    if (!hasMetaMask) {
                        setError('MetaMask is not installed!');
                        return;
                    }
                    activateBrowserWallet();
                    setTicketStatus(TicketStatus.CONNECTED);
                } catch (err) {
                    if (typeof err === 'string') {
                        setError(err);
                    } else if (err instanceof Error) {
                        setError(err.message);
                    }
                }
            } else if (type === ConnectType.WALLET_CONNECT) {
                activate(walletConnect)
                    .then(() => {
                        setTicketStatus(TicketStatus.CONNECTED);
                    })
                    .catch((err) => {
                        if (typeof err === 'string') {
                            setError(err);
                        } else if (err instanceof Error) {
                            setError(err.message);
                        }
                    });
            }
        },
        [activate, activateBrowserWallet, hasMetaMask],
    );

    const ctx: MintingCtx = useMemo(
        () => ({
            connect,
            disconnect: deactivate,
            ticketStatus,
            setTicketStatus,
            error,
            setError,
            account,
        }),
        [
            connect,
            deactivate,
            ticketStatus,
            setTicketStatus,
            error,
            setError,
            account,
        ],
    );

    return (
        <MintingContext.Provider value={ctx}>
            {children}
        </MintingContext.Provider>
    );
}

const useMintingContext = (): MintingCtx => {
    const ctx = useContext(MintingContext);
    if (!ctx) {
        throw new Error(
            'useMintingContext must be used within a MintingProvider',
        );
    }

    return ctx;
};

export { useMintingContext, TicketStatus, ConnectType };

export default MintingProvider;
