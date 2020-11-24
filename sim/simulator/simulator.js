// This IS a simulator
const gaussian = require('gaussian')
const config = require('../sim_config.json')

class Simulator {
    constructor() {
        this.windSpeedAnnually = gaussian(config.mean_anually, config.stdev_anually).ppf(Math.random())
        this.windSpeedDaily = gaussian(this.windSpeedAnnually, config.stdev_daily).ppf(Math.random())
        this.windSpeedHourly = gaussian(this.windSpeedDaily, config.stdev_hourly).ppf(Math.random())
        this.windSpeed = 0;
        this.totalConsumption = 0
        this.electricityPrice = 0
        this.date = new Date(config.start_date)
    }

    getConsumption() { //Abstract function for now, WIP
        for (h in HouseHolds) {
            this.totalConsumption += h.getConsumption();
        }
        return this.totalConsumption
    }

    getElectricityPrice() {
        this.electricityPrice = this.totalConsumption - this.windSpeed  // Supply and demand linear function, WIP not sure about windSpeed
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

        console.log("", this.date.getDate()+"/"+(this.date.getMonth()+1)+"/"+this.date.getFullYear(), "and time:", this.date.getHours()+":"+this.date.getMinutes())
        console.log("Annually : ", this.windSpeedAnnually)
        console.log("Daily : ", this.windSpeedDaily)
        console.log("Hourly : ", this.windSpeedHourly)
        console.log("\n")

        this.windSpeed = this.windSpeedHourly
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

    // testfunction() {
    //     var i = 0
    //     while (i < 10){
    //         console.log(this.date.getDate(),"/",this.date.getMonth()+1,"/",this.date.getFullYear(), " and time: ", this.date.getHours(), ":", this.date.getMinutes())
    //         console.log("Annually : ", this.windSpeedAnnually)
    //         console.log("Daily : ", this.windSpeedDaily)
    //         console.log("Hourly : ", this.windSpeedHourly)
    //         console.log("\n")
    //         this.newHour()
    //         i++
    //     }
    // }

    async start() {
        this.windSpeed = gaussian(this.windSpeedDaily, config.stdev_hourly).ppf(Math.random())

        setInterval(function() {
            this.newHour()
        }.bind(this), 500)
    }
}

module.exports = Simulator;