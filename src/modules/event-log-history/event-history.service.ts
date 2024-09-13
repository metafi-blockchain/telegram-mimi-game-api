import { Injectable } from '@nestjs/common';
import { EventLogHistory } from './event-history.entity';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '../commons/base.service';
import { Model } from 'mongoose';
import { Web3Service } from '../web3/web3.service';
import { EventLog } from 'ethers';
import { IPastEvent } from 'src/interface';

@Injectable()
export class TransactionHistoryService extends BaseService<EventLogHistory> {
    constructor(

        @InjectModel(EventLogHistory.name) private transactionModel: Model<EventLogHistory>, 
        private web3Service: Web3Service
    ) {
        super(transactionModel)
    }

    async createTransactionHistory(event: IPastEvent): Promise<EventLogHistory> {
        try {
            

            const transactionHash = event['transactionHash'];
            if (!transactionHash) return;
            const web3 = this.web3Service.getWeb3();
            const tx = await web3.eth.getTransaction(transactionHash);
            await this.transactionModel.create({
              transaction_hash: transactionHash,
              contract_address: event['address'],
              from: tx.from,
              to: tx.to,
              value: Number(tx.value),
              block_hash: event['blockHash'],
              block_number: Number(event['blockNumber']),
              event_type: event.event
            });
          } catch (error) {
            console.error('Error creating log event history:', error);
          }
    }



}
