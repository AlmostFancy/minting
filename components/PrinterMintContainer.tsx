/* eslint-disable @next/next/no-img-element */
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import useContractAddress from '../hooks/useContractAddress';
import FoundersTicket from './FoundersTicket';
import { useMintingContext } from './MintingProvider';
import PrinterTop from './Printer/PrinterTop';
import abi from '../abis/AlmostFancyFoundersPass.json';
import { BigNumber } from 'ethers';
import LoadingSpinner from './svg/LoadingSpinner';
import merkle from '../merkle';

type Props = {
    saleState: number;
};

function PrinterMintContainer({ saleState }: Props) {
    const { ticketStatus, error, printerStatus } = useMintingContext();
    const [idx, setIdx] = useState(0);
    const { data: account } = useAccount();
    const [shouldRenderOnList, setShouldRenderOnList] = useState(false);
    const contract = useContractAddress();
    const [minted, setMinted] = useState<number>(-1);
    const [isOnMerkle, setIsOnMerkle] = useState(false);

    useContractRead(
        {
            addressOrName: contract,
            contractInterface: abi,
        },
        'totalSupply',
        {
            enabled: true,
            watch: true,
            staleTime: 10,
            cacheOnBlock: true,
            onSuccess(data) {
                if (data instanceof BigNumber) {
                    setMinted(data.toNumber());
                }
            },
        },
    );

    useEffect(() => {
        if (account) {
            const address = account.address;
            if (address) {
                const toCheck = address.toLowerCase();
                const isOn = toCheck in merkle;
                setIsOnMerkle(isOn);
            }
        } else {
            setIsOnMerkle(false);
        }
    }, [account]);

    useEffect(() => {
        if (!account) {
            setShouldRenderOnList(false);
            return;
        }

        if (saleState == -1 || saleState == 2) {
            setShouldRenderOnList(false);
            return;
        }

        setShouldRenderOnList(true);
    }, [account, saleState]);

    const incrementIdx = useCallback(() => {
        setIdx(idx + 1);
    }, [idx]);

    useEffect(() => {
        let interval = setInterval(() => {
            incrementIdx();
        }, 500);
        return () => clearInterval(interval);
    }, [incrementIdx]);

    const usePrinterStatus = useMemo(() => {
        return printerStatus.concat(Array((idx % 4) + 1).join('.'));
    }, [idx, printerStatus]);

    return (
        <div className="flex min-w-full flex-1 flex-col items-center py-10 xl:min-w-[65%] xl:py-10">
            <div className="text-center">
                <p className="pb-10 text-4xl font-semibold md:text-5xl">
                    Mint your Founders Pass
                </p>
            </div>
            <div className="relative flex min-w-[90%] flex-col md:min-w-[50%]">
                <PrinterTop status={usePrinterStatus} className="z-10" />
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
                    <p className="max-w-md pb-5 font-mono text-red-500 xl:max-w-lg">
                        {error}
                    </p>
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
                                    connect your wallet
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
                {saleState > 0 && (
                    <p className="flex items-center space-x-1 pt-5 text-center">
                        {minted == -1 ? (
                            <LoadingSpinner />
                        ) : (
                            <span className="pr-1 font-bold">{minted}</span>
                        )}{' '}
                        out of <span className="pr-1 font-bold">1,111</span>{' '}
                        have been minted
                    </p>
                )}
                {shouldRenderOnList && (
                    <p className="pt-2">
                        You are{' '}
                        <span className="font-extrabold">
                            {isOnMerkle ? 'on' : 'not on'}
                        </span>{' '}
                        the almost list!
                    </p>
                )}
            </div>
        </div>
    );
}

export default PrinterMintContainer;
