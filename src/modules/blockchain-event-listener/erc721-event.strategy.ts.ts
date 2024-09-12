// strategies/mint-event.strategy.ts
import { NftsService } from '../nfts/nfts.service';
import { TransactionHistoryService } from '../event-log-history/event-history.service';
import { MINT_STATUS, NFT_STATUS } from '../nfts/nft.entity';
import Web3 from 'web3';
import { EventStrategy } from 'src/blockchains/libs/interface';

export class ERC721EventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
    private transactionService: TransactionHistoryService,
    private web3: Web3
  ) {}

  async handleEvent(event: any): Promise<void> {
    const { recipient, tokenId, uri } = event.args;
    const blockNumber = Number(event['log'].blockNumber);

    await this.nftService.update({ uri }, {
      minting_status: MINT_STATUS.MINTED,
      nft_status: NFT_STATUS.AVAILABLE,
      tokenId: Number(tokenId),
      owner: recipient,
      block_number: blockNumber
    });

    await this.logTransaction(event);
    console.log(`MintEvent handled successfully for tokenId: ${tokenId}`);
  }

  private async logTransaction(event: any) {
    const eventLog = event['log'];
    const transactionHash = eventLog['transactionHash'];
    if (!transactionHash) return;

    const tx = await this.web3.eth.getTransaction(transactionHash);
    await this.transactionService.create({
      transaction_hash: transactionHash,
      contract_address: eventLog['address'],
      from: tx.from,
      to: tx.to,
      value: Number(tx.value),
      block_hash: eventLog['blockHash'],
      block_number: eventLog['blockNumber'],
      event_type: event.filter,
      log_data: JSON.stringify(eventLog),
    });
  }
}