'use strict'

var hospitals = require('../controllers/hospitals');

module.exports = function(app, passport) {

	app.route('/logout')
		.get(hospitals.signout);
	app.route('/hospital/me')
		.get(hospitals.me);

	// hospital api
	app.route('/registerhospital')
		.post(hospitals.create);

	// Setting up the hospitalId param
    app.param('hospitalId', hospitals.hospital);

    // AngularJS route to check for authentication
    app.route('/loggedin')
        .get(function(req, res) {
            res.send(req.isAuthenticated() ? req.hospital : '0');
        });

    app.route('/hospital/update')
        .put(hospitals.update);

    app.route('/hospital/remove')
        .put(hospitals.remove)


    // Setting the local strategy route
    app.route('/hospital/login')
        .post(passport.authenticate('hospital', {
            failureFlash: true
        }), function(req, res) {
            console.log('hospital strategy reached in routes');
            res.send({
                user: req.user,
                //redirect: (req.hospital.roles.indexOf('admin') !== -1) ? req.get('referer') : false
            });
        });

};
