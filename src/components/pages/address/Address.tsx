import Web3 from 'web3';
import React from 'react';
import { useParams } from 'react-router-dom';

import NotFound from '../../404/NotFound';

const Address: React.FC = () => {
    const {address=""} = useParams();

    if (
        !address ||
        !Web3.utils.isAddress(address)
    ) return <NotFound message='Address Not Found' />

    return (
        <h1>Address: {address}</h1>
    );
};

export default Address;