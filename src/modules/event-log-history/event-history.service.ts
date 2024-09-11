import { Injectable } from '@nestjs/common';
import { EventLogHistory } from './event-history.entity';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '../commons/base.service';
import { Model } from 'mongoose';

@Injectable()
export class TransactionHistoryService extends BaseService<EventLogHistory> {
    constructor(
        @InjectModel(EventLogHistory.name) private transactionModel: Model<EventLogHistory>, 
    ) {
        super(transactionModel)
    }



}
