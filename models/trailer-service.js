const mongoose = require('mongoose');
const User = require('./user-model');
// const Vote = require('./votes')
const Schema = mongoose.Schema;



const TrailerServiceSchema = new Schema({
    typeOfTrailer: String,
    typeOfTruck: String,
    pricePerHour: Number,
    owner: String,
    contactInfo: String,
    reviews: [{user: String, review: String}],
    img: {
        type: String,
        default: 'https://res.cloudinary.com/bobbynicholsoncloud/image/upload/v1564699192/trailerFinderIcon.png'
    },
    serviceArea: String,
    description: String,
    votes: [
        {voter: String, voted:{type: Boolean, default: false}, vote: {type: Number, default: 0}}
    ], 
    voteCount: {type: Number, default: 0}
})

const TrailerService = mongoose.model('TrailerService', TrailerServiceSchema);

module.exports = TrailerService;