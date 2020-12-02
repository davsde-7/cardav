// This IS a simulator
const gaussian = require('gaussian')
const config = require('../sim_config.json')
const Prosumer = require('./prosumer.js');
const Consumer = require('./consumer.js');
const Manager = require('./manager.js');

const Prosumers = require('../schemas/prosumerschema')

class Simulator {
    constructor() {
        this.windSpeedAnnually = gaussian(config.mean_anually, config.stdev_anually).ppf(Math.random())
        this.windSpeedDaily = gaussian(this.windSpeedAnnually, config.stdev_daily).ppf(Math.random())
        this.windSpeedHourly = gaussian(this.windSpeedDaily, config.stdev_hourly).ppf(Math.random())
        this.windSpeed = 0
        this.totalConsumption = 0
        this.modelledElectricityPrice = gaussian(154, 2*2).ppf(Math.random());
        this.date = new Date(config.start_date)
        this.consumerList = [];
        this.prosumerList = [];
        this.manager = null;
    }

    getConsumption() { //Abstract function for now, WIP
        for (c in consumerList) {
            this.totalConsumption += c.getConsumption();
        }
        for (p in prosumerList) {
            this.totalConsumption += p.getConsumption();
        }
        return this.totalConsumption
    }

    updateModelledElectricityPrice() {
        //https://www.energimarknadsbyran.se/el/dina-avtal-och-kostnader/elkostnader/elforbrukning/normal-elforbrukning-och-elkostnad-for-villa/
        this.modelledElectricityPrice = gaussian(154, 2*2).ppf(Math.random());
    }

    getWindHourly() {
        console.log("Hourly windspeed : ", this.windSpeedHourly)
        return this.windSpeedHourly 
    }

    getWindDaily() {
        console.log("Daily windspeed : ", this.windSpeedDaily)
        return this.windSpeedDaily
    }

    newHour() { 
        this.date.setHours(this.date.getHours() + 1)

        if (this.date.getHours()==0) {
            this.newDay()
        }
    
        this.windSpeedHourly = gaussian(this.windSpeedDaily, config.stdev_hourly).ppf(Math.random())
        if (this.windSpeedHourly < 0) {
            this.windSpeedHourly = 0
        }

        this.updateModelledElectricityPrice()

        this.windSpeed = this.windSpeedHourly

        for(var i = 0; i < this.prosumerList.length; i++) {
            this.prosumerList[i].update(this.windSpeed)
        }
    }

    newDay() {
        if (this.date.getMonth() == 0 && this.date.getDate() == 1)  {
            this.newYear()
        }

        this.windSpeedDaily = gaussian(this.windSpeedAnnually, config.stdev_daily).ppf(Math.random())
        if (this.windSpeedDaily < 0) {
            this.windSpeedDaily = 0
        }
    }   

    newYear() {
        this.windSpeedAnnually = gaussian(config.mean_anually, config.stdev_anually).ppf(Math.random())
        if (this.windSpeedAnnually < 0) {
            this.windSpeedAnnually = 0
        }
    }

    getWindSpeed() {
        return this.windSpeed;
    }

    getDate() {
        return this.date;
    }

    getAll() {
        return {
            "windSpeed": this.windSpeed.toString(),
            "date": this.date.toString(),
            "modelledElectricityPrice": this.modelledElectricityPrice.toString()
        };
    }

    addProsumer(username) {
        let newProsumer = new Prosumer(username);
        this.prosumerList.push(newProsumer);
    }

    addConsumer() {
        let newConsumer = new Consumer();
        this.consumerList.push(newConsumer);
    }
    
    checkProsumers() {
        Prosumers.find(function(error, prosumers) {
            if(error) {
                console.log(error);
                return;
            }
            if (prosumers.length != this.prosumerList.length) {
                for(var i = 0; i < this.prosumerList.length; i++) {
                    delete this.prosumerList[i];
                }
                this.prosumerList = []
                for(var i = 0; i < prosumers.length; i++) {                   
                    this.addProsumer(prosumers[i].username);
                }
            }
        }.bind(this)).exec();
    }

    // testfunction() {
    //      var i = 0
    //          while (i < 10){
    //              console.log("", this.date.getDate()+"/"+(this.date.getMonth()+1)+"/"+this.date.getFullYear(), "and time:", this.date.getHours()+":"+this.date.getMinutes())
    //              console.log("Annually : ", this.windSpeedAnnually)
    //              console.log("Daily : ", this.windSpeedDaily)
    //              console.log("Hourly : ", this.windSpeedHourly)
    //              console.log("\n")
    //              console.log("\n")
    //              this.newHour()
    //              i++
    //     }
    // }

    async start() {
        this.windSpeed = gaussian(this.windSpeedDaily, config.stdev_hourly).ppf(Math.random())
        /* const testProsumer = new Prosumer("testtest"); */
        
        Prosumers.find(function(error, prosumers) {
            if(error) {
                console.log(error);
                return;
            }

            console.log("Database list of prosumers:" + prosumers + " length="+ prosumers.length + "\n");
            for(var i = 0; i < prosumers.length; i++) {
                console.log("Found prosumer: "+ prosumers[i].username + ", adding to list.");
                this.addProsumer(prosumers[i].username);
                console.log("Successfully added: " + prosumers[i].username + " to the list. \n");
            }
            console.log("Prosumerlist populated: ");
            console.log(this.prosumerList);
        }.bind(this)).exec();
    
        var count = 0;

        setInterval(function() {
            this.newHour();
           /*  testProsumer.update(this.windSpeed);
            console.log(" production: " + testProsumer.production);
            console.log(" consumption: " + testProsumer.consumption);
            console.log(" net production: " + testProsumer.netProduction); */

            for(var i = 0; i < this.prosumerList.length; i++) {
                this.prosumerList[i].print();
            }             

            count ++;

            if(count == 10) {

                this.checkProsumers();
                count = 0;
            }

        }.bind(this), 500)
    }
}

module.exports = Simulator;