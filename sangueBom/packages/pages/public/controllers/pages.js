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

                $http.post('/donor/update', {
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
                })
                    .success(function(response) {
                        // authentication OK
                        console.log('sucesso ' + response);
                        $location.url('/');
                    })
                    .error(function(err) {
                        console.log('error ' + err);
                    });
            };
        }
    ]);