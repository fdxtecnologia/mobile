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
var DonorSchema = new Schema({
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
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'donor'
    },
    phoneFix: {
        type: String,
        required: false
    },
    phoneMobile: {
        type: String,
        required: false
    },
    adress: {
        type: String,
        required: false
    },
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    birthDate: {
        type: Date,
        required: false
    },
    weight: {
        type: Number,
        required: false
    },
    gender: {
        type: String,
        required: false,
        enum: ['F', 'M']
    },
    hadHepatite: {
        type: String,
        required: false,
        enum: ['Sim', 'Não']
    },
    ageHepatite: {
        type: Number,
        required: false
    },
    contactWChagas: {
        type: String,
        required: false,
        enum: ['Sim', 'Não']
    },
    hadMalaria: {
        type: String,
        required: false,
        enum: ['Sim', 'Não']
    },
    hasEpilepsia: {
        type: String,
        required: false,
        enum: ['Sim', 'Não']
    },
    hasSiflis: {
        type: String,
        required: false,
        enum: ['Sim', 'Não']
    },
    hasDiabetes: {
        type: String,
        required: false,
        enum: ['Sim', 'Não']
    },
    hasRecentTattos: {
        type: String,
        required: false,
        enum: ['Sim', 'Não']
    },
    hasRecentTransfusion: {
        type: String,
        required: false,
        enum: ['Sim', 'Não']
    },
    hasAIDS: {
        type: String,
        required: false,
        enum: ['Sim', 'Não', 'Não Sei']
    },
    bloodType: {
        type: String,
        required: false,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    active: {
        type: Boolean,
        required: true,
        enum: [0, 1],
        default: 1
    },
    salt: String
});

/**
 * Virtuals
 */
DonorSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function() {
    return this._password;
});


/**
 * Methods
 */
DonorSchema.methods = {

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

mongoose.model('Donor', DonorSchema);