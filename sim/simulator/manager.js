const config = require('../sim_config.json')
const Market = require('./market.js');
const BufferBattery = require('./bufferBattery.js');
const gaussian = require('gaussian')

const Managers = require('../schemas/managerschema')

class Manager {
    constructor(username, consumers, prosumers){
        this.username = username;
        this.prosumers = prosumers; 
        this.consumers = consumers;
        this.bufferBattery = new BufferBattery(this.username, 3700, 4500);
        this.bufferBatteryCapacity = this.bufferBattery.getCapacity();
        this.market = new Market(this.username, prosumers, consumers);
        this.powerPlantStatus = "Running";
        this.production = 0;
        this.electricityPrice = 0;
        this.bufferRatio = 0.5;
        this.marketRatio = 0.5;
        this.prodToMarket = 0.0;
        this.blackoutList = [];
    }

    async update(prosumers, consumers) {
        this.prosumers = prosumers;
        this.consumers = consumers;
        if(this.powerPlantStatus == "Stopped" || this.powerPlantStatus == "Started") {
            this.production = 0;
        } else {
            this.production = gaussian(config.powerplant_production, 5).ppf(Math.random()); 
        }
        this.bufferBattery.setCapacity(this.production * this.bufferRatio);
        this.bufferBatteryCapacity = this.bufferBattery.getCapacity();
        this.prodToMarket = this.production * this.marketRatio;

        this.updateBlackoutList();

        const updatedManager = await Managers.findOne({username: this.username});
        updatedManager.production = this.production;
        this.bufferRatio = updatedManager.bufferRatio/100;
        this.marketRatio = updatedManager.marketRatio/100;
        this.electricityPrice = updatedManager.electricityPrice;
        this.powerPlantStatus = updatedManager.powerPlantStatus;
        updatedManager.bufferBatteryCapacity = this.bufferBatteryCapacity;
        updatedManager.blackoutList = this.blackoutList;
        await updatedManager.save();

        this.market.update(this.prosumers, this.consumers, this.electricityPrice, this.prodToMarket);
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

    getProdToMarket() {
        return this.prodToMarket;
    }

    updateBlackoutList(){
        this.blackoutList = [];
        for(var i = 0; i < this.prosumers.length; i++) {
            if(this.prosumers[i].blackout == true) {
                this.blackoutList.push(this.prosumers[i].username);
            }
        }

        /*for(var i = 0; i < this.consumers.length; i++) {
            if(this.consumers[i].blackout == true) {
                this.blackoutList.push(this.consumers[i].username);
            }
        }*/

    }
}

module.exports = Manager;