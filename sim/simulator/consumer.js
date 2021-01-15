const config = require('../sim_config.json')
const gaussian = require('gaussian');
const Consumers = require('../schemas/consumerschema');

class Consumer {
    constructor(identification) {
        this.identification = identification;
        this.consumption = 0.0;
        this.marketDemand = 0.0;
        this.blackout = false;
    }

    /* update(x) is a function to update all the relevant data */
    async update() {
        //source for average consumption:
        //https://www.energimarknadsbyran.se/el/dina-avtal-och-kostnader/elkostnader/elforbrukning/normal-elforbrukning-och-elkostnad-for-villa/
        this.consumption = gaussian(config.consumerConsumptionAverageValue, config.consumerConsumptionStdvValue).ppf(Math.random());
        this.marketDemand = this.consumption;
        
        //update consumer in database
        await Consumers.findOne({identification: this.identification}, function(err, consumer){
            if(err) {
              console.log(err)
            }
            if(consumer) {
              consumer.marketDemand = this.marketDemand;
              consumer.blackout = this.blackout;
              consumer.save();
            }
            else{
              console.log("Something went wrong trying to find consumer with id: " + this.identification);
            }
          }.bind(this));
    }

    /*addToDB() adds the consumer to the database and saves it*/
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
        }          
    }

    /*removefromDB() removes the consumer from the db*/
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

    /*setBlackout() sets the blackout to true*/
    setBlackout() {
        this.blackout = true;
    }

    /*resetBlackout() sets the blackout to false*/
    resetBlackout() {
        this.blackout = false;
    }

    /*getConsumption() returns the current consumption of the consumer*/
    getConsumption() {
        return this.consumption;
    }

    /*getMarketDemand() returns the current market demand of the consumer*/
    getMarketDemand() {
        return this.marketDemand;
    }

}

module.exports = Consumer;