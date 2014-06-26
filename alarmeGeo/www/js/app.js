// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        var watchID;
        var watchIDControl;
        var flag = false;

        if (!angular.isDefined(count)) {
            var count = 0;
        };

        if (!angular.isDefined(window.localStorage["Location"])) {
            window.localStorage["Location"] = angular.toJson([]);
        };

        var lastLocation = angular.fromJson(window.localStorage["Location"]);

        if (!angular.isDefined(window.localStorage["adresses"])) {
            window.localStorage["adresses"] = angular.toJson([]);
        };

        var alarms;

        if (!angular.isDefined(window.localStorage["alarms"])) {
            window.localStorage["alarms"] = angular.toJson([]);
        };
        alarms = angular.fromJson(window.localStorage["alarms"]);

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
        };

        var onWatch = function(location) {
            console.log("[FG] Latitude: " + location.coords.latitude + "Longitude: " + location.coords.longitude);
            alarms = angular.fromJson(window.localStorage["alarms"]);

            /*
            lastLocation = angular.fromJson(window.localStorage["Location"]);

            if (lastLocation === undefined) {
                window.localStorage["Location"] = angular.toJson({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });
            } else {
                var distance = measure(lastLocation.latitude, lastLocation.longitude, location.coords.latitude, location.coords.longitude);
            }
            */
            for (var i = 0; i < alarms.length; i++) {
                // IF there is an active alarm and it is at 60 meters from the desired place
                if ((alarms[i].checked == true) && (measure(location.coords.latitude, location.coords.longitude, alarms[i].adress.lat, alarms[i].adress.lng) < 60)) {
                    if (alarms[i].count == undefined) {
                        alarms[i].count = 1;
                    } else {
                        alarms[i].count = parseInt(alarms[i].count) + 1;
                    };

                    // Update Alarms counter at localStorage
                    window.localStorage['alarms'] = angular.toJson(alarms);

                    // After 4 onWatch loops with the alarm at the correct place 
                    if (alarms[i].count == 4) {
                        // CALL playAlarm function
                        playAlarm(alarms[i].id);
                    };
                } else {
                    alarms[i].count = undefined;
                    // Update Alarms counter at localStorage
                    window.localStorage['alarms'] = angular.toJson(alarms);
                };
            };

        };

        var playAlarm = function(toPlayAlarmID) {
            // routine to display notification and play the alarm song.
            for (var i = 0; i < alarms.length; i++) {
                if (alarms[i].id === toPlayAlarmID) {
                      window.plugin.notification.local.add({
                            id:      1,
                            title:   alarms[i].title,
                            message: alarms[i].note,
                            autoCancel: true,
                            repeat: 'hourly'
                        });

                        navigator.notification.vibrate(2500);

                    // Clear alarm counter
                    alarms[i].count = undefined;
                    // Disable alarm
                    alarms[i].checked = false;
                    // Update Alarm counter and status at localStorage
                    window.localStorage['alarms'] = angular.toJson(alarms);
                };
            };

            //Broadcast event to update changes to Alarms View
            $rootScope.$broadcast('alarmStatusChange', '');
        };

        var onErrorWatch = function(error) {
            window.navigator.geolocation.clearWatch(watchID);
            watchID = undefined;
            watchID = window.navigator.geolocation.watchPosition(onWatch, onErrorWatch, {
                maximumAge: 3000,
                timeout: 5000,
                enableHighAccuracy: true
            });
        };

        watchID = window.navigator.geolocation.watchPosition(onWatch, onErrorWatch, {
            maximumAge: 3000,
            timeout: 5000,
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

    .state('tab.newalarm', {
        url: '/alarms/new',
        views: {
            'alarms': {
                templateUrl: 'templates/new-alarm.html',
                controller: 'NewAlarmCtrl'
            }
        }
    })

    .state('tab.editalarm', {
        url: '/alarms/:itemId',
        views: {
            'alarms': {
                templateUrl: 'templates/edit-alarm.html',
                controller: 'EditAlarmCtrl'
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