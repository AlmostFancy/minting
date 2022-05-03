import React from 'react';

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

function SideNavigation() {
    return (
        <div className="h-auto flex-row border-t border-black px-10 pb-5 pt-10 font-mono text-sm font-thin xl:h-full xl:w-[25%] xl:border-t-0 xl:border-r xl:pb-0">
            <SplitLines main="supply" last="1,111" />
            <SplitLines main="per wallet" last="01" />
            <SplitLines main="price" last="0.033Ξ" />
            <SplitLines main="mintlist date" last="May 10th" />
            <SplitLines main="public mint" last="May 11th" />

            <p className="pt-5">
                Founders pass offers early access and special perks to those who
                support Almost Fancy with the earliest conviction. Minting and
                holding a founders pass will grant holders a variety of perks,
                including:
            </p>
            <p className="pt-5">
                - early mintlist window with a discounted mint price (⅔ final
                dutch price)
            </p>
            <p className="pt-5">- AF/FC limited edition ████ █████</p>
            <p className="pt-5">- exclusive founders club access</p>
            <p className="pt-5">- ████ █████</p>
            <p className="pt-5">
                Each pass is unique, and limited to 1 per wallet.
            </p>
        </div>
    );
}

export default React.memo(SideNavigation);
