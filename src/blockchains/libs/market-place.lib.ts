

import {Bytes} from 'web3-types';
import Web3, {Contract} from 'web3';
import marketAbi from '../abis/EnteralKingDomMarketplace.json';
import {  ListingByAdminParam } from './interface';

export class MarketPlaceLib {

  private web3: Web3;
  private marketContract: string;
  constructor(_provider: string, _marketContract: string) {
    this.web3 = new Web3(_provider);
    this.marketContract = _marketContract;
  }

  async listingByAdminData(params: ListingByAdminParam){

    const contract = this.getMarketContract();
    return contract.methods.listingByAdmin( params.nftsAddress, params.nftIds, params.currencies, params.prices, params.durations).encodeABI() as Bytes
  }

  async setNFTSupportData(nftContractAddress: string[], active: boolean[]){

    const contract = this.getMarketContract();
    return contract.methods.setNFT(nftContractAddress, active).encodeABI() as Bytes
    
  }




  

  public getMarketContractAddress(){
    return this.marketContract;
  }

  private getMarketContract(): Contract<any> {
    return new this.web3.eth.Contract(marketAbi, this.marketContract);
  }


}