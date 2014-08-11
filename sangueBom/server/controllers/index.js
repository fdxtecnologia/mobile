'use strict';

var mean = require('meanio');

exports.render = function(req, res) {

    var modules = [];

    // Preparing angular modules list with dependencies
    for (var name in mean.modules) {
        modules.push({
            name: name,
            module: 'mean.' + name,
            angularDependencies: mean.modules[name].angularDependencies
        });
    }

    function isAdmin() {
        return req.donor && req.donor.roles.indexOf('admin') !== -1;
    }

    // Send some basic starting info to the view
    res.render('index', {
        donor: req.donor ? {
            name: req.donor.name,
            _id: req.donor._id,
            donorname: req.donor.donorname,
            roles: req.donor.roles
        } : {},
        modules: modules,
        isAdmin: isAdmin,
        adminEnabled: isAdmin() && mean.moduleEnabled('mean-admin')
    });
};
