const config = require('../sim_config.json')
const Market = require('./market.js');
const BufferBattery = require('./bufferBattery.js');

class Manager {
    constructor(userName, consumers, prosumers){
        this.userName = userName;
        this.prosumers = prosumers; //the manager should try to minimize the use of the Power Plant’s production, and whenever possible use the Prosumers generated electricity
        this.consumers = consumers;
        this.bufferBattery = new BufferBattery(this.userName, 10000, 10000);
        this.market = new Market(this.userName, prosumers, consumers);
        this.powerPlantOn = true;
    }

    updateMarketPrice(newPrice) {
        //do checks if the price is too high or too low compared to the electricitypricemodel?
        //the manager can redirect the prosumers to sell to the market by momentarily increasing the market price
        this.market.updateMarketPrice(newPrice);
    }

    togglePowerPlant() {
        this.powerPlantOn = !this.powerPlantOn;
    }
}

module.exports = Manager;