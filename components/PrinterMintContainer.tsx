/* eslint-disable @next/next/no-img-element */
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FoundersTicket from './FoundersTicket';
import { useMintingContext } from './MintingProvider';
import PrinterTop from './Printer/PrinterTop';
import UnderlineLink from './UnderlineLink';

function PrinterMintContainer() {
    const { ticketStatus, error, account } = useMintingContext();
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

    return (
        <div className="flex min-w-full flex-1 flex-col items-center py-10 xl:min-w-[65%] xl:py-10">
            <div className="text-center">
                <p className="pb-10 text-4xl font-semibold md:text-5xl">
                    Mint your Founders Pass
                </p>
            </div>
            <div className="relative flex min-w-[90%] flex-col md:min-w-[50%]">
                <PrinterTop status={printerStatus} className="z-10" />
                <FoundersTicket
                    className={`absolute left-1/2 ml-[-45px] w-[100px] text-center transition-all duration-700 ${
                        ticketStatus == 0
                            ? 'pt-5'
                            : ticketStatus == 1
                            ? 'mt-14 xl:mt-20'
                            : 'mt-[90px] xl:mt-36'
                    }`}
                />
                <img
                    src="/images/printer-bottom.svg"
                    className="aspect-auto select-none"
                    width="100%"
                    alt="Printer Bottom"
                />
            </div>
            <div className="items-center pt-5 text-center">
                {error && (
                    <p className="pb-5 font-mono text-red-500">{error}</p>
                )}
                <ConnectButton.Custom>
                    {({
                        openAccountModal,
                        openConnectModal,
                        openChainModal,
                        account,
                        chain,
                        mounted,
                    }) => {
                        if (!mounted || !account || !chain) {
                            return (
                                <button
                                    className="bg-black px-10 py-2 font-semibold uppercase text-white hover:text-gray-300"
                                    onClick={openConnectModal}
                                >
                                    minting may 18
                                </button>
                            );
                        }

                        if (chain?.unsupported) {
                            return (
                                <button
                                    className="bg-black px-10 py-2 font-semibold uppercase text-white hover:text-gray-300"
                                    onClick={openChainModal}
                                >
                                    wrong network
                                </button>
                            );
                        }
                        return (
                            <button
                                className="bg-black px-10 py-2 font-semibold uppercase text-white hover:text-gray-300"
                                onClick={openAccountModal}
                            >
                                manage account
                            </button>
                        );
                    }}
                </ConnectButton.Custom>
                <p className="pt-5">
                    Enter the almost list raffle{' '}
                    <UnderlineLink url="https://www.premint.xyz/almostfancy/">
                        on Premint
                    </UnderlineLink>
                </p>
            </div>
        </div>
    );
}

export default React.memo(PrinterMintContainer);
