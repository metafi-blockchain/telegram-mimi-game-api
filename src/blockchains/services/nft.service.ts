import {ERC721Library} from '../libs';
import {BaseService} from './common.service';
import {  MintNFT, ResponseSendTransaction } from '../libs/interface';
import { MultiDelegateCall } from '../libs/mutildelegatecall.lib';


export class ERC721Service extends BaseService {

    private nftContract: ERC721Library;
  
    constructor(nftContract: string, provider: string) {
      super(provider);
      this.nftContract = new ERC721Library( provider, nftContract);
    }

    async mintNFT(param: MintNFT, privateKey: string): Promise<ResponseSendTransaction> {
      const callData =  this.nftContract.getMintERC721Data( param);
        const sendTxData = {
            address: this.nftContract.getContractNftAddress(),
            calldata: callData,
            value: '0'
        };
      return await this.sendTransactionAndConfirm(sendTxData, privateKey);
    }

    
  }
