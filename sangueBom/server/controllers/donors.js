'use strict';

/**
 * Dependencies
 */
var mongoose = require('mongoose'),
    User = mongoose.model('Donor'),
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

    var donor = new User(req.body);

    req.assert('name', 'You must enter a name').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
    donor.roles = ['donor'];
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
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.donor || null);
};

/**
 * Find donor by id
 */
exports.donor = function(req, res, next, id) {
    User
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
        var lat, lng, result;
        
        /*
         * Body has the information about the user req
         * If it has no address and it has LATITUDE AND LONGITUDE, no update
         */        
        if ((req.body.address != null) && (req.user.latitude == undefined) && (req.user.longitude == undefined)) {            
            /** 
             *  Geocode function
             *  Recieve address and return Latitude/Longitude
             */
            var geocall = function() {
                // body...
                geocoder.geocode(req.body.address, function(err, data) {
                    /** 
                     * Timeout set to wait the return from geocoding
                     */
                    setTimeout(function() {
                        result = JSON.parse(JSON.stringify(data.results));
                        var tmp = result[0];
                        lat = tmp.geometry.location.lat;
                        lng = tmp.geometry.location.lng;

                        if (lat != null && lng != null) {
                            User.update({
                                _id: req.user.id
                            }, {
                                $set: {
                                    'latitude': lat
                                }
                            }, function(err) {
                                if (err) {
                                    res.send(err)
                                };
                            });
                            User.update({
                                _id: req.user.id
                            }, {
                                $set: {
                                    'longitude': lng
                                }
                            }, function(err) {
                                if (err) {
                                    res.send(err)
                                };
                            });
                        } else {
                            geocall();
                            console.log('Geocoding failed... Calling Google Geocoding again');
                        };
                    }, 3000);
                });
            };
        };
        geocall();
        User.update({
            _id: req.user.id
        }, {
            $set: req.body,
        }, function(err, donor) {
            if (err) return res.send(err);
            res.status(202).end();
        });
    } else {
        return res.send(401, 'User Not Authorized');
    };
};


/**
 * Remove user
 * Set active flag to false
 */
exports.remove = function(req, res) {
    console.log(req.user);
    if (req.isAuthenticated()) {
        User.update({
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

/**
 * Search users
 * Return user list
 */
exports.search = function(req, res) {
    if (req.isAuthenticated()) {
        User.find({
            'bloodType': req.query.bloodType,
            'active': true
        }, 'bloodType name latitude longitude',function(err, docs) {
            if (err) {
                res.status(200).send(err)
            } else {
            
                /*
                 * Range limit calculation
                 */
                res.status(202).send(docs);
            };
        })
    } else {
        res.status(401, 'User Not Authorized');
    };
};


/**
 * Mobile access method
 * API Remove user
 * Set active flag to false
 */
exports.apiremove = function(req, res) {
    User.update({
        _id: req.params.id
    }, {
        $set: {
            active: false
        }
    }, function(err, donor) {
        if (err) return res.send(err);
        res.send(202, 'User Removed');
    });
};

/**
 * Mobile access method
 * API Remove user
 * Set active flag to false
 */
exports.apiativa = function(req, res) {
    User.update({
        _id: req.params.id
    }, {
        $set: {
            active: true
        }
    }, function(err, donor) {
        if (err) return res.send(err);
        res.send(202, 'User Active');
    });
};


/**
 * Mobile access method
 * API Remove user
 * Set active flag to false
 */
exports.apiupdateEdit = function(req, res) {
    var User = req.params.user.split('@');
    if (User[1] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {
                name: User[1]
            }
        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[2] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                password: User[2]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[3] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {
                phoneFix: User[3]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[4] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                phoneMobile: User[4]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[5] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                latitude: User[5]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[6] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                longitude: User[6]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[7] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                birthDate: User[7]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[8] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                weight: User[8]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[9] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                gender: User[9]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[10] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hadHepatite: User[10]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[11] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                contactWChagas: User[11]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[12] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hadMalaria: User[12]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[13] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasEpilepsia: User[13]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[14] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasSiflis: User[14]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[15] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasDiabetes: User[15]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[16] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasRecentTattos: User[16]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[17] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasRecentTransfusion: User[17]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[18] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasAIDS: User[18]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[19] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                bloodType: User[19]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[20] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                adress: User[20]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }
};


/**
 * Mobile access method
 * API Update User
 * Update user informations
 */
exports.apiupdateCadastro = function(req, res) {
    var User = req.params.user.split('@');

    if (User[1] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                phoneFix: User[1]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[2] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                phoneMobile: User[2]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[3] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                latitude: User[3]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[4] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                longitude: User[4]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[5] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                birthDate: User[5]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[6] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                weight: User[6]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[7] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                gender: User[7]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[8] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hadHepatite: User[8]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[9] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                contactWChagas: User[9]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[10] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hadMalaria: User[10]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[11] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasEpilepsia: User[11]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[12] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasSiflis: User[12]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[13] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasDiabetes: User[13]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[14] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasRecentTattos: User[14]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[15] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasRecentTransfusion: User[15]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[16] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                hasAIDS: User[16]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[17] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                bloodType: User[17]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }

    if (User[18] != "undefined") {
        User.update({
            _id: User[0]
        }, {
            $set: {

                adress: User[18]
            }

        }, function(err, donor) {
            if (err) return res.send(err);
            res.send(202, 'User Updated');
        });
    }
};