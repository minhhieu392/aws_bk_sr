class Observer{
    constructor(name) {
        this.namePick = name;
    }

    updateStatus(location) {
        this.goToHelp(location)
    }

    goToHelp(location){
        console.log(`${this.namePick}:::PING:::${JSON.stringify(location)}`)
    }
}

class Subject{
    constructor(){
        this.ObserverList = []
    }
    addObserver(observer){
        this.ObserverList.push(observer)
    }
    notify(location){
        this.ObserverList.forEach(observer => observer.updateStatus(location))
    }
}

const subject = new Subject();

const leblan = new Observer('leblan');
const ekko = new Observer('ekko');

subject.addObserver(leblan)
subject.addObserver(ekko)

subject.notify({long: 123, lat:345});