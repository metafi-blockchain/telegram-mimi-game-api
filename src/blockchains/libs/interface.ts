
export interface DeployNFTFactoryParams {
    owner: string, salt: number, name: string, symbol: string,
}

export interface MintNFT {
    recipient: string, uri: string
}