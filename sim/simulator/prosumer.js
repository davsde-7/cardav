const config = require('../sim_config.json')

class Prosumer {
    constructor(userName, production, consumption, netProduction, marketDemand, currentWind, market){
        this.userName = userName; //used for login
        this.production = production; //how much the prosumer produces
        this.consumption = consumption; //how much the prosumer consumes
        this.netProduction = netProduction; //have to keep track if this value is < 0 or > 0
        this.marketDemand = marketDemand; //the prosumer can have a demand for market electricity in case of empty battery and no wind(?)
        this.currentWind = currentWind;
        this.bufferBattery = new BufferBattery(this.userName, 50, 100); //how much electricity that is stored
        this.windTurbine = new WindTurbine(this.userName, this.bufferBattery, this.currentWind); //every prosumer has a wind turbine that produces electricity
        this.blackout = false; //when the buffer battery is empty and the market/power plant cannot supply with enough electricity the prosumer gets a blackout
        this.market = market; //the prosumer is connected to the market
    }

    updateProduction(production) {
        //calculate production based on the wind turbine and battery?
        //the production should be used to supply the prosumers own demand on electricity first before selling to the market
        this.updateNetProduction();
    }

    updateConsumption(consumption) {
        //calculate the consumption based on the prosumers own demand for electricity right now?
        //check conditions for blackout, and issue warnings if a blackout is about to happen
        this.setNetProduction();
    }

    updateNetProduction(){
        this.netProduction = this.production - this.consumption;

        if (this.netProduction > 0) {
            //the prosumer controls how much of the excessive production gets sold to the market and how much that gets sent to its own bufferbattery
            //based on the market price etc
            //70% to own bufferbattery and 30% to market
        } else {
            //control how much should be bought from the market and how much that should taken from the battery
            //80% from own bufferbattery and 20% from market
        }
    }

    updateMarketDemand(demand) {
        //calculate the demand of electricity from the market based on the current consumption and capacity of buffer battery
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
}

//move to separate file?
class Consumer {
    constructor(owner, consumption, marketDemand) {
        this.owner = owner;
        this.consumption = consumption;
        this.marketDemand = marketDemand;
        this.blackout = false; //should the consumer also be in the risk of having blackouts?
    }

    updateConsumption(consumption) {
        //calculate the consumption based on the consumers own demand for electricity right now
        //check condition for blackout
        this.consumption = consumption;
    }

    updateMarketDemand(demand) {
        //calculate the demand of electricity from the market based on the current consumption
        this.marketDemand = demand;
    }
}

//move to separate file? used by the powerplant class also
class BufferBattery {
    constructor(owner, currentCapacity, maxCapacity) {
        this.owner = owner;
        this.currentCapacity = currentCapacity;
        this.maxCapacity = maxCapacity;
        this.minCapacity = 0;
    }

    setCapacity(capacity) {
        if (this.currentCapacity + capacity > this.maxCapacity) {
            this.currentCapacity = this.maxCapacity;
        } else if (this.currentCapacity + capacity < this.minCapacity) {
            this.currentCapacity = this.minCapacity;
        } else {
            this.currentCapacity += capacity;
        }
    }
}

//every prosumer has a windturbine which has a buffer battery
class WindTurbine {
    constructor(owner, bufferBattery, currentWind) {
        this.owner = owner;
        this.bufferBattery = bufferBattery;
        this.currentWind = currentWind;
    }

    updateCurrentWind(wind) {
        //check some conditions blabla
        this.currentWind = wind;
    }

    setCapacity(capacity) {
        this.bufferBattery.setCapacity(capacity);
    }

    //add functions that increases the capacity of the bufferbattery based on the wind etc
}
