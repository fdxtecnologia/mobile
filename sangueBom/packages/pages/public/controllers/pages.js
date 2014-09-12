'use strict';

angular.module('mean.pages')
    .controller('PagesController', ['$scope', 'Global', 'Pages',
        function($scope, Global, Pages) {
            $scope.global = Global;
            $scope.package = {
                name: 'pages'
            };
        }
    ])
    .controller('SearchDonorController', ['$scope', 'Global', 'Pages', '$http', '$location',
        function($scope, Global, Pages, $http, $location) {
            $scope.data = {};
            $scope.blood = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'];
            $scope.searchObj = {};
            var bloodType, marker = [];

            /* Init LeafLet MAP */
            var map = L.map('map', {
                center: [-22.422971, -45.4602511],
                zoom: 8
            });
            L.tileLayer('http://{s}.tiles.mapbox.com/v3/damatos.jb1fafg5/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18
            }).addTo(map);

            $scope.initForm = function() {
                $scope.searchObj = $location.search();
                if (angular.isDefined($scope.searchObj.bloodType)) {
                    $scope.data.bloodType = $scope.searchObj.bloodType;
                    $scope.data.range = $scope.searchObj.range;
                    $scope.submit();
                } else {
                    $scope.searchObj = undefined;
                };
            };

            $scope.submit = function() {
                if (angular.isDefined($scope.data.bloodType)) {
                    $location.search($scope.data);
                    var config = {
                        method: 'GET',
                        url: '/donor/search',
                        params: {
                            bloodType: $scope.data.bloodType,
                            range: $scope.data.range
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        cache: true
                    };
                    $http(config)
                        .success(function(response) {
                            // authentication OK
                            console.log(response);
                            $scope.mapPoints = angular.fromJson(response);
                            $scope.placePins();
                        })
                        .error(function(err) {
                            console.log('error ' + err);
                        });
                };
            };
            $scope.placePins = function () {
                // body...
                for (var i = $scope.mapPoints.length - 1; i >= 0; i--) {
                    if ($scope.mapPoints[i].latitude != undefined && $scope.mapPoints[i].longitude != undefined) {
                        console.log($scope.mapPoints[i]);
                        marker[i] = L.marker( [$scope.mapPoints[i].latitude, $scope.mapPoints[i].longitude] ).addTo(map);
                        marker[i].bindPopup("Nome: " + $scope.mapPoints[i].name);
                    };
                };

            };
        }
    ])
    .controller('SearchCenterController', ['$scope', 'Global', 'Pages', '$http', '$location',
        function($scope, Global, Pages, $http, $location) {
            $scope.data = {};
            var marker = [];

            // initialize map
            var map = L.map('map', {
                center: [-22.422971, -45.4602511],
                zoom: 8
            });
            L.tileLayer('http://{s}.tiles.mapbox.com/v3/damatos.jb1fafg5/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18
            }).addTo(map);

            $scope.initForm = function() {
                $scope.searchObj = $location.search();
                if (angular.isDefined($scope.searchObj.range)) {
                    $scope.data.range = $scope.searchObj.range;
                    $scope.submit();
                } else {
                    $scope.searchObj = undefined;
                };
            };

            $scope.submit = function() {
                if (angular.isDefined($scope.data.range)) {
                    $location.search($scope.data);
                };
                var config = {
                    method: 'GET',
                    url: '/hospital/search',
                    params: {
                        range: $scope.data.range
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    cache: true
                };
                $http(config)
                    .success(function(response) {
                        // authentication OK
                        $scope.mapPoints = angular.fromJson(response);
                        console.log($scope.mapPoints);
                        $scope.placePins();
                    })
                    .error(function(err) {
                        console.log('error ' + err);
                    });
            };

            $scope.placePins = function () {
                for (var i = $scope.mapPoints.length - 1; i >= 0; i--) {
                    console.log($scope.mapPoints[i]);
                    marker[i] = L.marker( [$scope.mapPoints[i].latitude, $scope.mapPoints[i].longitude] ).addTo(map);
                    marker[i].bindPopup("nome" + $scope.mapPoints[i].name);
                };
            };
        }
    ])
    .controller('ProfileController', ['$scope', 'Global', 'Pages', '$http', '$location',
        function($scope, Global, Pages, $http, $location) {
            $scope.data = {};
            $scope.options = ['Sim', 'Não'];
            $scope.sex = ['M', 'F'];
            $scope.aidsOptions = ['Sim', 'Não', 'Não Sei'];
            $scope.blood = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'];

            $scope.init = function() {
                $http.get('/loggedin')
                    .success(function(response) {
                        $scope.data.phoneFix = response.phoneFix;
                        $scope.data.phoneMobile = response.phoneMobile;
                        $scope.data.address = response.address;
                        if (angular.isDefined(response.birthDate)) {
                            var res = response.birthDate;
                            var year = res.slice(0, 4);
                            var month = res.slice(5, 7);
                            var day = res.slice(8, 10);
                            $scope.data.birthDate = year + '-' + month + '-' + day;
                        };
                        $scope.data.weight = response.weight;
                        $scope.data.gender = response.gender;
                        $scope.data.hadHepatite = response.hadHepatite;
                        $scope.data.ageHepatite = response.ageHepatite;
                        $scope.data.ageHepatite = response.ageHepatite;
                        $scope.data.contactWChagas = response.contactWChagas;
                        $scope.data.hadMalaria = response.hadMalaria;
                        $scope.data.hasEpilepsia = response.hasEpilepsia;
                        $scope.data.hasSiflis = response.hasSiflis;
                        $scope.data.hasDiabetes = response.hasDiabetes;
                        $scope.data.hasRecentTattos = response.hasRecentTattos;
                        $scope.data.hasRecentTransfusion = response.hasRecentTransfusion;
                        $scope.data.hasAIDS = response.hasAIDS;
                        $scope.data.bloodType = response.bloodType;
                    })
                    .error(function(err) {
                        console.log(err);
                    })
            };

            $scope.save = function() {
                if ($scope.data.hadHepatite == 'Não') {
                    $scope.data.ageHepatite = null;
                };
                var jsonSend = {
                    phoneFix: $scope.data.phoneFix,
                    phoneMobile: $scope.data.phoneMobile,
                    address: $scope.data.address,
                    latitude: $scope.data.latitude,
                    longitude: $scope.data.longitude,
                    birthDate: $scope.data.birthDate,
                    weight: $scope.data.weight,
                    gender: $scope.data.gender,
                    hadHepatite: $scope.data.hadHepatite,
                    ageHepatite: $scope.data.ageHepatite,
                    contactWChagas: $scope.data.contactWChagas,
                    hadMalaria: $scope.data.hadMalaria,
                    hasEpilepsia: $scope.data.hasEpilepsia,
                    hasSiflis: $scope.data.hasSiflis,
                    hasDiabetes: $scope.data.hasDiabetes,
                    hasRecentTattos: $scope.data.hasRecentTattos,
                    hasRecentTransfusion: $scope.data.hasRecentTransfusion,
                    hasAIDS: $scope.data.hasAIDS,
                    bloodType: $scope.data.bloodType
                };
                console.log(jsonSend);
                var config = {
                    method: 'POST',
                    url: '/donor/update',
                    data: $.param(jsonSend),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                $http(config)
                    .success(function(response) {
                        // authentication OK
                        $location.url('/');
                    })
                    .error(function(err) {
                        console.log('error ' + err);
                    });
            };
        }
    ]);