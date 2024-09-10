import {ERC721Library} from '../libs';
import {BaseService} from './common.service';
import {  MintNFT, ResponseSendTransaction } from '../libs/interface';


export class ERC721Service extends BaseService {

    private nftContract: ERC721Library;
  
    constructor(nftContract: string, provider: string) {
      super(provider);
      this.nftContract = new ERC721Library( provider, nftContract);
    }

    async mintNFT(param: MintNFT, privateKey: string): Promise<ResponseSendTransaction> {
      const callData =  this.nftContract.mintERC721Data( param);
        const sendTxData = {
            address: this.nftContract.getContractNftAddress(),
            calldata: callData,
            value: '0'
        };
      return await this.sendTransactionAndConfirm(sendTxData, privateKey);
    }

    async mintBatchNFT(nftMints: MintNFT[], privateKey: string): Promise<ResponseSendTransaction> {

      const recipients = nftMints.map( nft => nft.recipient);
      const uris = nftMints.map( nft => nft.uri);

      // console.log(`'recipients:${recipients}' -- 'uris:${uris}'`);
      
      const callData =  this.nftContract.mintBatchERC721Data(recipients, uris);
      const sendTxData = {
        address: this.nftContract.getContractNftAddress(),
        calldata: callData,
        value: '0'
      };
      return await this.sendTransactionAndConfirm(sendTxData, privateKey);
    }


    
  }
