const config = require('../sim_config.json')

class Prosumer {
    constructor(userName, production, consumption, netProduction, currentWind, market){
        this.userName = userName; //used for login
        this.production = production; //how much the prosumer produces
        this.consumption = consumption; //how much the prosumer consumes
        this.netProduction = netProduction; //have to keep track if this value is < 0 or > 0
        this.currentWind = currentWind;
        this.bufferBattery = new BufferBattery(this.userName, 50); //how much electricity that is stored
        this.windTurbine = new WindTurbine(this.userName, this.currentWind); //every prosumer has a wind turbine that produces electricity
        this.blackout = false; //when the buffer battery is empty and the market/power plant cannot supply with enough electricity the prosumer gets a blackout
        this.market = market; //the prosumer is connected to the market
    }

    updateProduction(production) {
        //calculate production based on the wind turbine and battery?
        //the production should be used to supply the prosumers own demand on electricity first
        this.setNetProduction();
    }

    updateConsumption(consumption) {
        //calculate the consumption based on the prosumers own demand for electricity right now?
        //check conditions for blackout
        this.setNetProduction();
    }

    updateNetProduction(){
        this.netProduction = this.production - this.consumption;

        if (this.netProduction > 0) {
            //the prosumer controls how much of the excessive production gets sold to the market and how much that gets sent to the buffer
        } else {
            //control how much should be bought from the market and how much that should taken from the battery
        }
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
class BufferBattery {
    constructor(owner, currentCapacity) {
        this.owner = owner;
        this.currentCapacity = currentCapacity;
        this.maxCapacity = 100;
    }

    setCapacity(capacity) {
        if (this.currentCapacity + capacity > this.maxCapacity) {
            this.currentCapacity = this.maxCapacity;
        } else {
            this.currentCapacity += capacity;
        }
    }
}

class WindTurbine {
    constructor(owner, currentWind) {
        this.owner = owner;
        this.currentWind = currentWind;
    }

    updateCurrentWind(wind) {
        //check some conditions blabla
        this.currentWind = wind;
    }
}