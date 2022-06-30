import Web3 from "web3";

export const RPC_ENDPOINT = 'https://bsc-dataseed1.binance.org/';
const web3 = new Web3(RPC_ENDPOINT);

export const getLatestBlock = async () => web3.eth.getBlock('latest', true);

export const getBlock = async (blockNumber: string | number) => web3.eth.getBlock(blockNumber, true);

//Web3.js use "declare types".
//This is my decision on how to get the type.
export type BlockTransactionsObject = Awaited<ReturnType<typeof getLatestBlock>>;

export const calculateGas = (block: BlockTransactionsObject) => {
    const minGasPrice = 5;//can't be less than 5.
    let minerReward = 0;
    let maxGasPrice = 0;
    let gasPriceSum = 0;
    let transactionsHandled = 0;
    for (const transaction of block.transactions){
        const gasPrice = Number(Web3.utils.fromWei(transaction.gasPrice, 'gwei'));
        if (gasPrice < 5) continue;
        if (gasPrice > maxGasPrice) maxGasPrice = gasPrice;

        minerReward += transaction.gas * gasPrice;
        gasPriceSum += gasPrice;
        transactionsHandled++;
    };
    const avarageGasPrice = Number((gasPriceSum / transactionsHandled).toFixed(2));
    maxGasPrice = Number((maxGasPrice).toFixed(2));

    return {
        min: minGasPrice,
        max: maxGasPrice,
        avg: avarageGasPrice,
        reward: minerReward
    }
}

export const timestampToMinutes = (block: BlockTransactionsObject) => {
    const time = new Date(Number(block.timestamp) * 1000);
    const hours = time.getHours();
    const minutes = "0" + time.getMinutes();
    const seconds = "0" + time.getSeconds();

    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

export const isTransactionHash = (hash: string) => /^0x[a-fA-F0-9]{64}/.test(hash);