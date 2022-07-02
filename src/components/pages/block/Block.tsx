import Web3 from 'web3';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import useLoading from '../../../hooks/loading';

import Table from '../../table/Table';
import NotFound from '../../404/NotFound';
import Loading from '../../loading/Loading';

import { BlockTransactionsObject } from '../../../services/web3';
import { getBlockByNumber, calculateCooldown } from './block.controller';


import './block.scss';


const Block: React.FC = () => {
    const {blockNumber=""} = useParams();

    const isBlock = (
        !blockNumber.startsWith('0x') &&
        !!Number(blockNumber) &&
        Number(blockNumber) > 0
    );

    const [loading, setLoading] = useLoading(false);
    const [block, setBlock] = useState<BlockTransactionsObject | null>(null);
    const [cooldouwn, setCooldown] = useState<number | null>(null);

    useEffect(() => {
        const fetchBlock = async () => {
            setLoading(true);
            await getBlockByNumber(blockNumber).then((blocks) => {
                if (blocks.block?.number === blocks.latest.number) return setBlock(blocks.latest);
                
                const cooldouwn = calculateCooldown(blocks.latest.number, Number(blockNumber));
                setCooldown(cooldouwn ? new Date().getTime() + (cooldouwn * 1000) : null);
                setBlock(blocks.block);
            });

            setLoading(false);
        };
        fetchBlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockNumber]);

    if (loading) return <Loading />

    if (cooldouwn) return (
        <div className='row'>
            <div className="col-12">
                <div className="card">
                    <div className="card__body">
                        <h1>The block will be added on {moment(cooldouwn).format('llll')}</h1>
                    </div>
                </div>
            </div>
        </div>
    );

    if (
        !isBlock ||
        block === null
    ) return <NotFound message='Block Not Found' />

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
                            <p><span className='theme-color'>Timestamp: </span>{moment(Number(block.timestamp) * 1000).fromNow(true)} ago</p>
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
                            tbody={block.transactions.map(tx => {
                                return () => {
                                    return (
                                        <tr key={tx.hash}>
                                            <td><Link to={`/tx/${tx.hash}`}>{tx.hash.slice(0, 10) + "..."}</Link></td>
                                            <td><Link to={`/address/${tx.from}`}>{tx.from.slice(0, 20) + "..."}</Link></td>
                                            <td><Link to={`/address/${tx.to}`}>{tx.to ? tx.to.slice(0, 20) + "..." : "-"}</Link></td>
                                            <td>{Web3.utils.fromWei(tx.value, 'ether')}</td>
                                        </tr>
                                    )
                                }
                            })}
                            limit={50}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Block;