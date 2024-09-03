import { Module } from '@nestjs/common';
import { NftsService } from './nfts.service';

@Module({
  imports: [],
  providers: [NftsService],
  exports: [NftsService],

})
export class NftsModule {}
