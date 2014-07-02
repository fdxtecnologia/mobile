'use strict';

/*
	Definitions
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

/*
	Validations
*/

/*
	Hospital Schema -- Atributos!
*/
var HospitalSchema = new Schema({

	name:{
		type: String,
		required: true
	},
	username:{
		type: String,
		unique: true,
		required: true
	},
	hashed_password: {
        type: String,
        required: true
    },
	cnpj:{
		type: String,
		required: true
	},
	phone1:{
		type: String,
		required: true
	},
	phone2:{
		type: String,
		required: false
	},
	phone3:{
		type: String,
		required: false
	},
	latitude:{
		type: Number,
		required: true
	},
	longitude:{
		type: Number,
		required: true
	},
	salt: String
});

/*
	Virtuals
*/
HospitalSchema.virtual('password').set(function(password){
	this._password = password;
	this.salt = this.makeSalt();
	this.hashed_password = this.hashPassword(password);
}).get(function(){
	return this._password;
});

/*
	Methods
*/
HospitalSchema.methods = {

	/*
		Make crypto key called Salt
	*/
	makeSalt: function(){
		return crypto.randomBytes(16).toString('base64');
	},

	/*
		Hash Password
	*/
	hashPassword: function(password){
		if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	}

};

mongoose.model('Hospital', HospitalSchema);