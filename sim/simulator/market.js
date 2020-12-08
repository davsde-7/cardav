const Markets = require('../schemas/marketschema')

class Market {
    constructor(manager, prosumers, consumers) {
        this.manager = manager;
        this.marketPrice = 0;
        this.availableCapacity = 0; //how much market electricity is available right now
        this.prosumers = prosumers; //should the market keep a string of all the prosumers?
        this.consumers = consumers; //should the powerplant keep a string of all the consumers?
        this.marketDemand = 0; //the sum of all households demand for market electricity
    }

    async update(prosumers, consumers) {
        this.prosumers = prosumers;
        this.consumers = consumers;



        const updatedMarket = await Markets.findOne({manager: this.manager});
        updatedMarket.marketPrice = this.marketPrice;
        updatedMarket.availableCapacity = this.availableCapacity;
        updatedMarket.marketDemand = this.marketDemand;
        await updatedMarket.save();
    }

    updateMarketPrice(newPrice) {
        //add checks on the current consumption, the current battery buffer of the power plant etc and set the price accordingly
        this.marketPrice = newPrice;
    }

    updateAvailableCapacity(capacity) {
        //check how much market electricity is available and increase/decrease the value if a household sell or buy from the market
        
        if(capacity < 0.0 && this.availableCapacity - capacity > 0.0) { //someone bought from the market
            this.availableCapacity += capacity;
        } else if (capacity < 0.0 && this.availableCapacity - capacity <= 0.0) {
            this.availableCapacity = 0.0;
        } else if (capacity > 0.0) {
            this.availableCapacity += capacity; //someone sold to the market
        } 
        
    }

    updateCurrentMarketDemand(consumers, prosumers) {
        //calculate the current demand for electricity from the market based on the demand from consumers and prosumers
        for(consumer in consumers) {
            this.marketDemand += consumer.marketDemand;
        }

        for(prosumer in prosumers) {
            this.marketDemand += prosumer.marketDemand;
        }

        return this.marketDemand;
    }

    getMarketPrice() {
        return this.marketPrice;
    }

    getAvailableCapacity() {
        return this.availableCapacity;
    }

    getMarketDemand() {
        return this.marketDemand;
    }
}

module.exports = Market;