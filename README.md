# cardav
M7011E Project

# Deployment protocol / installation guide
### Requirements 
You need to have NodeJs and npm installed on your system. Find out how you install it [here](https://www.npmjs.com/get-npm).
Another requirement is [MongoDB](https://docs.mongodb.com/manual/administration/install-community/).
### Installing and running the project
1. Start with cloning the repo
```bash
git clone https://github.com/davsde-7/cardav.git
```
2. Navigate to the sim folder
```bash
cd cardav/sim
```
3. Install the dependencies
```bash
npm install
```
4. Edit 'app.js' to connect to your MongoDB db. Swap out the green text on line 24, in our example that would be 'mongodb://localhost/m7011e'
```javascript
mongoose.connect('mongodb://localhost/m7011e', {useNewUrlParser:  true, useUnifiedTopology:  true, useCreateIndex:true});
```
5. Run the web application with
```bash
npx nodemon
```
6. To access the web application go to
```
URL: localhost:3000
or
URL: <your_ip>:3000
```

To change the port that the web application is running in you need to edit the file 'www' at 'cardav/sim/bin'
```js
var  port = normalizePort(process.env.PORT || '3000');
```
### Configuring the web application

If it is your first time running the system you will not have a manager. You can get a manager by first registering a user and changing it's role from 'prosumer' to 'manager'.
From MongoDBs command line it looks like this
```
use <your_db>
db.users.update({username:'<username>'},{$set: {role:'manager'}})
```
To configure many of the simulation values you can do this by simply editing the file 'sim_config.json'
```json
{
"mean_anually" : 5.0,
"stdev_anually" : 1.5,
"stdev_daily" : 0.5,
"stdev_hourly" : 0.05,
"stdev_minutely" : 0.005,
"start_date" : "January, 2020 13:00:00",
"consumerChanceToRemove" : 53,
"consumerMaxCount" : 50,
"consumerStartCount" : 10,
"counterConsumers" : 24,
"counterProsumers" : 3,
"prosumerBatteryStartCapacity" : 50,
"prosumerBatteryMaxCapacity" : 180,
"prosumerDefaultNetProdToBufRatio" : 50,
"prosumerDefaultUndProdFromBufRatio" : 50,
"prosumerProductionMultiplier" : 0.6,
"prosumerConsumptionAverageValue" : 2.283,
"prosumerConsumptionStdvValue" : 0.09,
"prosumerLastLoggedInTimer" : 600000,
"managerBatteryStartCapacity" : 50,
"managerBatteryMaxCapacity" : 4500,
"managerDefaultBufferRatio" : 0.5,
"managerDefaultMarketRatio" : 0.5,
"managerProductionAverageValue" : 105,
"managerProductionStdvValue" : 5,
"consumerConsumptionAverageValue" : 2.283,
"consumerConsumptionStdvValue" : 0.09
}
```

