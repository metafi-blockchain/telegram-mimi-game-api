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