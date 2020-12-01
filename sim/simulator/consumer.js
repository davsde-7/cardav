const gaussian = require('gaussian')

class Consumer {
    constructor(owner, marketDemand) {
        this.owner = owner;
        this.consumption = 0.0;
        this.marketDemand = marketDemand;
        this.blackout = false; //should the consumer also be in the risk of having blackouts?
    }

    //function to update the values every hour of the simulation
    update() {
        //https://www.energimarknadsbyran.se/el/dina-avtal-och-kostnader/elkostnader/elforbrukning/normal-elforbrukning-och-elkostnad-for-villa/
        //calculate the consumption based on the consumers own demand for electricity right now
        //check condition for blackout
        this.consumption = gaussian(2.283, 0.3*0.3).ppf(Math.random());
        this.marketDemand = this.consumption;
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