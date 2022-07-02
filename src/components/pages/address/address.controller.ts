import Web3 from 'web3';
import moment from 'moment';
import { getCode, getBalance, getTransactionsCount, getLatestBlock } from '../../../services/web3';
import { bscscanWaiter, accountTxlist } from '../../../services/bscscan';
import { getPrice } from '../../../services/binance';

export const getNormalTransactions = async (page: number, address: string) => {
    const latestBlock = await getLatestBlock().catch(_ => {return {number: NaN}});
    return await bscscanWaiter(accountTxlist, {
        address: address,
        startblock: 0,
        endblock: latestBlock.number,
        offset: 1000,
        sort: "desc",
        page
    }).then(quote => {
        const { result } = quote;
        if (!Array.isArray(result)) return [];

        const txs = result.map((tx) => {
            return {
                error: !!Number(tx.isError),
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                age: moment(Number(tx.timeStamp) * 1000).fromNow(true),
                value: tx.value
            }
        });

        return txs;
    });
};

export const getAddressInfo = async (address: string) => {
    const bnbPrice = await getPrice('BNB', 'USDT').then(quote => Number(quote.price));
    const contract = await getCode(address);
    const balance = await getBalance(address).then((bal) => Web3.utils.fromWei(bal, 'ether'));
    const balanceUsd = (Number(balance) * bnbPrice).toLocaleString();
    const txCount = await getTransactionsCount(address);


    return { bnbPrice, contract, balance, balanceUsd, txCount}
}