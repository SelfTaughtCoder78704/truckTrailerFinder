const mongoose = require('mongoose');
const TrailerService = require('./trailer-service');
const Schema = mongoose.Schema;



const userSchema = new Schema({
    username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	firstName: {
		type: String
    },
    lastName:{
        type:String
    },
	userImage : {
		type:String,
		default:''
	},
	userPost: [{type: mongoose.Schema.Types.ObjectId,ref: 'TrailerService'}]

	
    
});

const User = mongoose.model('user', userSchema);

module.exports = User;