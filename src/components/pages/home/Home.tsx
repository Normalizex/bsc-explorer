import React, { useState, useEffect } from "react";

import StatusCard from "../../status-card/StatusCard";
import Chart, { ChartSeries } from "../../Chart/Chart";
import Table from "../../table/Table";

import { getPrice } from "../../../services/binance";
import { getLatestBlock, calculateGas, timestampToMinutes } from "../../../services/web3";

import './home.scss';
import { Link } from "react-router-dom";
import Web3 from "web3";

const Home: React.FC = () => {
    const [cardInfo, setCardInfo] = useState({
        bnbPrice: "?",
        latestBlock: "?",
        txCount: "?",
        blockTime: "?"
    });

    const [gasPriceChart, setGasPriceChart] = useState<{
        series: ChartSeries,
        timeAt: string[]
    }>({
        series: [
            { name: 'Min Price', data: [] },
            { name: 'Max Price', data: [] },
            { name: 'Avg Price', data: [] }
        ],
        timeAt: []
    });

    const [latestBlocks, setLatestBlocks] = useState<Array<{
        number: number | string,
        txs: number | string,
        timeAt: string,
        bnbPrice: string
    }>>([]);
    const [latestTransactions, setLatestTransactions] = useState<Array<{
        hash: string,
        from: string,
        to: string | null,
        value: string
    }>>([])

    useEffect(() => {
        const updateInfo = async () => {
            const bnbPrice = await getPrice('BNB', 'USDT').then((quote) => 
                Number(quote.price).toFixed(2) + '$'
            );

            const block = await getLatestBlock();
            const gas = calculateGas(block);
            const timeAt = timestampToMinutes(block);

            const updateChart = () => {
                setGasPriceChart(prevGasPriceChart => {
                    const min = prevGasPriceChart.series[0];
                    const max = prevGasPriceChart.series[1];
                    const avg = prevGasPriceChart.series[2];

                    const update = (array: number[], newValue: number, sliceBy: number = -9): number[] => {
                        return [...array.slice(sliceBy), newValue];
                    };

                    return {
                        ...prevGasPriceChart,
                        series: [
                            { ...min, data: update(min.data, gas.min) },
                            { ...max, data: update(max.data, gas.max) },
                            { ...avg, data: update(avg.data, gas.avg) }
                        ],
                        timeAt: [...prevGasPriceChart.timeAt.slice(-9), timeAt]
                    }
                })
            }

            const updateStatusCard = () => {
                setCardInfo({
                    bnbPrice,
                    latestBlock: block.number.toString(),
                    txCount: block.transactions.length.toString(),
                    blockTime: timeAt
                });
            };

            const updateTables = () => {
                setLatestBlocks(prevBlocks => {
                    const blockExistsInTable = prevBlocks.find((blck) => blck.number === block.number);
                    if (blockExistsInTable) return prevBlocks;

                    return [
                        {
                            number: block.number,
                            txs: block.transactions.length,
                            timeAt: timeAt,
                            bnbPrice: bnbPrice
                        },
                        ...prevBlocks
                    ]
                });

                setLatestTransactions(prevTransactions => {
                    const prevHashes = prevTransactions.map((tx) => tx.hash);
                    const newTransactions = block.transactions.filter((tx) =>
                        !prevHashes.includes(tx.hash)
                    ).map((tx) => {
                        return {
                            hash: tx.hash,
                            from: tx.from,
                            to: tx.to,
                            value: tx.value
                        }
                    })
                    return [
                        ...newTransactions,
                        ...prevTransactions
                    ] 
                });
            }

            updateStatusCard();
            updateChart();
            updateTables();
        }

        updateInfo();
        const cardInfoHandler = setInterval(updateInfo, 2500);

        return () => clearInterval(cardInfoHandler);
    }, []);

    return (
        <div>
            <div className="row info">
                <div className="col-6">
                    <div className="row stats">
                        <div className="col-12">
                            <StatusCard 
                                count={cardInfo.bnbPrice}
                                icon='bx bxs-dollar-circle'
                                title='BNB Price'
                            />
                        </div>
                        <div className="col-12">
                            <StatusCard 
                                count={cardInfo.latestBlock}
                                icon='bx bxs-data'
                                title='Latest Block'
                            />
                        </div>
                        <div className="col-12">
                            <StatusCard 
                                count={cardInfo.blockTime}
                                icon='bx bx-time'
                                title='Block Added'
                            />
                        </div>
                        <div className="col-12">
                            <StatusCard 
                                count={cardInfo.txCount}
                                icon='bx bx-transfer'
                                title='Tx Count'
                            />
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card full-height chart">
                        <Chart
                            series={gasPriceChart.series}
                            options={{
                                colors: ['#6ab04c', '#2980b9', "yellow"],

                                xaxis: {
                                    categories: gasPriceChart.timeAt,
                                }
                            }}
                            height={'100%'}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <div className="card">
                        <div className="card__header">
                            <h3
                                data-tooltip='test'
                            >
                                Latest Blocks:
                            </h3>
                        </div>
                        <div className="card__body">
                            <Table
                                thead={() => {
                                    return (
                                        <tr>
                                            <th>Number</th>
                                            <th>Tx Count</th>
                                            <th>Time At</th>
                                            <th>BNB Price</th>
                                        </tr>
                                    )
                                }}
                                tbody={latestBlocks.map((block, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><Link to={`/block/${block.number}`}>#{block.number}</Link></td>
                                            <td>{block.txs}</td>
                                            <td>{block.timeAt}</td>
                                            <td>{block.bnbPrice}</td>
                                        </tr>
                                    )
                                })}
                                limit={10}
                                pagesLimit={5}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-6">
                <div className="card">
                        <div className="card__header">
                            <h3
                                data-tooltip='test'
                            >
                                Latest Transactions:
                            </h3>
                        </div>
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
                                tbody={latestTransactions.map((tx) => {
                                    return (
                                        <tr key={tx.hash}>
                                            <td><Link to={`/tx/${tx.hash}`}>{tx.hash.slice(0, 10) + "..."}</Link></td>
                                            <td><Link to={`/address/${tx.from}`}>{tx.from.slice(0, 20) + "..."}</Link></td>
                                            <td><Link to={`/tx/${tx.to}`}>{tx.to ? tx.to.slice(0, 20) + "..." : "-"}</Link></td>
                                            <td>{Web3.utils.fromWei(tx.value, 'ether')}</td>
                                        </tr>
                                    )
                                })}
                                limit={10}
                                pagesLimit={10}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;