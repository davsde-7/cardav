const config = require('../sim_config.json')
const gaussian = require('gaussian');
const Consumers = require('../schemas/consumerschema');

class Consumer {
    constructor(identification) {
        this.identification = identification;
        this.consumption = 0.0;
        this.marketDemand = 0.0;
        this.blackout = false; //should the consumer also be in the risk of having blackouts?
    }

    //function to update the values every hour of the simulation
    async update() {
        //https://www.energimarknadsbyran.se/el/dina-avtal-och-kostnader/elkostnader/elforbrukning/normal-elforbrukning-och-elkostnad-for-villa/
        //check condition for blackout
        this.consumption = gaussian(config.consumerConsumptionAverageValue, config.consumerConsumptionStdvValue).ppf(Math.random());
        this.marketDemand = this.consumption;

        try {
        var updatedConsumer = await Consumers.findOne({identification: this.identification});
        updatedConsumer.marketDemand = this.marketDemand;
        updatedConsumer.blackout = this.blackout;
        await updatedConsumer.save();
        }
        catch (error) {
            console.log(error);
            return;
        }
    }

    async addToDB() {
        var exists = await Consumers.findOne({identification: this.identification});
        if (!exists) {
            let newConsumer = new Consumers({
                identification: this.identification,
            })
            await newConsumer.save(function(error){
                if (error) {
                    console.log(error);
                    return;
                } 
                else {
                    console.log("Success, added consumer " + this.identification + " to the database.");
                }              
            }.bind(this));
        }
        else {
            // console.log("Consumer " + this.identification + " already in database.");
        }          
    }

    async removefromDB() {
        try {
            await Consumers.deleteOne({identification: this.identification});
            console.log("Removed consumer " + this.identification + ".");
        }
        catch (error) {
            console.log("Failed to remove consumer " + this.identification + ".");
            console.log(error);
        }
    }

    setBlackout() {
        this.blackout = true;
    }

    resetBlackout() {
        this.blackout = false;
    }

    getConsumption() {
        return this.consumption;
    }

    getMarketDemand() {
        return this.marketDemand;
    }

}

module.exports = Consumer;