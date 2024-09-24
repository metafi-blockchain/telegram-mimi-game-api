

import {Bytes} from 'web3-types';
import Web3, {Contract} from 'web3';
import MultiDelegateCallAbi from '../abis/MultiDelegateCall.json';
import { DeployNFTFactoryParams } from './interface';
import { estimateGas } from 'web3/lib/commonjs/eth.exports';

export class MultiDelegateCall {

  private web3: Web3;
  private multiCallContract: string;
  constructor(_provider: string, _contract: string) {
    this.web3 = new Web3(_provider);
    this.multiCallContract = _contract;
  }

  getMultiDelegateCallData(data: Bytes[]){

    if (!this.web3) {
      console.log('Web3 or contract ABI is not initialized');
      throw new Error('Web3 or contract ABI is not initialized');
    }
    const contract = this.getMultiDelegateCallContract();
    
    return contract.methods.multiDelegatecall(data).encodeABI() as Bytes
  }

  public getMultiDelegateContractAddress(){
    return this.multiCallContract;
  }

  private getMultiDelegateCallContract(): Contract<any> {
    return new this.web3.eth.Contract(MultiDelegateCallAbi.abi, this.multiCallContract);
  }


}