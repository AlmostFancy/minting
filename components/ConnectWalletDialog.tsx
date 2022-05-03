import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import useHasMetaMask from '../hooks/useHasMetaMask';
import { ConnectType, useMintingContext } from './MintingProvider';
import UnderlineLink from './UnderlineLink';

type ConnectWalletDialogProps = {
    connectWallet: boolean;
    setConnectWallet: (show: boolean) => void;
};

function ConnectWalletDialog({
    connectWallet,
    setConnectWallet,
}: ConnectWalletDialogProps) {
    const hasMetaMask = useHasMetaMask();
    const { connect } = useMintingContext();
    const [learning, setLearning] = useState(false);

    useEffect(() => {
        if (connectWallet) {
            setLearning(false);
        }
    }, [connectWallet]);

    const handleConnect = useCallback(
        (type: ConnectType) => {
            setConnectWallet(false);
            connect(type);
        },
        [connect, setConnectWallet],
    );
    return (
        <Transition.Root show={connectWallet} as={Fragment}>
            <Dialog
                onClose={setConnectWallet}
                className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]"
            >
                <Transition.Child
                    enter="duration-300 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-200 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500/75"></Dialog.Overlay>
                </Transition.Child>
                <Transition.Child
                    enter="duration-300 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-200 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="relative mx-auto flex max-w-xl flex-col items-center border border-black bg-white py-4 text-center">
                        <p
                            className="absolute right-2 top-0 cursor-pointer font-mono text-2xl hover:text-brand-red"
                            onClick={() => setConnectWallet(false)}
                        >
                            x
                        </p>
                        {!learning && (
                            <>
                                <p className="pb-5 text-center text-lg font-semibold underline underline-offset-2">
                                    Connect your wallet
                                </p>
                                {hasMetaMask && (
                                    <button
                                        className="mb-5 flex w-[90%] flex-row items-center justify-between border border-black px-4 py-2 text-center hover:bg-black hover:text-white focus:outline-none"
                                        onClick={() =>
                                            handleConnect(ConnectType.META_MASK)
                                        }
                                    >
                                        <p>Connect via MetaMask</p>
                                        <Image
                                            src={'/images/metamask-fox.svg'}
                                            width={40}
                                            height={40}
                                            alt="MetaMask"
                                        />
                                    </button>
                                )}
                                <button
                                    className="mb-5 flex w-[90%] flex-row items-center justify-between border border-black px-4 py-2 text-center hover:bg-black hover:text-white focus:outline-none"
                                    onClick={() =>
                                        handleConnect(
                                            ConnectType.WALLET_CONNECT,
                                        )
                                    }
                                >
                                    <p>Connect via WalletConnect</p>
                                    <Image
                                        src={'/images/walletconnect-logo.svg'}
                                        width={40}
                                        height={40}
                                        alt="WalletConnect"
                                    />
                                </button>
                                <p
                                    className="cursor-pointer text-sm font-bold underline decoration-dotted underline-offset-2 hover:opacity-60"
                                    onClick={() => setLearning(true)}
                                >
                                    What is a wallet?
                                </p>
                            </>
                        )}
                        {learning && (
                            <>
                                <svg
                                    width={20}
                                    height={20}
                                    className="absolute left-2 top-2 cursor-pointer font-mono text-2xl hover:fill-brand-red"
                                    onClick={() => setLearning(false)}
                                >
                                    <path d="M6.78602 0.341797C6.52517 0.341797 6.26403 0.441219 6.06523 0.636719L0.298955 6.29297C-0.0996515 6.68397 -0.0996515 7.31703 0.298955 7.70703L6.06523 13.3633C6.46384 13.7543 7.10922 13.7543 7.5068 13.3633L7.59441 13.2773C7.99302 12.8863 7.99302 12.2533 7.59441 11.8633L3.65598 8H16.9805C17.5433 8 18 7.552 18 7C18 6.448 17.5433 6 16.9805 6H3.65598L7.59441 2.13672C7.99302 1.74572 7.99302 1.11266 7.59441 0.722656L7.5068 0.636719C7.3075 0.441219 7.04687 0.341797 6.78602 0.341797Z"></path>
                                </svg>
                                <p className="pb-5 text-center text-lg font-semibold underline underline-offset-2">
                                    What is a wallet?
                                </p>
                                <p className="max-w-[80%] pb-5 text-center text-base">
                                    A wallet stores your digital assets such as
                                    Ether and NFTs. They can be browser
                                    extensions, mobile apps, or even pieces of
                                    hardware.{' '}
                                </p>
                                <p className="max-w-[80%] pb-5 text-center text-base">
                                    To get started, we recommend installing{' '}
                                    <UnderlineLink url="https://metamask.io/">
                                        MetaMask
                                    </UnderlineLink>{' '}
                                    or{' '}
                                    <UnderlineLink url="https://rainbow.me">
                                        Rainbow
                                    </UnderlineLink>{' '}
                                    (if you&apos;re on mobile)!
                                </p>
                            </>
                        )}
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition.Root>
    );
}

export default ConnectWalletDialog;
