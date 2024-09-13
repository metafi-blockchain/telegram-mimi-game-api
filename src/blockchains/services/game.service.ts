import { GameLib } from '../libs';
import { BaseService } from './common.service';




export class GameService extends BaseService {

    private gameContract: GameLib;

    constructor(gameContract: string, provider: string) {
        super(provider);
        this.gameContract = new GameLib(provider, gameContract);
    }

    
    async getAllPastEvents(blocks: [number, number]) {
        return await this.gameContract.getPastEvents("allEvents", blocks[0], blocks[1]);
    }

    async getPastEvents(eventName: string, blocks: [number, number]) {
        return await this.gameContract.getPastEvents(eventName, blocks[0], blocks[1]);
    }

}
