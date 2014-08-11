'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Pages = new Module('pages');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Pages.register(function(app, auth, database, passport) {

    //We enable routing. By default the Package Object is passed to the routes
    Pages.routes(app, auth, database, passport);

    //We are adding a link to the main menu for all authenticated users
    Pages.menus.add({
        'roles': ['donor'],
        'title': 'Informações Pessoais',
        'link': 'profile'
    });

    Pages.menus.add({
        'title': 'Centros de Doação',
        'link': 'search centers'
    });

    Pages.menus.add({
        'roles': ['hospital'],
        'title': 'Buscar Doadores',
        'link': 'search donors'
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Pages.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Pages.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Pages.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return Pages;
});