var express = require('express');
const Simulator = require('../simulator/simulator')
const sim = new Simulator();

/* This is the API to connect the frontend directly to the running simulator in the backend */

// Starts the simulator
sim.start();

// Returns the current windspeed of the simulation
const getWindSpeed = (req, res) => {
  res.send(sim.getWindSpeed().toString());
  return;
};

// Returns the current date of the simulation
const getDate = (req, res) => {
  res.send(sim.getDate().toString());
  return;
};

// Returns all important data of the simulation
const getAll = (req, res) => {
  res.send(sim.getAll());
  return;
}

// Returns a list of all prosumers
const getProsumers = (req, res) => {
  res.send(sim.getProsumers());
  return;
}

// Export the functions so other routes can use them
module.exports = {
  getWindSpeed,
  getDate,
  getAll,
  getProsumers
};
