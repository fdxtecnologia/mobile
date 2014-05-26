// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    window.navigator.geolocation.getCurrentPosition(function(location){});

    var bgGeo = window.plugins.backgroundGeoLocation;

    var callbackFn = function(location) {
        console.log('GEOOOOO: BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
        bgGeo.finish();
    };

    var failureFn = function(error) {
      console.log('BackgroundGeoLocation error');
    };

    bgGeo.configure(callbackFn,failureFn,{url: 'http://only.for.android.com/update_location.json', desiredAccuracy: 10, stationaryRadius: 20,distanceFilter: 30,debug:true});

    bgGeo.start();

    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.alarms', {
      url: '/alarms',
      views: {
        'alarms': {
          templateUrl: 'templates/alarms.html',
          controller: 'AlarmsCtrl'
        }
      }
    })

    .state('tab.adresses', {
      url: '/adresses',
      views: {
        'adresses': {
          templateUrl: 'templates/adresses.html',
          controller: 'AdressesCtrl'
        }
      }
    })
    .state('tab.adresses-add', {
      url: '/adresses/add',
      views: {
        'adresses': {
          templateUrl: 'templates/adresses-add.html',
          controller: 'NewAdressCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/alarms');

});
