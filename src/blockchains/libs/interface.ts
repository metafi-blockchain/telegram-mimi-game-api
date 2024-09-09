
export interface DeployNFTFactoryParams {
    owner: string, salt: number, name: string, symbol: string,
}

export interface MintNFT {
    recipient: string, 
    uri: string,
    collection_address: string,
}


export type ResponseSendTransaction = {
    status: boolean,
    transactionHash?: string,
    blockNumber?: number,
    events?: any
    data?: any,
    message?: any,
}

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

export type SetPackageParam = {
    token : string,
    amounts: number[]
}

export type DepositParam = {
    token : string,
    id: number
}

