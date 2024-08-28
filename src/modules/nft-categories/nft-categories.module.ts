import { Module } from '@nestjs/common';
import { NftCategoriesService } from './nft-categories.service';

@Module({
  providers: [NftCategoriesService]
})
export class NftCategoriesModule {}
