import Web3, {Bytes, NumberTypes, Numbers} from 'web3';
import {CryptoUtils} from '../utils';
import {SendTransactionDataConfirm,} from '../types';
import { Transaction} from 'ethers';
import { ResponseSendTransaction } from '../libs/interface';


export class BaseService {
  private web3: Web3;

  constructor(provider: string) {
    this.web3 = new Web3(provider);
  }

  async sendTransactionAndConfirm(
    params: SendTransactionDataConfirm,
    privateKey: string
  ): Promise<ResponseSendTransaction> {
    try {

      console.log('=====sendTransactionAndConfirm=====');
      const wallet = CryptoUtils.getWalletFromPrivateKey(privateKey);
      const gasPrice = await this.web3.eth.getGasPrice();

      const nonce = await this.web3.eth.getTransactionCount(wallet, 'pending');

      const {value, calldata, address, gasEstimate} = params;
      
    
      // console.log('gasEstimate:', gasEstimate);

      const gasEstimateOnchain = gasEstimate
        ? gasEstimate
        : await this.web3.eth.estimateGas({
            from: wallet,
            to: address,
            data: calldata,
            value: value,
          });

      // console.log('gasEstimateOnchain:', gasEstimateOnchain);
          
      //@ts-ignore
      const tx = {
        to: address,
        //@ts-ignore
        value: value,
        gas: gasEstimateOnchain,
        data: calldata,
        gasPrice: gasPrice,
        nonce,
      } as Transaction;

      const signedTx = await this.web3.eth.accounts.signTransaction( tx, privateKey);


  
  
      const receipt = await this.web3.eth.sendSignedTransaction( signedTx.rawTransaction as Bytes);

      console.log(JSON.stringify(receipt.events));
      
      console.log('[', Date(), ']','tx:',receipt.transactionHash,' - block: ', receipt.blockNumber);
      console.log(`========== Transaction ${receipt.status}  ===========\n`);
      return {
        status: !!receipt.status,
        transactionHash: receipt.transactionHash.toString(),
        blockNumber: Number(receipt.blockNumber),
        events: receipt.events,
      }
    } catch (error) {
      console.log(error);
      return {
        status: false,
        transactionHash: ""
      }
    }
  }


}
