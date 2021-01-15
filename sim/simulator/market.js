const Markets = require('../schemas/marketschema')

class Market {
    constructor(manager, prosumers, consumers) {
        this.manager = manager;
        this.marketPrice = 0;
        this.availableCapacity = 0; 
        this.prosumers = prosumers; 
        this.consumers = consumers; 
        this.marketDemand = 0; //the sum of all households demand for market electricity
    }

    /*update(x) updates the market according to the data from the prosumers and consumers*/ 
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

    /*createMarket() creates a market and saves it to the database*/
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

    /*updateAvailableCapacity(x) updates the available market capacity according to the production/consumption from prosumers/consumers*/
    updateAvailableCapacity(prodToMarket) {
        
        //the available market capacity is affected by how much the prosumers sell and buy
        for(var i = 0; i < this.prosumers.length; i++) {
            this.availableCapacity += this.prosumers[i].getSellToMarket() - this.prosumers[i].getBuyFromMarket();
        }

        //the available market capacity if affected by how much the consumers want
        for(var i = 0; i < this.consumers.length; i++) {
            this.availableCapacity -= this.consumers[i].getMarketDemand();
        }

        //the available market capacity gets increased by the power plants production
        this.availableCapacity += prodToMarket;
        
    }

    /*updateCurrentMarketDemand() updates the current demand for electricity from the market based on the demand from consumers and prosumers*/
    updateCurrentMarketDemand() {
        this.marketDemand = 0;

        for(var i = 0; i < this.consumers.length; i++) {
            this.marketDemand += this.consumers[i].getMarketDemand();
            
            //check if there is enough capacity for the consumers demand, if not issue a blackout
            if (this.marketDemand > this.availableCapacity) {
                this.consumers[i].blackout = true;
            }
        }

        for(var i = 0; i < this.prosumers.length; i++) {
            this.marketDemand += this.prosumers[i].getMarketDemand();

            //check if there is enough capacity for the prosumers demand, if not issue a blackout if their battery is empty as well
            if (this.marketDemand > this.availableCapacity && this.prosumers[i].bufferBatteryCapacity == 0) {
                this.prosumers[i].blackout = true;
            }
        }
    }

    /*getMarketPrice() returns the current market price*/
    getMarketPrice() {
        return this.marketPrice;
    }

    /*getAvailableCapacity() returns the current available capacity of the market*/
    getAvailableCapacity() {
        return this.availableCapacity;
    }

    /*getMarketDemand() returns the current market demand*/
    getMarketDemand() {
        return this.marketDemand;
    }
}

module.exports = Market;