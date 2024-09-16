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
    const packageId = Number(id);
    console.log(`Deposit ${from} handled for packageId: ${id}`);

    try {
      const result = await this.depositService.handleDepositRequest({
        from: from,
        token: token,
        amount: Number(amount),
        id: packageId,
        time: Number(time),
        blockNumber: blockNumber,
      });
      if (!result) return;

      await this.userDeposit({
        packageId: packageId,
        walletAddress: from,
        blockNumber: blockNumber,
      });
     
    } catch (error) {
        console.log(error);
        
        console.error(`Deposit from ${from} with packageId ${id} fails`);
    }
  }

   private async userDeposit(data: DepositGame) {
    try {
        console.info("Call gateway game ", data);
        await this.axiosHelper.post(GAME_ENDPOINT.HERO, data);
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
