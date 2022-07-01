import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loading, Notify } from 'notiflix';

import Table from '../../table/Table';

import { getLatestBlock, getBlock, BlockTransactionsObject } from '../../../services/web3';

import './block.scss';

const Block: React.FC = () => {
    const {blockNumber=""} = useParams();

    const isBlock = (!blockNumber.startsWith('0x') && Number(blockNumber) && Number(blockNumber) > 0)

    const [loading, setLoading] = useState(false);
    const [block, setBlock] = useState<BlockTransactionsObject | null>(null);
    const [cooldouwn, setCooldown] = useState<Date | null>(null);

    useEffect(() => {
        const fetchBlock = async () => {
            setLoading(true);

            await getLatestBlock().then(async (latest) => {
                if (latest.number === Number(blockNumber)) return setBlock(latest);

                if (Number(blockNumber) > latest.number) {
                    const cooldouwnTime = (Number(blockNumber) - latest.number) * 3;
                    return setCooldown(new Date(new Date().getTime() + cooldouwnTime * 1000));
                }else {
                    setCooldown(null);
                }

                const fetchedBlock = await getBlock(blockNumber).catch(_ => {
                    Notify.failure('Block not fetched');
                    return null;
                });

                setBlock(fetchedBlock);
            }).catch(_ => {});

            setLoading(false);
        };
        fetchBlock();
    }, [blockNumber]);

    useEffect(() => {
        if (loading) return Loading.circle('Loading...');

        Loading.remove();
    }, [loading]);

    if (loading) {
        return (
            <div className='row'>
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <h1>Loading...</h1>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (cooldouwn) return (
        <div className='row'>
            <div className="col-12">
                <div className="card">
                    <div className="card__body">
                        <h1>The block will be added on {cooldouwn.toLocaleDateString()} {cooldouwn.toLocaleTimeString()}</h1>
                    </div>
                </div>
            </div>
        </div>
    )

    if (!isBlock || block === null) return (
        <div className='row'>
            <div className="col-12">
                <div className="card">
                    <div className="card__body">
                        <h1>404 | Block Not Found</h1>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className='row'>
            <div className="col-12">
                <div className="card">
                    <div className="card__header">
                        <h3>Transactions:</h3>
                    </div>
                    <div className="card__body">
                        <div className='block-info'>
                            <p><span className='theme-color'>Number: </span>{block.number}</p>
                            <p><span className='theme-color'>Tx Count: </span>{block.transactions.length}</p>
                            <p><span className='theme-color'>Timestam: </span>{block.timestamp}</p>
                            <p><span className='theme-color'>Miner: </span><Link to={`/address/${block.miner}`}>{block.miner}</Link></p>
                            <p><span className='theme-color'>Difficulty: </span>{block.difficulty}</p>
                            <p><span className='theme-color'>Total Difficulty: </span>{block.totalDifficulty}</p>
                            <p><span className='theme-color'>Size: </span>{block.size}</p>
                            <p><span className='theme-color'>Gas Used: </span>{block.gasUsed}</p>
                            <p><span className='theme-color'>Gas Limit: </span>{block.gasLimit}</p>
                            <p><span className='theme-color'>Hash: </span>{block.hash}</p>
                            <p><span className='theme-color'>Parent Hash: </span>{block.parentHash}</p>
                            <p><span className='theme-color'>Sha3Uncles: </span>{block.sha3Uncles}</p>
                            <p><span className='theme-color'>Nonce: </span>{block.nonce}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card txs-info">
                    <div className="card__body">
                        <Table
                            thead={() => {
                                return (
                                    <tr>
                                        <th>Tx</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Value</th>
                                    </tr>
                                )
                            }}
                            tbody={() => {
                                return (<>{block.transactions.map((tx) => {
                                    return (
                                        <tr key={tx.hash}>
                                            <td><Link to={`/tx/${tx.hash}`}>{tx.hash.slice(0, 10) + "..."}</Link></td>
                                            <td><Link to={`/address/${tx.from}`}>{tx.from.slice(0, 20) + "..."}</Link></td>
                                            <td><Link to={`/address/${tx.to}`}>{tx.to ? tx.to.slice(0, 20) + "..." : "-"}</Link></td>
                                            <td>{Web3.utils.fromWei(tx.value, 'ether')}</td>
                                        </tr>
                                    )
                                })}</>)
                            }}
                            limit={50}
                            pagesLimit={10}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Block;