import {BigNumberish, parseUnits} from 'ethers';
import {NFTLibrary} from '../libs';
import {CryptoUtils} from '../utils';
import {BaseService} from './common.service';
import { DeployNFTFactoryParams, MintNFT } from '../libs/interface';
import { MultiDelegateCall } from '../libs/mutildelegatecall.lib';


export class NFTService extends BaseService {

    private nftContract: NFTLibrary;
    private multiCallContract: MultiDelegateCall;
  
    constructor(nftContract: string, multiCallContract: string, provider: string) {
      super(provider);
      this.nftContract = new NFTLibrary( provider, nftContract);
        this.multiCallContract = new MultiDelegateCall(provider, multiCallContract);
    }

    async mint(param: MintNFT, privateKey: string){
      const callData =  this.nftContract.getMintERC721Data( param);
        const sendTxData = {
            address: this.nftContract.getContractNftAddress(),
            calldata: callData,
            value: '0',
            gasEstimate: 3000000,
        };
      return await this.sendTransactionAndConfirm(sendTxData, privateKey);
    }
    async mintBatch(nftMints: MintNFT[], privateKey: string){
        const data =  this.nftContract.getMintBatchERC721Data( nftMints);
        const callData =  this.multiCallContract.getMultiDelegateCallData(data);
        const sendTxData = {
            address: this.multiCallContract.getMultiDelegateContractAddress(),
            calldata: callData,
            value: '0',
            gasEstimate: 3000000,
        };
        return await this.sendTransactionAndConfirm(sendTxData, privateKey);
    }


   

   
    
  }
