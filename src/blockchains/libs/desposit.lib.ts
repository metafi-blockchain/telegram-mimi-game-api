

import {Bytes} from 'web3-types';
import Web3, {Contract} from 'web3';
import DepositAbi from '../abis/EnterKingDomDeposit.json';
import { estimateGas } from 'web3/lib/commonjs/eth.exports';
import { DepositParam, SetPackageParam } from './interface';

export class DepositLib{

  private web3: Web3;
  private depositContract: string;
  constructor(_provider: string, _depositContract: string) {
    this.web3 = new Web3(_provider);
    this.depositContract = _depositContract;
  }


    setPackageData(params: SetPackageParam): Bytes{
       
        const contract = this.getDepositContract();
        
        return contract.methods.setPackages( params.token, params.amounts).encodeABI() as Bytes
    }

    addPackageData(params: SetPackageParam): Bytes{
        const contract = this.getDepositContract();
        
        return contract.methods.addPackages( params.token, params.amounts).encodeABI() as Bytes
    }

    depositData(params: DepositParam): Bytes{
        const contract = this.getDepositContract();
        return contract.methods.deposit(params.token, params.id).encodeABI() as Bytes
    }






    public getWeb3Provider(): Web3 {
        return this.web3;
    }





  private getDepositContract(): Contract<any> {

    return new this.web3.eth.Contract(DepositAbi, this.depositContract);
  }




}