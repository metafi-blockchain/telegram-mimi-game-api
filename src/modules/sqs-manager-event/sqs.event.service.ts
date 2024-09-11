import { Injectable } from '@nestjs/common';
import { Topic, EventTypeService } from './event.strategy.pattern';
import { EVENT } from './event.constants';

@Injectable()
export class SqsManagerEventService{

    constructor(
        private eventTypeManager: EventTypeService,
        ){
            
    }

    getTopicManager(){
        return this.eventTypeManager
    }

    async handleCreateDaoEvent(data: any){
        //todo: handle create dao event
    
    }

    async handleAddAdminEvent(data: any){
        if(!data){
            throw new Error("Message null");
        }
    //   const mem = await  this.memberService.findOne({transaction: data?.transaction});

      
    }






    startJob(){

        const EVENT_CREATE_DAO = new Topic(EVENT.CREATE_DAO, this.handleCreateDaoEvent.bind(this))
        const EVENT_ADD_ADMIN = new Topic(EVENT.ADD_ADMIN, this.handleAddAdminEvent.bind(this))



        // const topicManager = new EventTypeService();
        this.eventTypeManager.addEvent(EVENT_CREATE_DAO)
        this.eventTypeManager.addEvent(EVENT_ADD_ADMIN)
    }


}



