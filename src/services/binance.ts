import axios, { AxiosResponse, AxiosError } from "axios";

export const getPrice = async (token1: string, token2: string) => axios.get<AxiosError<{
    code: number,
    msg: string
}>,AxiosResponse<{
    price: string
    symbol: string
}>>(`https://api.binance.com/api/v3/ticker/price?symbol=${token1}${token2}`).then(response => response.data);