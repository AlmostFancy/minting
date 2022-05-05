import { Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode, useMemo } from 'react';
import useComponentVisible from '../hooks/useComponentVisible';

type PageContainerProps = {
    children: ReactNode;
    borderColor?: string;
    overrideFooter?: ReactNode;
};

function PageContainer({
    children,
    overrideFooter = null,
}: PageContainerProps) {
    const { ref, toggle, isComponentVisible } = useComponentVisible(false);

    const navbarComponents = useMemo(() => {
        return (
            <>
                <p className="cursor-not-allowed text-lg font-medium text-black line-through transition-all duration-75 hover:text-gray-600 md:text-2xl">
                    SHOP
                </p>
                <p className="cursor-not-allowed text-lg font-medium text-black line-through transition-all duration-75 hover:text-gray-600 md:pl-[28px] md:text-2xl">
                    LIFE
                </p>
                <div className="flex flex-col md:flex-row">
                    <Link href="https://almostfancy.com/mint/the-nfts">
                        <a className="text-lg font-medium text-black transition-all duration-75 ease-in-out hover:text-gray-600 md:pl-[28px] md:text-2xl">
                            MINT
                        </a>
                    </Link>
                    <Link href="https://almostfancy.com/manifest/vision-not-roadmap">
                        <a className="text-lg font-medium text-black transition-all duration-75 ease-in-out hover:text-gray-600 md:pl-[28px] md:text-2xl">
                            MANIFEST
                        </a>
                    </Link>
                </div>
            </>
        );
    }, []);

    return (
        <div className="flex h-screen flex-col">
            <div
                className={`borde-black flex min-h-[80px] w-full items-center justify-between border-b bg-white px-[20px] py-[15px] text-center md:px-[40px] md:py-[21px]`}
            >
                <Link href="/">
                    <a className="text-lg font-semibold uppercase text-black transition-all duration-100 hover:text-brand-red md:text-3xl">
                        almost fancy
                    </a>
                </Link>
                <div className="hidden md:flex md:flex-row">
                    {navbarComponents}
                </div>
                <div className="block md:hidden">
                    {!isComponentVisible ? (
                        <div
                            className="cursor-pointer space-y-2"
                            onClick={toggle}
                        >
                            <span className="block h-0.5 w-8 bg-gray-600"></span>
                            <span className="block h-0.5 w-5 bg-gray-600"></span>
                        </div>
                    ) : (
                        <p
                            className="cursor-pointer text-3xl font-medium uppercase"
                            onClick={toggle}
                        >
                            X
                        </p>
                    )}
                </div>
                <div className="hidden md:block"></div>
            </div>
            <main className="mb-auto flex flex-1">{children}</main>
            <Transition.Root show={isComponentVisible}>
                <Transition.Child
                    as="div"
                    className="absolute top-[80px] h-auto w-full flex-col border-b border-b-black bg-white px-5 md:hidden"
                    enter="transition-all duration-300"
                    leave="transition-all duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div ref={ref}>{navbarComponents}</div>
                </Transition.Child>
            </Transition.Root>
            {!overrideFooter && (
                <div
                    className={`relative bottom-0 hidden h-[70px] w-full items-center justify-between border-t border-black bg-white py-[20px] px-[20px] text-center md:flex md:px-[40px]`}
                >
                    <p className="font-mono text-lg font-normal text-black">
                        we are{' '}
                        <span className="hover:font-extrabold">almost</span>{' '}
                        fancy
                    </p>
                    <div className="flex flex-row space-x-5">
                        <Link href="https://twitter.com/almostfancy">
                            <a target="_blank">
                                <Image
                                    className="hover:opacity-60"
                                    src="/images/twitter.svg"
                                    height={25}
                                    width={25}
                                    alt="Twitter"
                                />
                            </a>
                        </Link>
                        <Link href="https://instagram.com/thealmostfancy">
                            <a target="_blank">
                                <Image
                                    className="hover:opacity-60"
                                    src="/images/instagram.svg"
                                    height={25}
                                    width={25}
                                    alt="Instagram"
                                />
                            </a>
                        </Link>
                        <Link href="https://discord.gg/almostfancy">
                            <a target="_blank">
                                <Image
                                    className="hover:opacity-60"
                                    src="/images/discord.svg"
                                    height={25}
                                    width={25}
                                    alt="Discord"
                                />
                            </a>
                        </Link>
                    </div>
                </div>
            )}
            {!!overrideFooter && overrideFooter}
        </div>
    );
}

export default PageContainer;
