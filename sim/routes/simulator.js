var express = require('express');
const Simulator = require('../simulator/simulator')
const sim = new Simulator();
sim.start();

const getWindSpeed = (req, res) => {
  res.send(sim.getWindSpeed().toString());
  return;
};

const getDate = (req, res) => {
  res.send(sim.getDate().toString());
  return;
};

const getAll = (req, res) => {
  res.send(sim.getAll());
  return;
}

const getProsumers = (req, res) => {
  res.send(sim.getProsumers());
  return;
}

module.exports = {
  getWindSpeed,
  getDate,
  getAll,
  getProsumers
};
