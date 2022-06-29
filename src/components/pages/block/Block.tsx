import React from 'react';
import { useParams } from 'react-router-dom';

const Block: React.FC = () => {
    const {blockNumber=""} = useParams();
    if (!blockNumber || isNaN(Number(blockNumber))) return (
        <h1>Invalid Block Number</h1>
    )

    return (
        <h1>Block: {blockNumber}</h1>
    )
};

export default Block;