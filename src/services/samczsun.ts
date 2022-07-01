import axios, { AxiosError, AxiosResponse } from "axios";

interface signaturesOptions {
    all: boolean,
    error?: string,
    function?: string,
    event?: string,
    name?: string
}
export const signatures = async (options: signaturesOptions={all: true}) => axios.get<AxiosError<any>, AxiosResponse<{
    ok: boolean,
    result: {
        event: {
            [e: string]: Array<{
                filtered: boolean,
                name: string
            }>
        },
        function: {
            [e: string]: Array<{
                filtered: boolean,
                name: string
            }>
        }
    }
}>>(`https://sig.eth.samczsun.com/api/v1/signatures`, {
    params: {...options}
}).then(response => response.data);