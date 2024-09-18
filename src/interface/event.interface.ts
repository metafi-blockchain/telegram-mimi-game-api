export type MintNftEvent = {
    tokenId: number
    uri: string
    recipient: string
}


export type DepositEvent = {
    from: string,
    token: string,
    amount: number,
    time: number,
    id: number,
    blockNumber?: number,
    transactionHash?: string
}


export type ListingEvent = {
    ownerAddress: string,
    nftAddress: string,
    nftId: number,
    listingUserAddress: string,
    currency: string,
    listingPrice: number,
    listingTime: number,
    openTime: number
}

export type PurchaseEvent = {
    previousOwner: string,
    newOwner: string,
    nftAddress: string,
    nftId: number,
    currency: string,
    listingPrice: number,
    price: number,
    sellerAmount: number,
    commissionAmount: number,
    time: number
}

export type UnListingEvent = {
    ownerAddress: string,
    nftAddress: string,
    nftId: number,
    time: number
}

export type PriceUpdateEvent = {
    ownerAddress: string,
    nftAddress: string,
    nftId: number,
    oldPrice: number,
    newPrice: number,
    openTime: number
}

export type ActiveGameEvent = {
    nftAddress: string,
    nftId: number,
    ownerAddress: string,
    feeContract: number,
    feeAmount: number,
    time: number
}
export type DeActiveGameEvent = {
    nftAddress: string,
    nftId: number,
    ownerAddress: string,
    time: number
}

export type IPastEvent = {
    
        address: string,
        topics: string[],
        data: string,
        blockNumber: number,
        transactionHash: string,
        transactionIndex: 0n,
        blockHash: string,
        logIndex: 0n,
        removed: boolean,
        returnValues: any,
        event: string, //event name
        signature: string,
        raw: any
      }

export type ContractType =  'erc721' | 'marketplace' | 'game' | 'deposit'


// Define the EventData type
export type GetEventParam = {
    address: string;
    fromBlock: number;
    toBlock: number;
  };

  export type ActiveGame = {
    "tokenId": number,
    "heroId": number,
    "walletAddress": string,
    "blockNumber": number,
    "action": 'active' | 'deActive'
}
