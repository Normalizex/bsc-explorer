import Web3 from 'web3';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

import useLoading from '../../../hooks/loading';

import { getAddressInfo, getNormalTransactions } from './address.controller';

import Loading from '../../loading/Loading';
import NotFound from '../../404/NotFound';
import Table from '../../table/Table';

import './address.scss';


interface TX {
    error: boolean
    hash: string,
    from: string,
    to: string,
    age: number | string,
    value: number | string,
    token?: string
}

const Address: React.FC = () => {
    const {address=""} = useParams();
    const location = useLocation();

    const [loading, setLoading] = useLoading(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [transactions, setTransactions] = useState<{
        normal: Array<{page: number, txs: TX[]}>,
        bep20:  Array<{page: number, txs: TX[]}>,
        internal:  Array<{page: number, txs: TX[]}>
    }>({
        normal: [],
        bep20: [],
        internal: []
    });
    const [info, setInfo] = useState({
        contract: "",
        balance: "",
        balanceUsd: "",
        txCount: NaN
    });

    useEffect(() => {
        getAddressInfo(address).then(info => setInfo(info));
    }, [address]);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            switch (location.hash){
                case "":
                case "#txs":
                case "#transactions":
                    if (!transactions.normal.find(offset => offset.page === currentPage)){
                        await getNormalTransactions(currentPage, address).then((txs) => {
                            setTransactions(prevTransactions => {
                                return {
                                    ...prevTransactions,
                                    normal: [
                                        ...prevTransactions.normal,
                                        { page: currentPage, txs }
                                    ]
                                }
                            })
                        });
                    }
                    break
                default: break;
            }
            setLoading(false);
        };
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.hash, transactions, address, currentPage])

    useEffect(() => {
        setTransactions({
            normal: [],
            bep20: [],
            internal: []
        });
    }, [address]);

    if (
        !address ||
        !Web3.utils.isAddress(address)
    ) return <NotFound message='Address Not Found' />

    if (loading) return <Loading />

    return (
        <div className='address-info'>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="address-info__card">
                            <h2><span className='theme-color'>Address:</span> {address}</h2>
                            <h2><span className='theme-color'>Balance:</span> {info.balance || "?"} BNB ({info.balanceUsd || "?"}$)</h2>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <h3>Page: {currentPage}</h3>
                        { currentPage > 1 && (
                            <button
                                className="btn"
                                onClick={() => setCurrentPage(prevPage => prevPage - 1)}
                            >
                                {"<"}
                            </button>
                        )}
                        <button
                            className="btn"
                            onClick={() => setCurrentPage(prevPage => prevPage + 1)}
                        >
                            {">"}
                        </button>
                        {['', '#txs', '#transactions'].includes(location.hash) && transactions.normal.find(list => list.page === currentPage) && (
                            <div>
                                <h3>Transactions: {transactions.normal.find(list => list.page === currentPage)?.txs.length || 0}</h3>
                                <Table
                                    thead={() => {
                                        return (
                                            <tr>
                                                <th>Hash</th>
                                                <th>Age</th>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Value</th>
                                            </tr>
                                        )
                                    }}
                                    tbody={transactions.normal[currentPage - 1].txs.map((tx) => {
                                        return () => {
                                            return (
                                                <tr key={tx.hash}>
                                                    <td><Link target='_blank'to={`/tx/${tx.hash}`}>{tx.hash.slice(0, 10) + "..."}</Link></td>
                                                    <td>{tx.age} ago</td>
                                                    <td><Link target='_blank' to={`/address/${tx.from}`}>{tx.from.slice(0, 20) + "..."}</Link></td>
                                                    <td><Link target='_blank' to={`/address/${tx.to}`}>{tx.to ? tx.to.slice(0, 20) + "..." : "-"}</Link></td>
                                                    <td>{Web3.utils.fromWei(tx.value.toString(), 'ether')}</td>
                                                </tr>
                                            )
                                        }
                                    })}
                                    limit={20}
                                />
                            </div>
                        )}
                    </div>
                </div>
                { info.contract && info.contract !== '0x' &&
                    <div className="col-12">
                        <div className="card address-info__card">
                            <h1><span className='theme-color'>Contract Code:</span></h1>
                            {info.contract}
                        </div>
                    </div>
                }
            </div>
            <div className="col-12">
                <div className="card address-info__card">
                    <div className='address-info__footer'>
                        <h1>Powered by BscScan APIs</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Address;