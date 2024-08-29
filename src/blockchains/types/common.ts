import {BigNumberish} from 'ethers';
import {Address} from 'viem';

export interface IAproveToken {
  tokenAddress: Address;
  spender: Address;
  amount?: BigNumberish;
}

export enum RouterVersion {
  V2,
  V3,
}

export interface IExactInputSingle {
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  poolFee: number;
}

export type SendTransactionDataConfirm = {
  address: string;
  calldata: any;
  value: string;
  gasEstimate?: number;
};

export type TokenInfo = {
  name?: string;
  symbol: string;
  decimals: number;
};


export type CallBackSwapData = {
  address: Address;
  calldata: any;
  value: string;
};
