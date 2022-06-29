import React from 'react';
import { useParams } from 'react-router-dom';

import { isTransactionHash } from '../../../services/web3';

const Tx: React.FC = () => {
    const {hash=""} = useParams();
    if (!hash || !isTransactionHash(hash)) return (
        <h1>Invalid Hash</h1>
    )

    return (
        <h1>Hash: {hash}</h1>
    )
};

export default Tx;