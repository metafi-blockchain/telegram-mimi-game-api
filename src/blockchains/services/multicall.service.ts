import {ERC721Library} from '../libs';
import {BaseService} from './common.service';
import {  MintNFT } from '../libs/interface';
import { MultiDelegateCall } from '../libs/mutildelegatecall.lib';



export class MultiDelegateCallService extends BaseService {

    private multiCallContract: MultiDelegateCall;
    private provider: string;
  
    constructor(_multiCallContract: string, _provider: string) {
      super(_provider);
      this.multiCallContract = new MultiDelegateCall(_provider, _multiCallContract);
      this.provider = _provider;
    }

    async mintBatchNFT(nftMints: MintNFT[], privateKey: string){
        let mintData = [];
        for (let i = 0; i < nftMints.length; i++) {
            const param = nftMints[i];
            const nftContract = new ERC721Library( this.provider, param.collection_address );
            const dt = nftContract.getMintERC721Data(param);
            mintData.push(dt);
        }
       
        const callData =  this.multiCallContract.getMultiDelegateCallData(mintData);
        console.log('callData:', callData);
        
        const sendTxData = {
            address: this.multiCallContract.getMultiDelegateContractAddress(),
            calldata: callData,
            value: '0',
            // gasEstimate: 3000000,
        };
        return await this.sendTransactionAndConfirm(sendTxData, privateKey);
    }


   

   
    
  }
