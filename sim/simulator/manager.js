const config = require('../sim_config.json')
const Market = require('./market.js');
const BufferBattery = require('./bufferBattery.js');
const gaussian = require('gaussian')

const Managers = require('../schemas/managerschema')

class Manager {
    constructor(username, consumers, prosumers){
        this.username = username;
        this.prosumers = prosumers; //the manager should try to minimize the use of the Power Plant’s production, and whenever possible use the Prosumers generated electricity
        this.consumers = consumers;
        this.bufferBattery = new BufferBattery(this.userName, 10000, 10000);
        this.market = new Market(this.userName, prosumers, consumers);
        this.powerPlantStatus = "Running";
        this.production = 0;
    }

    async update(prosumers, consumers) {
        this.prosumers = prosumers;
        this.consumers = consumers;
        this.powerPlantStatus = this.powerPlantStatus;
        this.production = gaussian(config.powerplant_production, 5).ppf(Math.random()); 

        const updatedManager = await Managers.findOne({username: this.username});
        updatedManager.production = this.production;
        updatedManager.powerPlantStatus = this.powerPlantStatus;
        await updatedManager.save();
    }

    updateMarketPrice(newPrice) {
        //do checks if the price is too high or too low compared to the electricitypricemodel?
        //the manager can redirect the prosumers to sell to the market by momentarily increasing the market price
        this.market.updateMarketPrice(newPrice);
    }

    print() {
        console.log("\n")
        console.log(this)
    }

    async createManager() {
        let newManager = new Managers ({
            username: this.username,
            production: config.powerplant_production,
            powerPlantStatus: "Running"
        })

        await newManager.save(function(error){
            if (error) {
              console.log(error);
              return;
            } else {
                console.log("Manager added to database yey")
            }
        });
    }

    updatePowerPlantStatus(status) {
        this.powerPlantStatus = status;
    }
}

module.exports = Manager;