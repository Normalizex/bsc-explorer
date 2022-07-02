import axios, { AxiosError, AxiosResponse } from 'axios';

interface BscResponse<T>{
    status: string,
    message: string,
    result: string | T
}

export interface accountTxlistOptions {
    address: string,
    startblock?: number | string,
    endblock?: number | string,
    page?: number | string,
    offset?: number | string,
    sort?: string,
    apikey?: string
}

export interface accountTxlistResponse {
    status: string,
    message: string,
    result: Array<{
        blockHash: string,
        blockNumber: string,
        confirmations: string,
        contractAddress: string,
        cumulativeGasUsed: string,
        from: string,
        gas: string,
        gasPrice: string,
        gasUsed: string,
        hash: string,
        input: string,
        isError: string,
        nonce: string,
        timeStamp: string,
        to: string,
        transactionIndex: string,
        txreceipt_status: string,
        value: string
    }>
}

export const accountTxlist = async (queryOptions: accountTxlistOptions) => {
    const defaultOptions = {
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10,
        sort: 'asc',
    };
    const options = { ...defaultOptions, ...queryOptions };
    return axios.get<AxiosError<BscResponse<string>>, AxiosResponse<accountTxlistResponse>>('https://api.bscscan.com/api', {
        params: {
            module: 'account',
            action: 'txlist',
            ...options
        }
    }).then(response => catchRateLimit(response.data));
};

function catchRateLimit<T>(response: BscResponse<T>){
    if (typeof response.result === 'string' && response.result === 'Max rate limit reached, please use API Key for higher rate limit') throw new Error('Rate Limit');

    return response;
}

export async function bscscanWaiter<T, O>(bscscanRequest: (params: O) => Promise<T>, params: O ,delay: number=5000): Promise<T>{
    let res: T | null = await bscscanRequest(params).catch(_ => null);
    while (!res){
        res = await bscscanRequest(params).catch(_ => null);
        await new Promise(r => setTimeout(r, delay));
    };
    return res;
};