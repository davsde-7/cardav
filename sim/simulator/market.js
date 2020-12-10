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

    async update(prosumers, consumers, marketPrice, prodToMarket) {
        this.prosumers = prosumers;
        this.consumers = consumers;
        this.marketPrice = marketPrice;
        this.updateCurrentMarketDemand();
        this.updateAvailableCapacity(prodToMarket);

        const updatedMarket = await Markets.findOne({manager: this.manager});
        updatedMarket.marketPrice = this.marketPrice;
        updatedMarket.availableCapacity = this.availableCapacity;
        updatedMarket.marketDemand = this.marketDemand;
        await updatedMarket.save();
    }


    async createMarket() {
        let newMarket = new Markets ({
            manager: this.manager,
            marketPrice: this.marketPrice,
            marketDemand: this.marketDemand
        })

        await newMarket.save(function(error){
            if (error) {
              console.log(error);
              return;
            } else {
                console.log("Market added to database yey")
            }
        });
    }

    /*updateMarketPrice(newPrice) {
        //add checks on the current consumption, the current battery buffer of the power plant etc and set the price accordingly
        this.marketPrice = newPrice;
    }*/

    updateAvailableCapacity(prodToMarket) {
        //check how much market electricity is available and increase/decrease the value if a household sell or buy from the market
        
        for(var i = 0; i < this.prosumers.length; i++) {
            this.availableCapacity += this.prosumers[i].getSellToMarket() - this.prosumers[i].getBuyFromMarket();
        }

        this.availableCapacity += prodToMarket;


        
    }

    updateCurrentMarketDemand() {
        //calculate the current demand for electricity from the market based on the demand from consumers and prosumers
        /*for(consumer in consumers) {
            this.marketDemand += consumer.marketDemand;
        }*/

        this.marketDemand = 0;

        for(var i = 0; i < this.prosumers.length; i++) {
            this.marketDemand += this.prosumers[i].getMarketDemand();
        }
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