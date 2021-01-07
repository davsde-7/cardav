const config = require('../sim_config.json')
const gaussian = require('gaussian')
const BufferBattery = require('./bufferBattery.js');

const Prosumers = require('../schemas/prosumerschema');

class Prosumer {
    constructor(username){
        this.username = username; //used for login
        this.production = 0.0; //how much the prosumer produces
        this.consumption = 0.0; //how much the prosumer consumes
        this.netProduction = 0.0; //have to keep track if this value is < 0 or > 0
        this.marketDemand = 0.0; //the prosumer can have a demand for market electricity in case of empty battery and no wind(?)
        this.bufferBattery = new BufferBattery(this.username, config.prosumerBatteryStartCapacity, config.prosumerBatteryMaxCapacity); //how much electricity that is stored
        this.bufferBatteryCapacity = this.bufferBattery.getCapacity();
        this.blackout = false; //when the buffer battery is empty and the market/power plant cannot supply with enough electricity the prosumer gets a blackout
        this.blocked = false;
        this.netProdToBufRatio = config.prosumerDefaultNetProdToBufRatio; //how much is sent to the buffer from the net production, rest is sold to market
        this.undProdFromBufRatio = config.prosumerDefaultUndProdFromBufRatio; //how much is taken from the buffer during under production, rest is bought from market
        this.sellToMarket = 0.0;
        this.buyFromMarket = 0.0;
        this.loggedin = false;
        this.lastloggedin = null;
    }

    async init() {
        await Prosumers.findOne({username: this.username}, function(error, prosumer) {
            if(error) {
                console.log(error);
                return;
            }
            else {
                this.production = prosumer.production; 
                this.consumption = prosumer.production; 
                this.netProduction = prosumer.netProduction; 
                this.marketDemand = prosumer.marketDemand;
                this.bufferBatteryCapacity = prosumer.bufferBatteryCapacity;
                this.bufferBattery = new BufferBattery(this.username, prosumer.bufferBatteryCapacity, config.prosumerBatteryMaxCapacity); 
                this.blackout = prosumer.blackout; 
                this.blocked = prosumer.blocked;
                this.netProdToBufRatio = prosumer.netProdToBufRatio;
                this.undProdFromBufRatio = prosumer.undProdFromBufRatio; 
                this.sellToMarket = prosumer.sellToMarket;
                this.buyFromMarket = prosumer.buyFromMarket;
                this.loggedin = prosumer.loggedin;
                this.lastloggedin = prosumer.lastloggedin;
            }
        }.bind(this)).exec();
    }

    //function to update the values every hour of the simulation
    //https://www.energimarknadsbyran.se/el/dina-avtal-och-kostnader/elkostnader/elforbrukning/normal-elforbrukning-och-elkostnad-for-villa/
    async update(currentWind) {
        this.production = currentWind * config.prosumerProductionMultiplier;
        this.consumption = gaussian(config.prosumerConsumptionAverageValue, config.prosumerConsumptionStdvValue).ppf(Math.random());
        this.netProduction = this.production - this.consumption;

        //decide on the marketDemand somehow
        if (this.netProduction < 0) {
            //this.marketDemand = Math.abs(this.netProduction);

            this.buyFromMarket = Math.abs(this.netProduction) * (1.0 - this.undProdFromBufRatio);
            this.marketDemand = this.buyFromMarket;

            this.bufferBattery.setCapacity(this.netProduction * this.undProdFromBufRatio);

            if (this.bufferBattery.getCapacity() == 0.0) {
                this.blackout = true;
            } else {
                this.blackout = false;
            }

        } else {
            this.marketDemand = 0.0;

            if (this.blocked == true) {
                this.sellToMarket = 0.0;
            } else {
                this.sellToMarket = this.netProduction * (1.0 - this.netProdToBufRatio);
            }
            this.bufferBattery.setCapacity(this.netProduction * this.netProdToBufRatio);
        }

        this.bufferBatteryCapacity = this.bufferBattery.getCapacity();        

        //update prosumer in database
        const updatedProsumer = await Prosumers.findOne({username: this.username});
        updatedProsumer.production = this.production;
        updatedProsumer.consumption = this.consumption;
        updatedProsumer.netProduction = this.netProduction; 
        updatedProsumer.marketDemand = this.marketDemand;
        updatedProsumer.blackout = this.blackout;
        this.blocked = updatedProsumer.blocked;
        updatedProsumer.sellToMarket = this.sellToMarket;
        updatedProsumer.buyFromMarket = this.buyFromMarket;
        this.netProdToBufRatio = updatedProsumer.netProdToBufRatio/100; 
        this.undProdFromBufRatio = updatedProsumer.undProdFromBufRatio/100;
        updatedProsumer.bufferBatteryCapacity = this.bufferBatteryCapacity;
        if (updatedProsumer.loggedin){
            this.loggedin = true;
            if(Date.now()-updatedProsumer.lastloggedin >= config.prosumerLastLoggedInTimer) {                
                updatedProsumer.loggedin = false;
                this.loggedin = false;
            }
        }
        else {
            this.loggedin = false;
        }
        await updatedProsumer.save();
    }

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

    getSellToMarket() {
        return this.sellToMarket;
    }

    getBuyFromMarket() {
        return this.buyFromMarket;
    }

}

module.exports = Prosumer;