import Web3, {Bytes, NumberTypes, Numbers} from 'web3';
import {CryptoUtils} from '../utils';
import {SendTransactionDataConfirm,} from '../types';
import { Transaction} from 'ethers';


export class BaseService {
  private web3: Web3;

  constructor(provider: string) {
    this.web3 = new Web3(provider);
  }

  async sendTransactionAndConfirm(
    params: SendTransactionDataConfirm,
    privateKey: string
  ): Promise<boolean> {
    try {

      console.log('=====sendTransactionAndConfirm=====');
      const wallet = CryptoUtils.getWalletFromPrivateKey(privateKey);
      const gasPrice = await this.web3.eth.getGasPrice();

      const nonce = await this.web3.eth.getTransactionCount(wallet, 'pending');

      const {value, calldata, address, gasEstimate} = params;
      
    
      console.log('gasEstimate:', gasEstimate);

      const gasEstimateOnchain = gasEstimate
        ? gasEstimate
        : await this.web3.eth.estimateGas({
            from: wallet,
            to: address,
            data: calldata,
            value: value,
          });

      console.log('gasEstimateOnchain:', gasEstimateOnchain);
          
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

      console.log('signedTx:', signedTx);
  
  
      const receipt = await this.web3.eth.sendSignedTransaction( signedTx.rawTransaction as Bytes);

      console.log('[', Date(), ']','tx:',receipt.transactionHash,' - block: ', receipt.blockNumber);
      console.log(`========== Transaction ${receipt.status}  ===========\n`);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


}
