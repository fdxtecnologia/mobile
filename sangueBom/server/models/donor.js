'use strict';

/*
*=== Definitions
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

/*
*=== Donor Schema
*/
var DonorSchema = new Schema({
	name:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true,
		unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email']
	},
	username:{
		type: String,
		unique:true,
		required:true
	},
	hashed_password:{
		type: String,
		required:true
	},
	phoneFix:{
		type: String,
		required: true
	},
	phoneMobile:{
		type: String,
		required: true
	},
	latitude:{
		type: Number,
		required: true
	},
	longitude:{
		type: Number,
		required: true
	},
	birthDate: {
		type: Date,
		required: true
	},
	weight:{
		type: Number,
		required: true
	},
	gender:{
		type: String,
		required: true,
		enum: ['F','M']
	},
	hadHepatite:{
		type: String,
		required: true,
		enum: ['Sim','Não']
	},
	ageHepatite:{
		type: Number,
		required: false
	},
	contactWChagas:{
		type: String,
		required: true,
		enum: ['Sim','Não']
	},
	hadMalaria:{
		type: String,
		required: true,
		enum: ['Sim','Não']
	},
	hasEpilepsia:{
		type: String,
		required: true,
		enum: ['Sim','Não']
	},
	hasSiflis:{
		type: String,
		required: true,
		enum: ['Sim','Não']
	},
	hasDiabetes:{
		type: String,
		required: true,
		enum: ['Sim','Não']
	},
	hasRecentTattos:{
		type: String,
		required: true,
		enum: ['Sim','Não']
	},
	hasRecentTransfusion:{
		type: String,
		required: true,
		enum: ['Sim','Não']
	},
	hasAIDS:{
		type: String,
		required: true,
		enum: ['Sim','Não','Não Sei']
	},
	bloodType:{
		type: String,
		required: true,
		enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-']
	},
	salt: String
});

/*
*=== Virtuals
*/
DonorSchema.virtual('password').set(function(password){
	this._password = password;
	this.salt = this.makeSalt();
	this.hashed_password = this.hashPassword(password);
}).get(function(){
	return this._password;
});

/*
*=== Methods
*/
DonorSchema.methods = {

	/* Make Salt Key */
	makeSalt: function(){
		return crypto.randomBytes(16).toString('base64');
	},

	/* Hash Password */
	hashPassword: function(password){
		if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	}
};

mongoose.model('Donor', DonorSchema);