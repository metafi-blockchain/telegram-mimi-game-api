import { MarketPlaceLib } from '../libs';
import { BaseService } from './common.service';
import { ListingByAdminParam, ResponseSendTransaction } from '../libs/interface';




export class MarketService extends BaseService {

    private marketContract: MarketPlaceLib;

    constructor(marketContract: string, provider: string) {
        super(provider);
        this.marketContract = new MarketPlaceLib(provider, marketContract);
    }

    async listingByAdmin(param: ListingByAdminParam, privateKey: string): Promise<ResponseSendTransaction> {
        const callData = this.marketContract.listingByAdminData(param);
        const sendTxData = {
            address: this.marketContract.getMarketContractAddress(),
            calldata: callData,
            value: '0'
        };
        return await this.sendTransactionAndConfirm(sendTxData, privateKey);
    }

    async setNFTSupport(nftContractAddress: string[], active: boolean[], privateKey: string): Promise<ResponseSendTransaction> {
        const callData = this.marketContract.setNFTSupportData(nftContractAddress, active);
        const sendTxData = {
            address: this.marketContract.getMarketContractAddress(),
            calldata: callData,
            value: '0'
        };
        console.log('sendTxData:', sendTxData);

        return await this.sendTransactionAndConfirm(sendTxData, privateKey);
    }

}
