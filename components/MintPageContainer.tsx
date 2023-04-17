import { Transition } from '@headlessui/react';
import Head from 'next/head';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    useAccount,
    useContractRead,
    useContractWrite,
    useEnsName,
    useWaitForTransaction,
} from 'wagmi';
import useContractAddress from '../hooks/useContractAddress';
import { shortenAddress } from '../hooks/useShortAddress';
import PageContainer from './PageContainer';
import PrinterMintContainer from './PrinterMintContainer';
import SideNavigation from './SideNavigation';
import abi from '../abis/AlmostFancyFoundersPass.json';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { TicketStatus, useMintingContext } from './MintingProvider';
import LoadingSpinner from './svg/LoadingSpinner';
import { parseEther } from 'ethers/lib/utils';
import merkleTree from '../merkle';

function MintPageContainer() {
    const { setTicketStatus, setError, setPrinterStatus } = useMintingContext();
    const { data: account } = useAccount();
    const { data: ens } = useEnsName({ address: account?.address });
    const [saleState, setSaleState] = useState(-1); // -1 = loading
    const contractAddress = useContractAddress();
    const addRecentTx = useAddRecentTransaction();
    const [txHash, setTxHash] = useState<string>();
    const [merkleProof, setMerkleProof] = useState<string[]>();

    const { isLoading: isMinting } = useWaitForTransaction({
        hash: txHash,
        enabled: !!txHash,
        onSuccess() {
            setTicketStatus(TicketStatus.MINTING);
            setPrinterStatus('printed');
        },
        onError(error) {
            if ('error' in error) {
                const { error: realError } = error as unknown as any;
                const { message } = realError;
                setError(message);
            } else {
                setError(error.message);
            }
        },
    });

    const { isLoading: isWriting, write: mint } = useContractWrite(
        {
            addressOrName: contractAddress,
            contractInterface: abi,
        },
        saleState == 1 ? 'mintAlmostList' : 'mintPublic',
        {
            args: saleState == 1 && [merkleProof],
            overrides: {
                value: parseEther('0.033'),
            },
            onSuccess(tx) {
                addRecentTx({
                    hash: tx.hash,
                    description: 'Mint an Almost Fancy Founders Pass',
                });
                setPrinterStatus('printing');
                setTxHash(tx.hash);
            },
            onError(error) {
                if ('error' in error) {
                    const { error: realError } = error as unknown as any;
                    const { message } = realError;
                    setError(message);
                } else {
                    setError(error.message);
                }
            },
        },
    );

    // todo, once sale state is not 0, we check if they _can_ mint
    useContractRead(
        {
            addressOrName: contractAddress,
            contractInterface: abi,
        },
        'saleState',
        {
            enabled: !!account,
            watch: true,
            staleTime: 10,
            cacheOnBlock: true,
            onSuccess(data) {
                if (typeof data === 'number') {
                    setSaleState(data);
                }
            },
        },
    );

    const sendMint = useCallback(() => {
        if (saleState == 1 && !merkleProof) {
            return;
        }
        setError('');
        mint();
    }, [setError, mint, saleState, merkleProof]);

    const [shouldRenderFooter, setShouldRenderFooter] = useState(false);

    useEffect(() => {
        if (account) {
            setShouldRenderFooter(true);
            const address = account.address;
            if (address) {
                const toCheck = address.toLowerCase();
                const proof = merkleTree[toCheck];
                if (proof) {
                    console.log('fetched merkle', proof);
                    setMerkleProof(proof);
                } else {
                    setMerkleProof(undefined);
                }
            }
        } else {
            setShouldRenderFooter(false);
            setMerkleProof(undefined);
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
                            onClick={sendMint}
                            className={`flex items-center justify-center bg-white px-10 py-3 text-center font-sans font-semibold uppercase text-black ${
                                saleState == 0 ||
                                (saleState == 1 &&
                                    !merkleProof &&
                                    'cursor-not-allowed')
                            }`}
                            disabled={
                                saleState == 0 ||
                                (saleState == 1 && !merkleProof)
                            }
                        >
                            {(isWriting || isMinting) && <LoadingSpinner />}
                            {saleState == 0
                                ? 'minting may 18th'
                                : saleState == 1 && !!merkleProof
                                ? 'mint now'
                                : saleState == 2
                                ? 'mint now'
                                : 'minting may 18th'}
                        </button>
                    </div>
                </div>
            </Transition>
        );
    }, [account, ens, saleState, isWriting, isMinting, sendMint, merkleProof]);

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
                    <PrinterMintContainer saleState={saleState} />
                </div>
            </PageContainer>
        </>
    );
}

export default MintPageContainer;
