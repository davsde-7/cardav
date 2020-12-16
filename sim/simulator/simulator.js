// This IS a simulator
const gaussian = require('gaussian')
const config = require('../sim_config.json')
const Prosumer = require('./prosumer.js');
const Consumer = require('./consumer.js');
const Manager = require('./manager.js');

const Prosumers = require('../schemas/prosumerschema')
const Consumers = require('../schemas/consumerschema')
const Managers = require('../schemas/managerschema')
const User = require('../schemas/userschema')

class Simulator {
    constructor() {
        this.windSpeedAnnually = gaussian(config.mean_anually, config.stdev_anually).ppf(Math.random())
        this.windSpeedDaily = gaussian(this.windSpeedAnnually, config.stdev_daily).ppf(Math.random())
        this.windSpeedHourly = gaussian(this.windSpeedDaily, config.stdev_hourly).ppf(Math.random())
        this.windSpeed = 0
        this.totalConsumption = 0
        this.totalMarketDemand = 0
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
        return this.totalConsumption;
    }

    updateModelledElectricityPrice() {
        //https://www.energimarknadsbyran.se/el/dina-avtal-och-kostnader/elkostnader/elforbrukning/normal-elforbrukning-och-elkostnad-for-villa/
        this.modelledElectricityPrice = gaussian(154, 2*2).ppf(Math.random());
    }

    getWindHourly() {
        console.log("Hourly windspeed : ", this.windSpeedHourly);
        return this.windSpeedHourly ;
    }

    getWindDaily() {
        console.log("Daily windspeed : ", this.windSpeedDaily);
        return this.windSpeedDaily;
    }

    newMinute() {
        this.date.setMinutes(this.date.getMinutes() + 1);
        if (this.date.getMinutes()==0) {
            this.newHour();
        }           
    }

    newHour() { 
        this.date.setHours(this.date.getHours() + 1);
        if (this.date.getHours()==0) {
            this.newDay();
        }    
        this.windSpeedHourly = gaussian(this.windSpeedDaily, config.stdev_hourly).ppf(Math.random());
        if (this.windSpeedHourly < 0) {
            this.windSpeedHourly = 0;
        }
        this.updateModelledElectricityPrice();
        this.windSpeed = this.windSpeedHourly;
        this.totalConsumption = 0;
        for(var i = 0; i < this.prosumerList.length; i++) {
            this.prosumerList[i].update(this.windSpeed);
        }
        for(var i = 0; i < this.consumerList.length; i++) {
            this.consumerList[i].update();
        }
        this.manager.update(this.prosumerList, this.consumerList);
    }

    newDay() {
        if (this.date.getMonth() == 0 && this.date.getDate() == 1)  {
            this.newYear();
        }
        this.windSpeedDaily = gaussian(this.windSpeedAnnually, config.stdev_daily).ppf(Math.random());
        if (this.windSpeedDaily < 0) {
            this.windSpeedDaily = 0;
        }
    }   

    newYear() {
        this.windSpeedAnnually = gaussian(config.mean_anually, config.stdev_anually).ppf(Math.random());
        if (this.windSpeedAnnually < 0) {
            this.windSpeedAnnually = 0;
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

    getProsumers() {
        var tempProsumerList = [];
        for(var i = 0; i< this.prosumerList.length; i++) {
            var user = 
            {
                "Username":this.prosumerList[i].username,
                "Production":this.prosumerList[i].production,
                "Consumption":this.prosumerList[i].consumption,
                "Net Production":this.prosumerList[i].netProduction,
                "Market Demand":this.prosumerList[i].marketDemand,
                "Current Capacity":this.prosumerList[i].bufferBatteryCapacity,
                "Blackout":this.prosumerList[i].blackout,
                "Blocked":this.prosumerList[i].blocked,        
            }
            tempProsumerList.push(user);
        }
        return tempProsumerList;
    }

    addProsumer(username) {
        let newProsumer = new Prosumer(username);
        this.prosumerList.push(newProsumer);
    }

    addConsumer() {
        let newConsumer = new Consumer(this.consumerList.length+1);
        newConsumer.addToDB();
        this.consumerList.push(newConsumer);
    }

    removeConsumer() {
        let removedConsumer = this.consumerList.pop();
        removedConsumer.removefromDB();
    }
    
    async checkProsumers() {
        await Prosumers.find(function(error, prosumers) {
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

    async start() {
        this.windSpeed = gaussian(this.windSpeedDaily, config.stdev_hourly).ppf(Math.random())
        /* const testProsumer = new Prosumer("testtest"); */
        
        await Prosumers.find(function(error, prosumers) {
            if(error) {
                console.log(error);
                return;
            }
            //console.log("Database list of prosumers:" + prosumers + " length="+ prosumers.length + "\n");
            for(var i = 0; i < prosumers.length; i++) {
                //console.log("Found prosumer: "+ prosumers[i].username + ", adding to list.");
                this.addProsumer(prosumers[i].username);
                //console.log("Successfully added: " + prosumers[i].username + " to the list. \n");
                this.prosumerList[i].update(this.windSpeed);
            }
            //console.log("Prosumerlist populated: ");
            //console.log(this.prosumerList);
        }.bind(this)).exec();

        await Consumers.find(function(error, consumers) {
            if(error) {
                console.log(error);
                return;
            }
            console.log(consumers.length)
            for(var i = 0; i < consumers.length; i++){
                this.addConsumer(consumers[i].identification);
                this.consumerList[i].update();
            }
            if(consumers.length == 0) {
                console.log("Found no consumers, creating them.")
                for(var i = 0; i < 10; i++) {
                    console.log("Creating consumer " + (this.consumerList.length) + ".");
                    this.addConsumer();
                    this.consumerList[i].update();
                }
            }
            console.log("consumerlist populated:");
            console.log(this.consumerList);
        }.bind(this)).exec();

        await Managers.find(function(error, managers) {
            if(error) {
                console.log(error);
                return;
            }
            if (managers.length>0) {
                this.manager = new Manager(managers[0].username, this.consumerList, this.prosumerList)
            } 
            else {
                User.find(function(error, users) {
                    if(error) {
                        console.log(error);
                        return;
                    }
                    for(var i = 0; i < users.length; i++) {
                        if(users[i].role == "manager") {
                            this.manager = new Manager(users[i].username, this.consumerList, this.prosumerList)
                            this.manager.createManager();
                            this.manager.market.createMarket();
                            return;
                        }
                    }
                }.bind(this));
            }
        }.bind(this)).exec();

        var prosumerCount = 0;
        var consumerCount = 0;

        setInterval(function() {
            this.newHour();

            prosumerCount ++;
            consumerCount ++;

            if(prosumerCount == 10) {
                this.checkProsumers();
                prosumerCount = 0;
            }  

            if (consumerCount == 24) {
                var randomChance = Math.floor(Math.random() * 100) + 1;
                if (randomChance > 53) { //remove consumer
                    this.removeConsumer();
                } 
                else { //add consumer
                    this.addConsumer();
                }
                consumerCount = 0;
            }
        }.bind(this), 1000)
    }
}

module.exports = Simulator;