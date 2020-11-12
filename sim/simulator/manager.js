const config = require('../sim_config.json')

class Manager {
    constructor(userName){
        this.userName = userName;
        this.market = new Market(this.userName);
        this.powerPlant = new PowerPlant(this.userName);
    }

    changeMarketPrice(newPrice) {
        this.market.updateMarketPrice(newPrice);
    }

}
 //move to separate file?
class Market {
    constructor(manager, prosumers) {
        this.manager = manager;
        this.marketprice = 0;
        this.availableCapacity = 0; //how much market electricity is available right now
        this.prosumers = prosumers; //should the market keep a string of all the prosumers?
        this.marketDemand = 0; //the sum of all households demand for market electricity
    }

    updateMarketPrice(newPrice) {
        //add checks on the current consumption, the current battery buffer of the power plant etc
        this.marketprice = newPrice;
    }

    updateAvailableCapacity(capacity) {
        //check how much market electricity is available and increase/decrease the value
        this.availableCapacity = capacity;
    }

}

class PowerPlant {
    constructor(manager, prosumers, consumers) {
        this.manager = manager;
        this.bufferBattery = new BufferBattery(this.manager, 1000);
        this.prosumers = prosumers; //should the powerplant keep a string of all the prosumers?
        this.consumers = consumers; //should the powerplant keep a string of all the consumers?
    }

    setCapacity(capacity) {
        this.bufferBattery.setCapacity(capacity);
    }
}