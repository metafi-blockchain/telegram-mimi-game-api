import { Logger } from "@nestjs/common";
import { EventStrategy } from "src/blockchains/libs/interface";
import { TRANSACTION } from "src/modules/nft-types/nft-types.entity";
import { NftTypesService } from "src/modules/nft-types/nft-types.service";



export class DeployNFTCollectionEventStrategy implements EventStrategy {

    private readonly logger = new Logger(DeployNFTCollectionEventStrategy.name);

    constructor( private nftTypeService: NftTypesService,
    
      ) {}

    async handleEvent(event: any): Promise<void> {

        const {  addr } = event.returnValues;
        const blockNumber = Number(event.blockNumber);
        this.logger.log(`Handle deploy NFT Collection at block ${blockNumber}`);
        try {

            const check = await this.nftTypeService.checkCanUpdateByBlockNumber(addr, blockNumber);
            if (!check) return;
             await this.nftTypeService.update({nft_address: addr},{
                status: TRANSACTION.DONE,
                is_active: true,
                transaction_hash: event.transactionHash,
                block_number: blockNumber,
            });
            
          
        } catch (error) {
      
            return;
        }
    }


}