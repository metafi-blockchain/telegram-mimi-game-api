
import { Contract } from 'ethers';
import { BigNumberish, Wallet, ethers } from 'ethers';
import {Address} from 'viem';



 type Route = {
    hops: Hop [] ;
    part: number;
   }
export type FlashLoanParams =  {

    flashLoanPool: string,
    loanAmount: number | BigNumberish,
    loanAmountDecimal: number 
    hops: Hop [],
}

export type ExecuteFlashLoanParams = {
    flashLoanPool: string,
    loanAmount: number | BigNumberish,
    routes: Route[],
}


export type Hop = {
    protocol: number;  
    data: string; 
    path : Array<string>;
    amountOutMinV3?: BigNumberish;
    sqrtPriceLimitX96?: BigNumberish;
}

export type Protocol = {
    UNISWAP_V3: number;
    UNISWAP_V2: number;
    SUSHISWAP: number;
    QUICKSWAP: number;
    JETSWAP: number;
    POLYCAT: number;
    APESWAP: number;
    WAULTSWAP: number;
    DODO: number;
}

export type DeployDODOFlashloanParams = {
    wallet: Wallet;
}

export type IToken = {
    address: Address;
    decimals: number;
    symbol: string;
    name: string;
    uri: string;
}

export type erc20Token = {[erc20: string]: IToken}
export type RouterMap = {
    [protocol:  string]: string
};





export type GetPriceInUSDCParams = {
    router: string,
    factory: string,
    tokenAddress: string,
    id : number,
    provider: ethers.JsonRpcProvider
}


export type GetQuoteTeParams ={
    tokenIn: string,
    tokenOut: string,
    amountIn: BigNumberish,
    fee: BigNumberish, 
    sqrtPriceLimitX96: BigInt,
}