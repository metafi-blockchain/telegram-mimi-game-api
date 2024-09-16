import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import { AxiosHelperService } from '../axios-helper.service';
import { GAME_ENDPOINT } from 'src/constants/game.endpoint';
import { DepositRequestService } from 'src/modules/deposit-request/deposit-request.service';

export class DepositEventStrategy implements EventStrategy {
  constructor(
    private readonly axiosHelper: AxiosHelperService,
    private readonly depositService: DepositRequestService,
  ) {}

  async handleEvent(event: any): Promise<void> {
    
    const blockNumber = Number(event.blockNumber);
    const { from, token, amount, id, time } = event.returnValues;

    console.log(`Deposit ${from} handled for packageId: ${id}`);

    try {
      const result = await this.depositService.handleDepositRequest({
        from: from,
        token: token,
        amount: amount,
        id: id,
        time: time,
        blockNumber: blockNumber,
      });
      if (!result) return;

      await this.userDeposit({
        packageId: id,
        walletAddress: from,
        blockNumber: blockNumber,
      });
      console.log(`DepositEvent handled successfully for tokenId: ${id}`);
      return;
    } catch (error) {
      console.log(`Deposit from ${from} with ${id} fails`);
      return;
    }
  }

   private async userDeposit(data: DepositGame) {
    try {
        console.info("Deposit game data", data);
        
        return this.axiosHelper.post(GAME_ENDPOINT.HERO, data);
    } catch (error) {
        console.error('Error depositing game:', error);
    }
   
  }
}

type DepositGame = {
  packageId: number;
  walletAddress: string;
  blockNumber: number;
};
