

import {Bytes} from 'web3-types';
import Web3, {Contract} from 'web3';
import NFTAbi from '../abis/EnteralKingDomERC721.json';
import { DeployNFTFactoryParams, MintNFT } from './interface';
import { estimateGas } from 'web3/lib/commonjs/eth.exports';

export class ERC721Library {

  private web3: Web3;
  private nftContract: string;

  constructor(_provider: string, _nftContract: string) {
    this.web3 = new Web3(_provider);
    this.nftContract = _nftContract;
  }

  mintERC721Data(params: MintNFT): Bytes{
  
    const contract = this.getNftContract();
    
    return contract.methods.mintNFT(params.recipient, params.uri).encodeABI() as Bytes
  }


  mintBatchERC721Data(recipients: string[], uris: string[]): Bytes{
    
    const contract = this.getNftContract();
    return contract.methods.mintBatchNFT(recipients, uris).encodeABI() as Bytes

  }

  unListERC721Data(tokenId: number): Bytes{

    const contract = this.getNftContract();
    
    return contract.methods.unListNFT(tokenId).encodeABI() as Bytes
  }

   getBurnERC721Data(tokenId: number): Bytes{

    const contract = this.getNftContract();
    
    return contract.methods.burn(tokenId).encodeABI() as Bytes
  }

  private getNftContract(): Contract<any> {

    return new this.web3.eth.Contract(NFTAbi.abi, this.nftContract);
  }

  public getContractAddress(){
    return this.nftContract;
  }

  async getPastEvents(eventName: string, fromBlock: number, toBlock: number){
    const contract = this.getNftContract();
    return await contract.getPastEvents(eventName, {fromBlock, toBlock});
  }

  public getWeb3Provider(): Web3 {
    if (!this.web3)  throw new Error('Web3 or contract ABI is not initialized');
    return this.web3;
  }




}