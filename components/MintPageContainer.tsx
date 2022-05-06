import { Transition } from '@headlessui/react';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useEnsName } from 'wagmi';
import { shortenAddress } from '../hooks/useShortAddress';
import PageContainer from './PageContainer';
import PrinterMintContainer from './PrinterMintContainer';
import SideNavigation from './SideNavigation';

function MintPageContainer() {
    const { data: account } = useAccount();
    const { data: ens } = useEnsName({ address: account?.address });

    const [shouldRenderFooter, setShouldRenderFooter] = useState(false);

    useEffect(() => {
        console.log(account);
        if (!!account) {
            setShouldRenderFooter(true);
        } else {
            setShouldRenderFooter(false);
        }
    }, [account]);

    const overrideFooter = useMemo(() => {
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
                        <p className="font-light">
                            {ens ? ens : shortenAddress(account?.address)}
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
    }, [account, ens]);

    return (
        <>
            <Head>
                <title>AlmostFancy - Founders Pass Mint</title>
            </Head>
            <PageContainer
                overrideFooter={shouldRenderFooter ? overrideFooter : null}
            >
                <div className="pg-10 flex flex-1 flex-col-reverse xl:flex-row">
                    <SideNavigation />
                    <PrinterMintContainer />
                </div>
            </PageContainer>
        </>
    );
}

export default MintPageContainer;
