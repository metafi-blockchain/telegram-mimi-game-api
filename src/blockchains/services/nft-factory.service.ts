import {BigNumberish, parseUnits} from 'ethers';
import {NFTFactory} from '../libs';
import {CryptoUtils} from '../utils';
import {BaseService} from './common.service';
import {Address} from 'viem';
export class NFTFactoryService extends BaseService {

    private factory: NFTFactory;
  
    constructor(
      factoryContract: Address,
      provider: string
    ) {
      super(provider);
      this.factory = new NFTFactory( provider, factoryContract);
    }

    async deployNft(owner: string, salt: number, name: string, symbol: string, privateKey: string){
      const sendTxData = await this.factory.deployNft( salt, name, symbol, owner);
  
      if (!sendTxData) throw new Error('Can not join Data');
  
      return await this.sendTransactionAndConfirm(sendTxData, privateKey);
    }
  
    
  }
