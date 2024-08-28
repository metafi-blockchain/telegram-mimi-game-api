export class EventTypeService{
    _topics: Array<Topic>
    constructor(){
        this._topics = [];
    }
    addEvent(topic: Topic){
        this._topics = [...this._topics, topic];
    }
    getEvent(name: string){
        return this._topics.find(topic=> topic._name === name)
    }
}
export class Topic{
    _name: string;
    _handle: any
    constructor(name: string, handle: void){
        this._name = name;
        this._handle = handle
    }
    processEvent(value: string){
        this._handle(value)
    }
}
