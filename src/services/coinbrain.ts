import axios, { AxiosError, AxiosResponse } from "axios";

export interface SearchedToken {
    address: string
    decimals: number,
    favorite: boolean,
    logo: string | null,
    lowQuality: boolean,
    marketCapUsd: number | null,
    name: string,
    priceUsd: number | null,
    priceUsd7dAgo: number | null,
    priceUsd24hAgo: number | null,
    symbol: string,
    totalLiquidityUsd: number | null
    trades24h: number | null,
    volume24hUsd: number | null,
    volume24hUsd24hAgo: number | null
}
export const searchByPhrase = async (phrase: string) => axios.get<
    AxiosError<any>,
    AxiosResponse<SearchedToken[]>
>(`https://api.coinbrain.com/cointoaster/coins/search?searchPhrase=${phrase}`).then(response => response.data);