const mongoose = require('mongoose');
const TrailerService = require('./trailer-service');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    cityName: String
})

const City = mongoose.model('City', CitySchema);

module.exports = City;