'use strict'

/**
 * Dependencies
 */
var mongoose = require('mongoose'),
    Hospital = mongoose.model('Hospital'),
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

        console.log('sigin hospital reached');
        return res.redirect('/');
    }
    console.log('redirect to login');
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
 * Create hospital
 */
exports.create = function(req, res, next) {

    var hospital = new Hospital(req.body);

    req.assert('name', 'You must enter a name').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('cnpj', 'You must enter a valid CNPJ').notEmpty();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    hospital.save(function(err) {
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
 * Send hospital
 */
exports.me = function(req, res) {
    res.jsonp(req.hospital || null);
};

/**
 * Find hospital by id
 */
exports.hospital = function(req, res, next, id) {
    Hospital
        .findOne({
            _id: id
        })
        .exec(function(err, hospital) {
            if (err) return next(err);
            if (!hospital) return next(new Error('Failed to load User ' + id));
            req.profile = hospital;
            next();
        });
};

/**
 * Update Hospital Informations
 */
exports.update = function(req, res) {
    if (req.isAuthenticated()) {
        Hospital.update({
            _id: req.user.id
        }, {
            $set: req.body
        }, function(err, hospital) {
            if (err) return res.send(err);
            res.send(200, 'User Updated');
        });
    } else {
        return res.send(401, 'User Not Authorized');
    };
};

/**
 * Set Hospital Active status to false ("removed" from database)
 */
exports.remove = function(req, res) {
    if (req.isAuthenticated()) {
        Hospital.update({
            _id: req.user.id
        }, {
            $set: {
                active: false
            }
        }, function(err, hospital) {
            if (err) return res.send(err);
            res.send(200, 'User Removed');
        });
    } else {
        return res.send(401, 'User Not Authorized');
    };
};