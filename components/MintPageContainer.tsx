import { Dialog, Transition } from '@headlessui/react';
import { shortenAddress, useEthers, useLookupAddress } from '@usedapp/core';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import useHasMetaMask from '../hooks/useHasMetaMask';
import ConnectWalletDialog from './ConnectWalletDialog';
import { TicketStatus, useMintingContext } from './MintingProvider';
import PageContainer from './PageContainer';
import PrinterMintContainer from './PrinterMintContainer';
import SideNavigation from './SideNavigation';

function MintPageContainer() {
    const { account, setTicketStatus } = useMintingContext();
    const ens = useLookupAddress();
    const hasMetaMask = useHasMetaMask();
    const [connectWallet, setConnectWallet] = useState(false);

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
                            className="cursor-not-allowed bg-white px-10 py-3 font-sans font-semibold uppercase text-black"
                            disabled
                        >
                            minting may 18th
                        </button>
                    </div>
                </div>
            </Transition>
        );
    }, [ens, account]);

    return (
        <>
            <Head>
                <title>AlmostFancy - Founders Pass Mint</title>
            </Head>
            <PageContainer overrideFooter={overrideFooter}>
                <div className="pg-10 flex flex-1 flex-col-reverse xl:flex-row">
                    <SideNavigation />
                    <PrinterMintContainer setConnectWallet={setConnectWallet} />
                </div>
            </PageContainer>
            <ConnectWalletDialog
                setConnectWallet={setConnectWallet}
                connectWallet={connectWallet}
            />
        </>
    );
}

export default MintPageContainer;
