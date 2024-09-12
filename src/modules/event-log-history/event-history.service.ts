import { Injectable } from '@nestjs/common';
import { EventLogHistory } from './event-history.entity';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '../commons/base.service';
import { Model } from 'mongoose';
import { Web3Service } from '../web3/web3.service';

@Injectable()
export class TransactionHistoryService extends BaseService<EventLogHistory> {
    constructor(

        @InjectModel(EventLogHistory.name) private transactionModel: Model<EventLogHistory>, 
        private web3Service: Web3Service
    ) {
        super(transactionModel)
    }

    async createTransactionHistory(event: any): Promise<EventLogHistory> {
        try {
            const eventLog = event['log'];
            const transactionHash = eventLog['transactionHash'];
            if (!transactionHash) return;
            const web3 = this.web3Service.getWeb3();
            const tx = await web3.eth.getTransaction(transactionHash);
            await this.transactionModel.create({
              transaction_hash: transactionHash,
              contract_address: eventLog['address'],
              from: tx.from,
              to: tx.to,
              value: Number(tx.value),
              block_hash: eventLog['blockHash'],
              block_number: eventLog['blockNumber'],
              event_type: event.filter,
              log_data: JSON.stringify(eventLog),
            });
          } catch (error) {
            console.error('Error creating log event history:', error);
          }
    }



}
