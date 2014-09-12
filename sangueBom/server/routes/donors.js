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
            res.send(req.isAuthenticated() ? req.user : '0');
        });

    app.route('/donor/update')
        .post(donors.update);

    app.route('/donor/remove')
        .post(donors.remove);

    app.route('/donor/search')
        .get(donors.search);
        
    app.route('/donor/api/remove/:id')
        .put(donors.apiremove);

    app.route('/donor/api/ativa/:id')
        .put(donors.apiativa);

    app.route('/donor/api/updatecadastro/:user')
        .put(donors.apiupdateCadastro);

    app.route('/donor/api/update/:user')
        .put(donors.apiupdateEdit);

    // Setting the local strategy route
    app.route('/donor/login')
        .post(passport.authenticate('donor', {
            failureFlash: true
        }), function(req, res) {
            res.send({
                user: req.user,
                //redirect: (req.donor.roles.indexOf('admin') !== -1) ? req.get('referer') : false
            });
        });
};