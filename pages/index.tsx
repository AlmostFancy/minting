/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next';
import PageContainer from '../components/PageContainer';
import { Transition } from '@headlessui/react';
import Head from 'next/head';
import FoundersTicket from '../components/FoundersTicket';
import UnderlineLink from '../components/UnderlineLink';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shortenAddress, useEthers, useLookupAddress } from '@usedapp/core';
import PrinterTop from '../components/Printer/PrinterTop';

type SplitLineProps = {
    main: string;
    last: string;
};

const SplitLines = ({ main, last }: SplitLineProps) => (
    <div className="flex w-full justify-between pb-5">
        <p>{main}</p>
        <p>/</p>
        <p>{last}</p>
    </div>
);

const MainPage: NextPage = () => {
    const { activateBrowserWallet, account, deactivate, error } = useEthers();
    const ens = useLookupAddress();
    const [idx, setIdx] = useState(0);

    const incrementIdx = useCallback(() => {
        setIdx(idx + 1);
    }, [idx]);

    useEffect(() => {
        let interval = setInterval(() => {
            incrementIdx();
        }, 500);
        return () => clearInterval(interval);
    }, [incrementIdx]);

    const printerStatus = useMemo(() => {
        let status = 'waiting';
        if (account) {
            status = 'connected';
        }

        if (error) {
            status = 'failed';
        }

        return status.concat(Array((idx % 4) + 1).join('.'));
    }, [idx, account, error]);

    const overrideFooter = useMemo(() => {
        if (!account) return null;
        return (
            <Transition
                show={true}
                appear={true}
                enter="duration-75 ease-in"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                className={'sticky bottom-0'}
            >
                <div
                    className={`flex h-auto w-full flex-col items-center space-y-5 border-t border-black bg-black py-[20px] px-[20px] font-mono text-white md:h-[70px] md:flex-row md:justify-between md:space-y-0 md:px-[40px]`}
                >
                    <div className={`flex w-full justify-between xl:w-[40%]`}>
                        <p className="block font-light md:hidden xl:block">
                            connected to
                        </p>
                        <p className="block font-light md:hidden xl:block">/</p>
                        <p className="hidden font-light xl:block">
                            {ens ? ens : shortenAddress(account)}
                        </p>
                        <p className="block font-light xl:hidden">
                            {ens ? ens : shortenAddress(account)}
                        </p>
                    </div>
                    <div>
                        <button className="bg-white px-10 py-3 font-sans font-semibold uppercase text-black">
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
                        <SplitLines main="mintlist date" last="May 10" />
                        <SplitLines main="public mint" last="May 11" />

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
                            {/* <Image
                                src={'/images/red_x.svg'}
                                height={100}
                                width={100}
                                alt="x"
                                className="absolute top-0 left-0"
                            /> */}
                            <p className="pb-10 text-4xl font-semibold md:text-5xl">
                                Mint your Founders Pass
                            </p>
                        </div>
                        <div className="relative flex min-w-[90%] flex-col overflow-hidden md:min-w-[50%]">
                            <PrinterTop
                                status={printerStatus}
                                className="z-10"
                            />
                            <FoundersTicket className="absolute left-1/2 ml-[-45px] w-[100px] text-center" />
                            <img
                                src="/images/printer-bottom.svg"
                                className="aspect-auto"
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
                            {error && (
                                <p className="pb-5 font-mono text-red-500">
                                    {error.message}
                                </p>
                            )}
                            <button
                                className="bg-black px-10 py-2 font-semibold uppercase text-white"
                                onClick={() =>
                                    account
                                        ? deactivate()
                                        : activateBrowserWallet()
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
        </>
    );
};

export default MainPage;
