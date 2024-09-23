

import { Bytes } from 'web3-types';
import Web3, { Contract } from 'web3';
import NFTFactoryAbi from '../abis/EnteralKingdomNFTFactory2.json';
import { DeployNFTFactoryParams } from './interface';

export class NFTFactory {

  private web3: Web3;
  private factoryContract: string;
  constructor(_provider: string, _factoryContract: string) {

    if (!_provider) throw new Error('Provider is required');
    if (!_factoryContract) throw new Error('Factory contract is required');
    this.web3 = new Web3(_provider);
    this.factoryContract = _factoryContract;
  }

  async deployNft(params: DeployNFTFactoryParams) {

    const contract = this.getFactoryContract();
    const txData = contract.methods.deploy(params.owner, params.salt, params.name, params.symbol).encodeABI() as Bytes
    return {
      address: this.factoryContract,
      calldata: txData,
      value: '0',
      gasEstimate: 3000000,
    };
  }

  public deployNftData(params: DeployNFTFactoryParams): Bytes {

    const contract = this.getFactoryContract();

    return contract.methods.deploy(params.owner, params.salt, params.name, params.symbol).encodeABI() as Bytes
  }




  public async getDeployContractAddress(params: DeployNFTFactoryParams) {
    try {
      const contract = this.getFactoryContract();
      return await contract.methods.getContractAddress(params.owner, params.name, params.symbol, params.salt).call();

    } catch (error) {
      console.log('Error:', error);
      return null;
    }
  }

  public getContractFactoryAddress() {
    return this.factoryContract;
  }

  async getPastEvents(eventName: string, fromBlock: number, toBlock: number){
    const contract = this.getFactoryContract();
    return await contract.getPastEvents(eventName, {fromBlock, toBlock});
  }

  async getAllPastEvents(eventName: string, fromBlock: number, toBlock: number){
    const contract = this.getFactoryContract();
    return await contract.getPastEvents(eventName, {fromBlock, toBlock});
  }

  private getFactoryContract(): Contract<any> {
    return new this.web3.eth.Contract(NFTFactoryAbi.abi, this.factoryContract);
  }


}