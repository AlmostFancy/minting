import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import MintingProvider from '../components/MintingProvider';
import MintPageContainer from '../components/MintPageContainer';

const Index: NextPage = () => {
    return (
        <MintingProvider>
            <Head>
                <title>AlmostFancy - Minting</title>
            </Head>
            <MintPageContainer />
        </MintingProvider>
    );
};

export default Index;
