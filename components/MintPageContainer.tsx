import { Transition } from '@headlessui/react';
import Head from 'next/head';
import { useMemo } from 'react';
import { shortenAddress } from '../hooks/useShortAddress';
import { useMintingContext } from './MintingProvider';
import PageContainer from './PageContainer';
import PrinterMintContainer from './PrinterMintContainer';
import SideNavigation from './SideNavigation';

function MintPageContainer() {
    const { account, ens } = useMintingContext();

    const overrideFooter = useMemo(() => {
        if (!account) return <></>;
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
                    <PrinterMintContainer />
                </div>
            </PageContainer>
        </>
    );
}

export default MintPageContainer;
