import Web3 from 'web3';
import React from 'react';
import { useParams } from 'react-router-dom';


const Address: React.FC = () => {
    const {address=""} = useParams();
    if (!address || !Web3.utils.isAddress(address)) return (
        <h1>Invalid Address</h1>
    )

    return (
        <h1>Address: {address}</h1>
    )
};

export default Address;