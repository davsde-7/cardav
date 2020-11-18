const config = require('../sim_config.json')

class Manager {
    constructor(userName, consumers, prosumers, electricityPriceModel){
        this.userName = userName;
        this.prosumers = prosumers; //the manager should try to minimize the use of the Power Plant’s production, and whenever possible use the Prosumers generated electricity
        this.consumers = consumers;
        this.market = new Market(this.userName, prosumers, consumers);
        this.powerPlant = new PowerPlant(this.userName, prosumers, consumers, market);
        this.electricityPriceModel = electricityPriceModel; //the manager can use the electricity price model provided by the electric company as a giude
    }

    updateMarketPrice(newPrice) {
        //use the electricitypricemodel if needed and do checks on the wind, market, powerplant, prosumers etc before setting the price.
        //the manager can redirect the prosumers to sell to the market by momentarily increasing the market price
        this.market.updateMarketPrice(newPrice);
    }

    togglePowerPlant() {
        this.powerPlant.setPowerPlantStatus(this.powerPlant.powerPlantOn ? false : true);
    }
}

 //move to separate file?
class Market {
    constructor(manager, prosumers, consumers) {
        this.manager = manager;
        this.marketprice = 0;
        this.availableCapacity = 0; //how much market electricity is available right now
        this.prosumers = prosumers; //should the market keep a string of all the prosumers?
        this.consumers = consumers; //should the powerplant keep a string of all the consumers?
        this.marketDemand = 0; //the sum of all households demand for market electricity
        
    }

    updateMarketPrice(newPrice) {
        //add checks on the current consumption, the current battery buffer of the power plant etc and set the price accordingly
        this.marketprice = newPrice;
    }

    updateAvailableCapacity(capacity) {
        //check how much market electricity is available and increase/decrease the value if a household sell or buy from the market
        
        
        if(capacity < 0 && this.availableCapacity - capacity > 0) { //someone bought from the market
            this.availableCapacity += capacity;
        } else if (capacity > 0) {
            this.availableCapacity += capacity; //someone sold to the market
        }
        
    }

    getCurrentMarketDemand(consumers, prosumers) {
        //calculate the current demand for electricity from the market based on the demand from consumers and prosumers
        for(consumer in consumers) {
            this.marketDemand += consumer.marketDemand;
        }

        for(prosumer in prosumers) {
            this.marketDemand += prosumer.marketDemand;
        }

        return this.marketDemand;
    }

}

class PowerPlant {
    constructor(manager, prosumers, consumers, market) {
        this.manager = manager;
        this.bufferBattery = new BufferBattery(this.manager, 1000, 1500);
        this.prosumers = prosumers; //should the powerplant keep a string of all the prosumers?
        this.consumers = consumers; //should the powerplant keep a string of all the consumers?
        this.market = market; //the powerplant is connected to the market
        this.powerPlantOn = true; //the manager controls this variable
    }

    setCapacity(capacity) {
        //increase or decrease the capacity of the powerplants bufferbattery based on the consumers and prosumers usage
        this.bufferBattery.setCapacity(capacity);
    }
    
    setPowerPlantStatus(status) {
        this.powerPlantOn = status;
}
