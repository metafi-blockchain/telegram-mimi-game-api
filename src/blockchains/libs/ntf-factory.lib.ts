

import {Bytes} from 'web3-types';
import Web3, {Contract} from 'web3';
import NFTFactoryAbi from '../abis/EnteralKingdomNFTFactory2.json';

export class NFTFactory {

  private web3: Web3;
  private factoryContract: string;
  constructor(_provider: string, _factoryContract: string) {
    this.web3 = new Web3(_provider);
    this.factoryContract = _factoryContract;
  }
  
  async deployNft(_salt: number, _name: string, _symbol: string, _owner: string){

    if (!this.web3) {
      console.log('Web3 or contract ABI is not initialized');
      return null;
    }
    const contract = this._useFactoryContract();

    const txData = contract.methods.deploy({
      owner: _owner,
      salt: _salt,
      name: _name,
      symbol: _symbol,

    }).encodeABI() as Bytes
    return {
      address: this.factoryContract,
      calldata: txData,
      value: '0',
    };
  }

  private _useFactoryContract(): Contract<any> {
    return new this.web3.eth.Contract(NFTFactoryAbi.abi, this.factoryContract);
  }


}