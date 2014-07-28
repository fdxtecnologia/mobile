'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * Validations
 */

/**
 * Donor Schema
 */
var HospitalSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email']
	},
	hashed_password: {
        type: String,
        required: true
    },
    role: {
    	type: String,
    	default: 'hospital'
    },
	cnpj:{
		type: String,
		required: true
	},
	phone1:{
		type: String,
		required: false
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
		required: false
	},
	longitude:{
		type: Number,
		required: false
	},
	active: {
		type: Boolean,
		required: true,
		enum: [0,1],
		default: 1
	},
	salt: String
});

/**
 * Virtuals
 */
HospitalSchema.virtual('password').set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashed_password = this.hashPassword(password);
}).get(function() {
	return this._password;
});

/**
 * Methods
 */
HospitalSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.hashPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Hash password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    hashPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

mongoose.model('Hospital', HospitalSchema);
