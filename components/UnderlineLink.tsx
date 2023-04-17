import Link from 'next/link';
import React from 'react';

type UnderlineLinkProps = {
    url: string;
};

function UnderlineLink({
    url,
    children,
}: React.PropsWithChildren<UnderlineLinkProps>) {
    return (
        <Link href={url}>
            <a
                className="font-bold underline decoration-dotted underline-offset-2 hover:opacity-60"
                target={'_blank'}
                rel="noreferrer"
            >
                {children}
            </a>
        </Link>
    );
}

export default React.memo(UnderlineLink);
