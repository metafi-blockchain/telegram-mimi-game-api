import { DepositLib, GameLib } from '../libs';
import { BaseService } from './common.service';




export class DepositService extends BaseService {

    private depositContract: DepositLib;

    constructor(depositContract: string, provider: string) {
        super(provider);
        this.depositContract = new DepositLib(provider, depositContract);
    }

    
    async getAllPastEvents(blocks: [number, number]) {
        return await this.depositContract.getPastEvents("allEvents", blocks[0], blocks[1]);
    }

    async getPastEvents(eventName: string, blocks: [number, number]) {
        return await this.depositContract.getPastEvents(eventName, blocks[0], blocks[1]);
    }

}
