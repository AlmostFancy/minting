/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next';
import PageContainer from '../components/PageContainer';
import { Dialog, Transition } from '@headlessui/react';
import Head from 'next/head';
import FoundersTicket from '../components/FoundersTicket';
import UnderlineLink from '../components/UnderlineLink';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Rinkeby,
    shortenAddress,
    useEthers,
    useLookupAddress,
} from '@usedapp/core';
import PrinterTop from '../components/Printer/PrinterTop';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import useHasMetaMask from '../hooks/useHasMetaMask';
import Link from 'next/link';
import Image from 'next/image';

type SplitLineProps = {
    main: string;
    last: string;
};

const SplitLines = ({ main, last }: SplitLineProps) => (
    <div className="relative flex w-full justify-between pb-5">
        <p>{main}</p>
        <p className="absolute left-1/2">/</p>
        <p>{last}</p>
    </div>
);

const walletConnect = new WalletConnectConnector({
    rpc: {
        [Rinkeby.chainId]:
            'https://eth-rinkeby.alchemyapi.io/v2/9R_yWpWjLB7vKcGfCR_I2HU-X5Fuahol',
    },
    qrcode: true,
});

const MainPage: NextPage = () => {
    const { activate, activateBrowserWallet, account, deactivate, error } =
        useEthers();
    const [connectWallet, setConnectWallet] = useState(false);
    const [err, setErr] = useState('');
    const hasMetaMask = useHasMetaMask();
    const ens = useLookupAddress();
    const [idx, setIdx] = useState(0);
    const [ticketStatus, setTicketStatus] = useState(0);

    useEffect(() => {
        if (error) {
            if (typeof error === 'string') {
                setErr(error);
            } else {
                setErr(error.message);
            }
        }
    }, [error]);

    const incrementIdx = useCallback(() => {
        setIdx(idx + 1);
    }, [idx]);

    useEffect(() => {
        let interval = setInterval(() => {
            incrementIdx();
        }, 500);
        return () => clearInterval(interval);
    }, [incrementIdx]);

    useEffect(() => {
        if (!account) {
            setTicketStatus(0);
        } else {
            setTicketStatus(1);
        }
    }, [account]);

    const disconnect = () => {
        setTicketStatus(0);
        deactivate();
    };

    const activateMM = () => {
        try {
            setErr('');
            setConnectWallet(false);
            if (!hasMetaMask) {
                setErr('MetaMask is not installed!');
                return;
            }

            activateBrowserWallet();
        } catch (err) {
            if (typeof err === 'string') {
                setErr(err);
            } else if (err instanceof Error) {
                setErr(err.message);
            }
        }
    };

    const activateWC = () => {
        setConnectWallet(false);
        setErr('');
        activate(walletConnect).catch((err) => {
            if (typeof err === 'string') {
                setErr(err);
            } else if (err instanceof Error) {
                setErr(err.message);
            }
        });
    };

    const printerStatus = useMemo(() => {
        let status = 'waiting';
        if (account) {
            status = 'connected';
        }

        if (err) {
            status = 'failed';
        }

        return status.concat(Array((idx % 4) + 1).join('.'));
    }, [idx, account, err]);

    const overrideFooter = useMemo(() => {
        if (!account) return null;
        return (
            <Transition
                show={true}
                appear={true}
                enter="duration-75 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                className={'sticky bottom-0'}
            >
                <div
                    className={`flex h-auto w-full flex-col items-center space-y-5 border-t border-black bg-black py-[20px] px-[20px] font-mono text-white md:h-[70px] md:flex-row md:justify-between md:space-y-0 md:px-[40px]`}
                >
                    <div
                        className={`relative flex w-full justify-between xl:w-[30%] `}
                    >
                        <p className="block font-light md:hidden md:pr-0 xl:block">
                            connected to
                        </p>
                        <p className="block font-light md:hidden md:pr-0 xl:block">
                            /
                        </p>
                        <p className="hidden font-light xl:block">
                            {ens ? ens : shortenAddress(account)}
                        </p>
                        <p className="block font-light xl:hidden">
                            {ens ? ens : shortenAddress(account)}
                        </p>
                    </div>
                    <div>
                        <button
                            className="bg-white px-10 py-3 font-sans font-semibold uppercase text-black"
                            onClick={() => setTicketStatus(2)}
                        >
                            mint
                        </button>
                    </div>
                </div>
            </Transition>
        );
    }, [ens, account]);

    return (
        <>
            <Head>
                <title>AlmostFancy - Minting</title>
            </Head>
            <PageContainer overrideFooter={overrideFooter}>
                <div className="pg-10 flex flex-1 flex-col-reverse xl:flex-row">
                    <div className="h-auto flex-row border-t border-black px-10 pb-5 pt-10 font-mono text-sm font-thin xl:h-full xl:w-[25%] xl:border-t-0 xl:border-r xl:pb-0">
                        <SplitLines main="supply" last="1,111" />
                        <SplitLines main="per wallet" last="01" />
                        <SplitLines main="price" last="0.033Ξ" />
                        <SplitLines main="mintlist date" last="May 10th" />
                        <SplitLines main="public mint" last="May 11th" />

                        <p className="pt-5">
                            Founders pass offers early access and special perks
                            to those who support Almost Fancy with the earliest
                            conviction. Minting and holding a founders pass will
                            grant holders a variety of perks, including:
                        </p>
                        <p className="pt-5">
                            - early mintlist window with a discounted mint price
                            (⅔ final dutch price)
                        </p>
                        <p className="pt-5">
                            - AF/FC limited edition ████ █████
                        </p>
                        <p className="pt-5">- exclusive founders club access</p>
                        <p className="pt-5">- ████ █████</p>
                        <p className="pt-5">
                            Each pass is unique, and limited to 1 per wallet.
                        </p>
                    </div>
                    <div className="flex min-w-full flex-1 flex-col items-center py-10 xl:min-w-[65%] xl:py-10">
                        <div className="text-center">
                            <p className="pb-10 text-4xl font-semibold md:text-5xl">
                                Mint your Founders Pass
                            </p>
                        </div>
                        <div className="relative flex min-w-[90%] flex-col md:min-w-[50%]">
                            <PrinterTop
                                status={printerStatus}
                                className="z-10"
                            />
                            <FoundersTicket
                                className={`absolute left-1/2 ml-[-45px] w-[100px] text-center transition-all duration-700 ${
                                    ticketStatus == 0
                                        ? 'pt-5'
                                        : ticketStatus == 1
                                        ? 'mt-20'
                                        : 'mt-24 xl:mt-36'
                                }`}
                            />
                            <img
                                src="/images/printer-bottom.svg"
                                className="aspect-auto select-none"
                                width="100%"
                                alt="Printer Bottom"
                            />
                        </div>
                        {/* <div
                            className={`-z-10 transition-all duration-1000 ease-in-out ${
                                account ? 'translate-y-[20px]' : 'translate-y-0'
                            }`}
                        >
                            <FoundersTicket />
                        </div> */}
                        <div className="items-center pt-5 text-center">
                            {err && (
                                <p className="pb-5 font-mono text-red-500">
                                    {err}
                                </p>
                            )}
                            <button
                                className="bg-black px-10 py-2 font-semibold uppercase text-white hover:text-gray-300"
                                onClick={() =>
                                    account
                                        ? disconnect()
                                        : setConnectWallet(true)
                                }
                            >
                                {account ? 'disconnect' : 'minting may 10'}
                            </button>
                            <p className="pt-5">
                                Enter the almost list raffle{' '}
                                <UnderlineLink url="https://www.premint.xyz/almostfancy/">
                                    on Premint
                                </UnderlineLink>
                            </p>
                        </div>
                    </div>
                </div>
            </PageContainer>
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
                                className="absolute right-2 top-0 cursor-pointer font-mono text-2xl hover:scale-95 hover:text-brand-red"
                                onClick={() => setConnectWallet(false)}
                            >
                                x
                            </p>
                            <p className="pb-5 text-center text-lg font-semibold underline underline-offset-2">
                                Connect your wallet
                            </p>
                            {hasMetaMask && (
                                <button
                                    className="mb-5 flex w-[90%] flex-row items-center justify-between border border-black px-4 py-2 text-center hover:bg-black hover:text-white focus:outline-none"
                                    onClick={activateMM}
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
                                onClick={activateWC}
                            >
                                <p>Connect via WalletConnect</p>
                                <Image
                                    src={'/images/walletconnect-logo.svg'}
                                    width={40}
                                    height={40}
                                    alt="WalletConnect"
                                />
                            </button>
                            <Link href={'#'}>
                                <a
                                    className="text-sm font-bold underline decoration-dotted underline-offset-2 hover:opacity-60"
                                    target={'_blank'}
                                    rel="noreferrer"
                                >
                                    New to Ethereum?
                                </a>
                            </Link>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition.Root>
        </>
    );
};

export default MainPage;
