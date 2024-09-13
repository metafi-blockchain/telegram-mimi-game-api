

import { Bytes } from 'web3-types';
import Web3, { Contract } from 'web3';
import DepositAbi from '../abis/EnterKingDomDeposit.json';
import { estimateGas } from 'web3/lib/commonjs/eth.exports';

export class GameLib {

    private web3: Web3;
    private gameContract: string;

    constructor(_provider: string, _gameContract: string) {
        this.web3 = new Web3(_provider);
        this.gameContract = _gameContract;
    }

    public getWeb3Provider(): Web3 {
        return this.web3;
    }


    async getPastEvents(eventName: string, fromBlock: number, toBlock: number) {
        const contract = this.getGameContract();
        return await contract.getPastEvents(eventName, { fromBlock, toBlock });
    }

    async getAllPastEvents(eventName: string, fromBlock: number, toBlock: number) {
        const contract = this.getGameContract();
        return await contract.getPastEvents(eventName, { fromBlock, toBlock });
    }



    private getGameContract(): Contract<any> {

        return new this.web3.eth.Contract(DepositAbi, this.gameContract);
    }



}