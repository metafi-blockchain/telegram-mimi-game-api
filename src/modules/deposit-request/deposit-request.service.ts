import { Injectable } from '@nestjs/common';
import { Deposit } from './deposit.entity';
import { BaseService } from '../commons/base.service';
import { Model } from 'mongoose';
import { DepositEvent } from 'src/interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DepositRequestService extends BaseService<Deposit> {

    constructor(
        @InjectModel(Deposit.name) private readonly _model: Model<Deposit>,
    ) {
        super(_model);
    }

    async handleDepositRequest(deposit: DepositEvent) {

        try {
            const canCreateDeposit = await this._checkCanCreateDeposit(deposit.from, deposit.id, deposit.time);
            if (!canCreateDeposit) return false;
            await this._model.create({
                packageId: deposit.id,
                wallet: deposit.from,
                block_number: deposit.time,
                amount: deposit.amount,
                currency: deposit.token,
                time: deposit.time,
                status: 'DONE'
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;

        }


    }


    private async _checkCanCreateDeposit(walletAddress: string, packageId: number, time: number) {

        const nft = await this._model.findOne({ packageId: Number(packageId), wallet: walletAddress, block_number: time }).exec();
        if (nft) return false;
        return true;
    }
}
