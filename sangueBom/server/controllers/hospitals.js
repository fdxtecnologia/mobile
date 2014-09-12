'use strict'

/**
 * Dependencies
 */
var mongoose = require('mongoose'),
    User = mongoose.model('Hospital'),
    ObjectId = require('mongoose').Types.ObjectId,
    geocoder = require('geocoder');

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

        console.log('sigin user reached');
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
 * Create user
 */
exports.create = function(req, res, next) {

    var user = new User(req.body);
    var result, tmp;

    req.assert('name', 'You must enter a name').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('cnpj', 'You must enter a valid CNPJ').notEmpty();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.assert('address', 'Address required').notEmpty();

    geocoder.geocode(user.address, function(err, data) {
        result = JSON.parse(JSON.stringify(data.results));
        console.log('TESTE SEM stringify E parse: ' + data.results[0]);
        tmp = result[0];
    });


    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    };

    setTimeout(function() {
        user.latitude = tmp.geometry.location.lat;
        user.longitude = tmp.geometry.location.lng;

        user.roles = ['hospital'];

        user.save(function(err) {
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
    }, 2000);

};

/**
 * Send user
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.hospital = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};

/**
 * Update User Informations
 */
exports.update = function(req, res) {

    console.log(req.body);
    if (req.isAuthenticated()) {
        User.update({
            _id: req.user.id
        }, {
            $set: req.body
        }, function(err, user) {
            if (err) return res.send(err);
            res.send(200, 'User Updated');
        });
    } else {
        return res.send(401, 'User Not Authorized');
    };
};

/**
 * Set User Active status to false ("removed" from database)
 */
exports.remove = function(req, res) {
    if (req.isAuthenticated()) {
        User.update({
            _id: req.user.id
        }, {
            $set: {
                active: false
            }
        }, function(err, user) {
            if (err) return res.send(err);
            res.send(200, 'User Removed');
        });
    } else {
        return res.send(401, 'User Not Authorized');
    };
};

/**
 * Search hospital
 * Return hospital list
 */
exports.search = function(req, res) {
    User.find({
        'active': true
    }, 'latitude longitude name', function (err, docs) {
        if (err) {
            res.status(200).send(err);
        }else{
            res.status(202).send(docs);
        };
    });
    /*User.find({
        'bloodType': req.query.bloodType,
        'active': true
    }, 'bloodType name', function(err, docs) {
        if (err) {
            res.status(200).send(err)
        } else {

            /*
             * Range limit calculation
             */

            /*
            res.status(202).send(docs);
        };
    });*/
};