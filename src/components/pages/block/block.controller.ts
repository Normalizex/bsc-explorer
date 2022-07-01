import { getLatestBlock, getBlock } from "../../../services/web3";

export const getBlockByNumber = async (blockNumber: string | number) => {
    const latest = await getLatestBlock();

    if (latest.number === Number(blockNumber)) return { latest, block: latest };

    const block = await getBlock(blockNumber).catch(_ => null);

    return {
        latest,
        block
    }
};

export const calculateCooldown = (latest: number, blockNumber: number): number | null => {
    return blockNumber >  latest
        ? ( blockNumber - latest ) * 3
        : null
}