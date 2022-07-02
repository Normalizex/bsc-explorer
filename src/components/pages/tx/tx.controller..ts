import { signatures } from "../../../services/samczsun";
import { getTransaction, getTransactionReceipt, Transaction, TransactionReceipt } from "../../../services/web3";
export const findSignatures = async (transaction: TransactionReceipt): Promise<Array<{
    event: string,
    name: string
}>> => {
    let fetchedSignatured:Array<{
        event: string,
        name: string
    }> = [];

    if (!transaction) return fetchedSignatured;

    for (const log of transaction.logs){
        const event = log.topics[0];
        const exists = fetchedSignatured.find(sig => sig.event === event);

        if (exists) continue;

        await signatures({ all: true, event }).then(signature => {
            const findedEvent = signature.result.event[event];
            if (!findedEvent) return;

            const filtered = findedEvent.find(event => !event.filtered);
            const findedName = filtered ? filtered.name : findedEvent[0].name;
            fetchedSignatured.push({ 
                event,
                name: findedName
            });
        })
    };

    return fetchedSignatured;
};

export const findFunctionByMethod = async (method: string): Promise<string> => {
    const signaturesList = await signatures({
        all: true,
        function: method
    });

    const findedInputFunction = signaturesList.result.function[method];
    if (!findedInputFunction) return "";

    const filtered = findedInputFunction.find(sig => !sig.filtered);
    const finded = filtered ? filtered.name : findedInputFunction[0]?.name;
    return finded;
};

export const getTransactionDetailed = async (hash: string): Promise<{data: Transaction, receipt: TransactionReceipt}> => {
    const data = await getTransaction(hash);
    const receipt = await getTransactionReceipt(hash);

    return { data, receipt };
}