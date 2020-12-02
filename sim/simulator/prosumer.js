const config = require('../sim_config.json')
const gaussian = require('gaussian')
const BufferBatterySchema = require('./bufferBattery.js');

const ProsumerSchema = require('../schemas/prosumerschema');

class Prosumer {
    constructor(userName){
        this.userName = userName; //used for login
        this.production = 0.0; //how much the prosumer produces
        this.consumption = 0.0; //how much the prosumer consumes
        this.netProduction = 0.0; //have to keep track if this value is < 0 or > 0
        this.marketDemand = 0.0; //the prosumer can have a demand for market electricity in case of empty battery and no wind(?)
        //this.bufferBattery = new BufferBattery(this.userName, 50, 100); //how much electricity that is stored
        this.blackout = false; //when the buffer battery is empty and the market/power plant cannot supply with enough electricity the prosumer gets a blackout
    }

    //function to update the values every hour of the simulation
    //https://www.energimarknadsbyran.se/el/dina-avtal-och-kostnader/elkostnader/elforbrukning/normal-elforbrukning-och-elkostnad-for-villa/
    update(currentWind) {
        this.production = currentWind * 0.6;
        this.updateBufferBattery();
        this.consumption = gaussian(2.283, 0.3*0.3).ppf(Math.random());
        this.netProduction = this.production - this.consumption;

        //decide on the marketDemand somehow
        if (this.netProduction < 0) {
            this.marketDemand = Math.abs(this.netProduction);
        } else {
            this.marketDemand = 0.0;
        }
        
    }

    print() {
        console.log("Username: " + this.userName);
        console.log("production: " + this.production);
        console.log("consumption: " + this.consumption);
        console.log("netProduction: " + this.netProduction);
        console.log("marketDemand: " + this.marketDemand);
        console.log("blackout: " + this.blackout + "\n");
    }


    updateBufferBattery() {

    }

    /*updateProduction() {
        //calculate production based on the wind turbine and battery?
        //the production should be used to supply the prosumers own demand on electricity first before selling to the market

        this.production = this.currentWind * 0.4;
        this.updateNetProduction();
    }

    updateConsumption() {
        //calculate the consumption based on the prosumers own demand for electricity right now?
        //check conditions for blackout, and issue warnings if a blackout is about to happen

        this.consumption = gaussian(2.283, 0.3*0.3).ppf(Math.random());
        this.updateNetProduction();
    }

    updateNetProduction(){
        this.netProduction = this.production - this.consumption;

        if (this.netProduction >= 0) {
            //the prosumer controls how much of the excessive production gets sold to the market and how much that gets sent to its own bufferbattery
            //based on the market price etc
            //70% to own bufferbattery and 30% to market
        } else {
            //control how much should be bought from the market and how much that should taken from the battery
            //80% from own bufferbattery and 20% from market
        }
    }*/

    setBlackout() {
        this.blackout = true;
    }

    resetBlackout() {
        this.blackout = false;
    }

    getProduction() {
        return this.production;
    }

    getConsumption() {
        return this.consumption;
    }

    getNetProduction() {
        return this.netProduction;
    }

    getMarketDemand() {
        return this.marketDemand;
    }

}

module.exports = Prosumer;