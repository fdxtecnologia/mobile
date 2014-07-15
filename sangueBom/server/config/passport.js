'use strict';

var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('Donor'),
    Hospital = mongoose.model('Hospital'),
    config = require('./config');

module.exports = function(passport) {

    // Serialize the user id to push into the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize the object based on a pre-serialized token
    // which is the id
    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, '-salt -hashed_password', function(err, user) {
            if (err) done(err);
            if (user) {
                done(null, user);
            } else {
                Hospital.findOne({
                    _id: id
                }, '-salt -hashed_password', function(err, user) {
                    done(null, user);
                });
            }
        });
    });

    // Use donor-local strategy
    passport.use('donor', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({
                email: email
            }, function(err, donor) {
                console.log('donor strategy reached');
                if (err) {
                    return done(err);
                }
                if (!donor) {
                    return done(null, false, {
                        message: 'Unknown donor'
                    });
                }
                if (!donor.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, donor);
            });
        }
    ));

    // Use hospital-local strategy
    passport.use('hospital', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            // body...
            console.log('hospital strategy reached');
            Hospital.findOne({
                email: email
            }, function(err, hospital) {
                // body...
                if (err) {
                    return done(err);
                }
                if (!hospital) {
                    return done(null, false, {
                        message: 'Unknown Hospital'
                    });
                }
                if (!hospital.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, hospital);
            })
        }
    ));
};