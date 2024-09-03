// create  a class manage the event listener

export class EventListenerStrategy {
    _events: Array<Event>
    constructor(){
        this._events = [];
    }
    addEvent(event: Event){
        this._events = [...this._events, event];
    }
    getEvent(name: string){
        return this._events.find(event=> event._name === name)
    }

}
export class Event{
    _name: string;
    _handle: any;

    constructor(name: string, handle: void){
        this._name = name;
        this._handle = handle
    }

    execute(value: string){
        this._handle(value)
    }
}
