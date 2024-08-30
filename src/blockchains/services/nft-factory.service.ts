import {BigNumberish, parseUnits} from 'ethers';
import {NFTFactory} from '../libs';
import {CryptoUtils} from '../utils';
import {BaseService} from './common.service';
import { DeployNFTFactoryParams } from '../libs/interface';


export class NFTFactoryService extends BaseService {

    private factory: NFTFactory;
  
    constructor(
      factoryContract: string,
      provider: string
    ) {
      super(provider);
      this.factory = new NFTFactory( provider, factoryContract);
    }

    async deployNft(param: DeployNFTFactoryParams, privateKey: string){
      const sendTxData = await this.factory.deployNft( param);
  
      if (!sendTxData) throw new Error('Can not join Data');
  
      return await this.sendTransactionAndConfirm(sendTxData, privateKey);
    }

    async listenToEvents(event: string, callback: any){
     const contract = this.factory.getFactoryContract();
    contract.events[event]().on('data', callback);
     
    }
  
    
  }
