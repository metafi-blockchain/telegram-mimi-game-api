
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import { AxiosHelperService } from '../axios-helper.service';
import { GAME_ENDPOINT } from 'src/constants/game.endpoint';

export class DepositEventStrategy implements EventStrategy {
  constructor(
    private readonly axiosHelper: AxiosHelperService 
  ) {}

  async handleEvent(event: any): Promise<void> {
    const blockNumber = Number(event.blockNumber);
    const { from, token, amount, id, time } = event.returnValues;

    console.log(`DepositEvent handled for tokenId: ${id}`);
    
    try {

        //
        const result = await this.userDeposit({
            "packageId": id,
            "walletAddress": from,
            "blockNumber": blockNumber
        });
        if (result) {
 
            console.log(`DepositEvent handled successfully for tokenId: ${id}`);
            return;
        }
        
    } catch (error) {
        console.log(`Deposit from ${from} with ${id} fails`);
      return;
        
    }
  }

  private userDeposit(data: DepositGame) {
    return this.axiosHelper.post(GAME_ENDPOINT.HERO, data);
  }


}

type DepositGame = {
    "packageId": number,
    "walletAddress": string,
    "blockNumber": number
}