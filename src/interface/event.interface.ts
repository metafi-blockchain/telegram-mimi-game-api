export type MintNftEvent = {
    tokenId: number
    uri: string
    recipient: string
}

export type DepositEvent = {
    from: string,
    tokenAddress: string,
    amount: number,
    time: number,
}
