

import {Bytes} from 'web3-types';
import Web3, {Contract} from 'web3';
import NFTFactoryAbi from '../abis/EnteralKingdomNFTFactory2.json';
import { DeployNFTFactoryParams } from './interface';
import { estimateGas } from 'web3/lib/commonjs/eth.exports';

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
    
    const txData = contract.methods.deploy( params.owner, params.salt,params.name,params.symbol).encodeABI() as Bytes
    return {
      address: this.factoryContract,
      calldata: txData,
      value: '0',
      gasEstimate: 3000000,
    };
  }

  public getFactoryContract(): Contract<any> {
    return new this.web3.eth.Contract(NFTFactoryAbi.abi, this.factoryContract);
  }

  public async getDeployContractAddress(params: DeployNFTFactoryParams){
    try {
      const contract = this.getFactoryContract();
      return await contract.methods.getContractAddress(params.owner, params.name, params.symbol, params.salt).call();
      
    } catch (error) {
      console.log('Error:', error);
      return null;
    }

  }


}