// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $interval) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        var watchID;
        var watchIDControl;
        var count = 0;
        var lastLocation = window.localStorage["Location"];
        window.localStorage["adresses"] = angular.toJson([]);
        window.navigator.geolocation.getCurrentPosition(function(location) {});

        function measure(lat1, lon1, lat2, lon2) { // generally used geo measurement function
            var R = 6378.137; // Radius of earth in KM
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d * 1000; // meters
        }

        var onWatch = function(location) {
            console.log("[FG] Latitude: " + location.coords.latitude + "Longitude: " + location.coords.longitude);

            lastLocation = angular.fromJson(window.localStorage["Location"]);

            if (lastLocation === undefined) {
                window.localStorage["Location"] = angular.toJson({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });
            } else {

                var distance = measure(lastLocation.latitude, lastLocation.longitude, location.coords.latitude, location.coords.longitude);

            }
        };

        var onErrorWatch = function(error) {
            window.navigator.geolocation.clearWatch(watchID);
            watchID = undefined;
            watchID = window.navigator.geolocation.watchPosition(onWatch, onErrorWatch, {
                maximumAge: 3000,
                timeout: 40000,
                enableHighAccuracy: true
            });
        };

        watchID = window.navigator.geolocation.watchPosition(onWatch, onErrorWatch, {
            maximumAge: 3000,
            timeout: 40000,
            enableHighAccuracy: true
        });

        // var bgGeo = window.plugins.backgroundGeoLocation;

        // var callbackFn = function(location) {
        //     console.log('[BG] :  ' + location.latitude + ',' + location.longitude);
        //     bgGeo.finish();
        // };

        // var failureFn = function(error) {
        //   console.log('BackgroundGeoLocation error');
        // };

        // bgGeo.configure(callbackFn,failureFn,{url: 'http://only.for.android.com/update_location.json', desiredAccuracy: 10, stationaryRadius: 20,distanceFilter: 30,debug:true});

        // bgGeo.start();

        if (window.StatusBar) {
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

    .state('tab.editalarm', {
        url: '/alarms/edit/:itemId',
        views: {
            'alarms': {
                templateUrl: 'templates/edit-alarm.html',
                controller: 'EditAlarmCtrl'
            }
        }
    })

    .state('tab.newalarm', {
        url: '/alarms/new',
        views: {
            'alarms': {
                templateUrl: 'templates/new-alarm.html',
                controller: 'NewAlarmCtrl'
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