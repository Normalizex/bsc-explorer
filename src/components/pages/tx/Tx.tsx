import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loading } from 'notiflix';

import { getTransaction, getTransactionReceipt, Transaction, TransactionReceipt } from '../../../services/web3';
import { signatures as findSignature } from '../../../services/samczsun';

import './tx.scss';

const Tx: React.FC = () => {
    const {hash=""} = useParams();

    const [loading, setLoading] = useState(false);
    const [inputFunction, setInputFunction] = useState('');
    const [transaction, setTransaction] = useState<{
        data: Transaction,
        receipt: TransactionReceipt
    } | null>(null);
    const [signatures, setSignatures] = useState<Array<{
        event: string,
        name: string
    }>>([]);

    useEffect(() => {
        const fetchTransaction = async () => {
            setLoading(true);

            await getTransaction(hash).then(async (data) => {
                const receipt = await getTransactionReceipt(hash);

                if (!data || !receipt) return;

                const inputFunction = data.input.slice(0, 10);
                findSignature({
                    all: true,
                    function: inputFunction
                }).then(signaturesList => {
                    const findedInputFunction = signaturesList.result.function[inputFunction]
                    if (!findedInputFunction) return;

                    const finded = findedInputFunction[0]?.name;
                    setInputFunction(finded);
                });

                setTransaction({
                    data,
                    receipt
                });
            });

            setLoading(false);
        };
        fetchTransaction();
    }, [hash]);

    useEffect(() => {
        const fetchSignatures = async () => {
            if (!transaction?.receipt) return;

            let fetchedSignatured:Array<{
                event: string,
                name: string
            }> = [];
            for (const log of transaction.receipt.logs){
                const event = log.topics[0];
                const exists = fetchedSignatured.find(sig => sig.event === event);

                if (exists) continue;

                await findSignature({ all: true, event }).then(signature => {
                    const findedEvent = signature.result.event[event];
                    if (!findedEvent) return;

                    const findedName = findedEvent[0].name;
                    fetchedSignatured.push({ 
                        event,
                        name: findedName
                    });
                })
            }
            setSignatures(fetchedSignatured);
        };

        fetchSignatures();
    }, [transaction?.receipt])

    useEffect(() => {
        if (loading) return Loading.circle('Loading...');

        Loading.remove();
    }, [loading]);

    useEffect(() => {
        console.log(transaction);
    }, [transaction])


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

    if (!hash || !transaction?.data || !transaction.receipt) return (
        <div className='row'>
            <div className="col-12">
                <div className="card">
                    <div className="card__body">
                        <h1>404 | Transaction Not Found</h1>
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card__header">
                        <h3>Transaction:</h3>
                    </div>
                    <div className="card__body">
                        <div className='tx-info'>
                            <p><span className='theme-color'>Hash: </span>{transaction.data.hash}</p>
                            <p><span className='theme-color'>Status: </span>{transaction.receipt.status.toString()}</p>
                            <p><span className='theme-color'>Block: </span>{transaction.data.blockNumber}</p>
                            <p><span className='theme-color'>From: </span><Link to={`/address/${transaction.data.from}`}>{transaction.data.from}</Link></p>
                            <p><span className='theme-color'>To: </span><Link to={`/address/${transaction.data.to}`}>{transaction.data.to}</Link></p>
                            <p><span className='theme-color'>Value: </span>{Web3.utils.fromWei(transaction.data.value, 'ether')} BNB</p>
                            <p><span className='theme-color'>Tx Fee: </span>{Web3.utils.fromWei((Number(transaction.receipt.gasUsed) * Number(transaction.data.gasPrice)).toString(), 'ether')} BNB</p>
                            <p><span className='theme-color'>Gas Price: </span>{Web3.utils.fromWei(transaction.data.gasPrice, 'gwei')}</p>
                            <p><span className='theme-color'>Gas Limit: </span>{transaction.data.gas}</p>
                            <p><span className='theme-color'>Gas Used: </span>{transaction.receipt.gasUsed}</p>
                            <p><span className='theme-color'>Nonce: </span>{transaction.data.nonce}</p>
                            <p><span className='theme-color'>Input: </span>{transaction.data.input === '0x' ? 'Transfer' : inputFunction}</p>
                            <div className="tx-info-card">
                                <p>{transaction.data.input}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="card__header">
                        <h3>Logs: {transaction.receipt.logs.length}</h3>
                    </div>
                    <div className="card__body">
                        {transaction.receipt.logs.map((log, index) => {
                            const signature = signatures.find(sig => sig.event === log.topics[0]);
                            return (
                                <div 
                                    className="card card__border"
                                    key={index}
                                >
                                    <div className="card__body">
                                        <div className='tx-info'>
                                            <p>Address: <Link to={`/address/${log.address}`}>{log.address}</Link></p>
                                            <p>Log Index: {log.logIndex}</p>
                                            <p>Topics: {signature?.name}</p>
                                            {log.topics.map((topic, topicIndex) => {
                                                return (
                                                    <div className="tx-info-card" key={topicIndex}>
                                                        [{topicIndex}] {topic}
                                                    </div>
                                                )
                                            })}
                                            <p>Data: </p>
                                            <div className="tx-info-card">
                                                {log.data}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Tx;