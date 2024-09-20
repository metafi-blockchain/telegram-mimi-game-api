import { Injectable,Logger } from '@nestjs/common';
import { Deposit, DEPOSIT_STATUS } from './deposit.entity';
import { BaseService } from '../commons/base.service';
import { Model } from 'mongoose';
import { DepositEvent } from 'src/interface';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class DepositRequestService extends BaseService<Deposit> {

    private readonly logger = new Logger(DepositRequestService.name);

    constructor(
        @InjectModel(Deposit.name) private readonly _model: Model<Deposit>,
    ) {
        super(_model);
    }

    async handleDepositRequest(deposit: DepositEvent) {

        try {
            this.logger.log(`Handle deposit request from ${deposit.from} with packageId: ${deposit.id}`);
            const canCreateDeposit = await this._checkCanCreateDeposit(deposit.from, deposit.id, deposit.time);

            if (!canCreateDeposit) return false;
            const item = await this._model.create({
                package_id: deposit.id,
                wallet: deposit.from,
                time: deposit.time,
                block_number: deposit.blockNumber,
                amount: deposit.amount,
                currency: deposit.token,
                transaction_hash: deposit.transactionHash,
                status: DEPOSIT_STATUS.INITIALIZE,
            });
            item.save();
            return true;
        } catch (error) {
            this.logger.error(`Handle deposit request error`, error.toString());
            console.log(error);
            return false;

        }
    }
   async updateStatusDepositRequest(filter: any, update: Partial<Deposit>) {    
          try {
            
            return await this._model.updateOne(filter, update).exec();
          } catch (error) {
            this.logger.error(`Update status deposit request error`, error.toString());
            console.log(error);
            return null;
            
          }

    }


    private async _checkCanCreateDeposit(walletAddress: string, packageId: number, time: number) {

        const nft = await this._model.findOne({ packageId: Number(packageId), wallet: walletAddress, block_number: time }).exec();
        if (nft) return false;
        return true;
    }
}
