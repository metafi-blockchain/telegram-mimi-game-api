

import {Bytes} from 'web3-types';
import Web3, {Contract} from 'web3';
import NFTFactoryAbi from '../abis/EnteralKingdomNFTFactory2.json';
import { DeployNFTFactoryParams } from './interface';

export class NFTFactory {

  private web3: Web3;
  private factoryContract: string;
  constructor(_provider: string, _factoryContract: string) {
    this.web3 = new Web3(_provider);
    this.factoryContract = _factoryContract;
  }

  async deployNft(params: DeployNFTFactoryParams){

    if (!this.web3) {
      console.log('Web3 or contract ABI is not initialized');
      return null;
    }
    const contract = this.getFactoryContract();
    console.log("owner:", params.owner);
    
    const txData = contract.methods.deploy({
      owner: params.owner,
      salt:  params.salt,
      name:  params.name,
      symbol:params.symbol,

    }).encodeABI() as Bytes
    return {
      address: this.factoryContract,
      calldata: txData,
      value: '0',
    };
  }

  public getFactoryContract(): Contract<any> {
    return new this.web3.eth.Contract(NFTFactoryAbi.abi, this.factoryContract);
  }


}