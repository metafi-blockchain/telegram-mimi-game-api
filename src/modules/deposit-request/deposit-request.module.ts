import { Module } from '@nestjs/common';
import { DepositRequestService } from './deposit-request.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Deposit, DepositSchema } from './deposit.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Deposit.name, schema: DepositSchema}]), 

  ],
  providers: [DepositRequestService],
  exports: [DepositRequestService],
})
export class DepositRequestModule {}
