'use strict';

var donors = require('../controllers/donors');

module.exports = function(app, passport) {

    app.route('/logout')
        .get(donors.signout);
    app.route('/donors/me')
        .get(donors.me);

    // Setting up the donors api
    app.route('/registerdonor')
        .post(donors.create);

    // Setting up the donorId param
    app.param('donorId', donors.donor);

    // AngularJS route to check for authentication
    app.route('/loggedin')
        .get(function(req, res) {
            res.send(req.isAuthenticated() ? req.donor : '0');
        });

    app.route('/donor/update')
        .put(donors.update);

    app.route('/donor/remove')
        .put(donors.remove)

    // Setting the local strategy route
    app.route('/donor/login')
        .post(passport.authenticate('donor', {
            failureFlash: true
        }), function(req, res) {
            console.log('donor strategy reached in routes');
            res.send({
                donor: req.donor,
                //redirect: (req.donor.roles.indexOf('admin') !== -1) ? req.get('referer') : false
            });
        });
};