'use strict';

/**
 * Dependencies
 */
var mongoose = require('mongoose'),
    Donor = mongoose.model('Donor'),
    ObjectId = require('mongoose').Types.ObjectId;

/**
 * Auth callback - is it necessary for local strategy login?
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.redirect('#!/login');
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create donor
 */
exports.create = function(req, res, next) {

    var donor = new Donor(req.body);

    req.assert('name', 'You must enter a name').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    /*
    
    req.assert('phoneFix', 'You must enter a fix phone number').notEmpty();
    req.assert('phoneMobile','you must enter a mobile phone number').notEmpty();
    req.assert('latitude','You must enter a valid latitude').notEmpty();
    req.assert('longitude','You must enter a valid longitude').notEmpty();
    req.assert('birthDate', 'You must enter a valid birth date').notEmpty();
    req.assert('weight', 'You must enter your weight').notEmpty();
    req.assert('gender', 'You must enter a gender').notEmpty();
    req.assert('hadHepatite', 'You must enter if you had Hepatite').notEmpty();
    req.assert('contactWChagas', 'You must enter if you had contact with Chagas Bug').notEmpty();
    req.assert('hadMalaria', 'You must enter if you had malaria').notEmpty();
    req.assert('hasEpilepsia', 'You must enter if you have malaria').notEmpty();
    req.assert('hasSiflis', 'You must enter if you have Sifilis').notEmpty();
    req.assert('hasDiabetes', 'You must enter if you have Diabetes').notEmpty();
    req.assert('hasRecentTattos', 'You must enter if you have recent tattoos').notEmpty();
    req.assert('hasRecentTransfusion', 'You must enter if you have recent blood transfusion').notEmpty();
    req.assert('hasAIDS', 'You must enter if you have AIDS Virus').notEmpty();
    req.assert('bloodType', 'You must enter your blood type').notEmpty();

    */

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    donor.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                    /* Duplicate in DB error code */
                case 11001:
                    /* Duplicate in DB error code */
                    res.status(400).send('Username or Email already taken');
                    break;
                default:
                    res.status(400).send('Please fill all the required fields');
            }
            return res.status(400);
        }

        res.status(200).send();
    });

};

/**
 * Send Donor
 */
exports.me = function(req, res) {
    res.jsonp(req.donor || null);
};

/**
 * Find donor by id
 */
exports.donor = function(req, res, next, id) {
    Donor
        .findOne({
            _id: id
        })
        .exec(function(err, donor) {
            if (err) return next(err);
            if (!donor) return next(new Error('Failed to load User ' + id));
            req.profile = donor;
            next();
        });
};

exports.update = function(req, res) {
    if (req.isAuthenticated()) {
        Donor.update({
            _id: req.user.id
        }, {
            $set: req.body
        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    } else {
        return res.send(401, 'User Not Authorized');
    };
};

exports.remove = function(req, res) {
    if (req.isAuthenticated()) {
        Donor.update({
            _id: req.user.id
        }, {
            $set: {
                active: false
            }
        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Removed');
        });
    } else {
        return res.send(401, 'User Not Authorized');
    }
};