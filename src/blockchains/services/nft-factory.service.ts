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

        const callData = this.factory.getDeployNftData(param);
        const sendTxData = {
            address: this.factory.getContractFactoryAddress(),
            calldata: callData,
            value: '0',
            gasEstimate: 3000000,
        };
  
        if (!sendTxData) throw new Error('Can not join Data');
    
        return await this.sendTransactionAndConfirm(sendTxData, privateKey);
    }

    async getContractDeployAddress(param: DeployNFTFactoryParams) {
        const address = await this.factory.getDeployContractAddress(param);
        if (!address) throw new Error('Can not get address'); 
        return address;
    };

   
    
  }
