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
        this.bufferBattery = new BufferBattery(this.username, config.managerBatteryStartCapacity, config.managerBatteryMaxCapacity);
        this.bufferBatteryCapacity = config.managerBatteryStartCapacity;
        this.market = new Market(this.username, prosumers, consumers);
        this.powerPlantStatus = "Running";
        this.production = 0;
        this.electricityPrice = 0;
        this.bufferRatio = config.managerDefaultBufferRatio;
        this.marketRatio = config.managerDefaultMarketRatio;
        this.prodToMarket = 0.0;
        this.blackoutList = [];
    }

    /* init() fetches the saved data from the database and updates the managers data*/
    async init() {
        await Managers.findOne({username: this.username}, function(error, manager) {
            if(error) {
                console.log(error);
                return;
            }
            else {
                this.production = manager.production; 
                this.powerPlantStatus = manager.powerPlantStatus; 
                this.electricityPrice = manager.electricityPrice;
                this.marketRatio = manager.marketRatio;
                this.bufferRatio = manager.bufferRatio;
                this.bufferBatteryCapacity = manager.bufferBatteryCapacity;
                this.bufferBattery = new BufferBattery(this.username, manager.bufferBatteryCapacity, config.managerBatteryMaxCapacity);
                this.blackoutList = manager.blackoutList;
                console.log("Initialized manager");
            }
        }.bind(this)).exec();
    }

    /* update(x) is a function to update all the relevant data according to the current prosumers and consumers in the system */
    async update(prosumers, consumers) {
        this.prosumers = prosumers;
        this.consumers = consumers;

        //if the powerplant is stopped or started the production is 0
        if(this.powerPlantStatus == "Stopped" || this.powerPlantStatus == "Started") {
            this.production = 0;
        } else {
            this.production = gaussian(config.managerProductionAverageValue, config.managerProductionStdvValue).ppf(Math.random()); 
        }
        this.bufferBattery.setCapacity(this.production * this.bufferRatio);
        this.bufferBatteryCapacity = this.bufferBattery.getCapacity();
        this.prodToMarket = this.production * this.marketRatio;

        this.updateBlackoutList();
        
        //update manager in database and in simulation
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

    /*updateMarketPrice(x) updates the current marketprice*/
    updateMarketPrice(newPrice) {
        this.market.updateMarketPrice(newPrice);
    }

    /*createManager() creates a manager and saves it to the database*/
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

    /*updatePowerPlantStatus(x) updates the status of the powerplant between "Stopped", "Started", and "Running"*/
    updatePowerPlantStatus(status) {
        this.powerPlantStatus = status;
    }

    /*getProdToMarket() returns the power plants production to market*/
    getProdToMarket() {
        return this.prodToMarket;
    }

    /*updateBlackoutList() checks condition for blackout and updates the blackoutlist*/
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