'use strict';

angular.module('mean.controllers.login', [])
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location',
        function($scope, $rootScope, $http, $location) {
            // This object will be filled by the form
            $scope.user = {};
            $scope.hospital = {};

            // Register the login() function
            $scope.loginHospital = function() {
                $http.post('/hospital/login', {
                    email: $scope.hospital.email,
                    password: $scope.hospital.password
                })
                    .success(function(response) {
                        // authentication OK
                        $scope.loginError = 0;
                        $rootScope.user = response.user;
                        $rootScope.$emit('loggedin');
                        if (response.redirect) {
                            if (window.location.href === response.redirect) {
                                //This is so an admin user will get full admin page
                                window.location.reload();
                            } else {
                                window.location = response.redirect;
                            }
                        } else {
                            $location.url('/hospital/searchdonors');
                        }
                    })
                    .error(function(err) {
                        $scope.loginerror = 'Authentication failed. ' + err;
                        console.log(err);
                    });
            }
            $scope.loginDonor = function() {

                $http.post('/donor/login', {
                    email: $scope.donor.email,
                    password: $scope.donor.password
                })
                    .success(function(response) {
                        $scope.loginError = 0;
                        $rootScope.user = response.user;
                        $rootScope.$emit('loggedin');
                        if (response.redirect) {
                            if (window.location.href === response.redirect) {
                                window.location.reload();
                            } else {
                                window.location = response.redirect;
                            }
                        } else {
                            $location.url('/donor/profile');
                        }
                    })
                    .error(function(err){
                        $scope.loginerror = 'Authentication failed. ' + err;
                    });
            };
        }
    ])
    .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location',
        function($scope, $rootScope, $http, $location) {
            $scope.user = {};
            $scope.hospital = {};

            $scope.registerHospital = function() {
                $scope.usernameError = null;
                $scope.registerError = null;
                $http.post('/registerhospital', {
                    email: $scope.hospital.email,
                    password: $scope.hospital.password,
                    confirmPassword: $scope.hospital.confirmPassword,
                    cnpj: $scope.hospital.cnpj,
                    name: $scope.hospital.name,
                    address: $scope.hospital.address
                })
                    .success(function() {
                        // authentication OK
                        $scope.registerError = 0;
                        $rootScope.user = $scope.hospital;
                        $rootScope.$emit('loggedin');
                        $location.url('/hospital/searchdonors');
                    })
                    .error(function(error) {
                        // Error: authentication failed
                        if (error === 'Username already taken') {
                            $scope.usernameError = angular.fromJson(error);
                        } else {
                            $scope.registerError = angular.fromJson(error);
                        }
                    });
            }

            $scope.registerDonor = function() {
                $scope.usernameError = null;
                $scope.registerError = null;
                $http.post('/registerdonor', {
                    email: $scope.donor.email,
                    username: $scope.donor.username,
                    password: $scope.donor.password,
                    confirmPassword: $scope.donor.confirmPassword,
                    name: $scope.donor.name
                })
                    .success(function() {
                        // authentication OK
                        $scope.registerError = 0;

                        /* send Donor to global scope (rootScope) */
                        $rootScope.user = $scope.donor;

                        /* Save User in Session Storage */
                        $rootScope.$emit('loggedin');
                        $location.url('/donor/profile');
                    })
                    .error(function(error) {
                        // Error: authentication failed
                        console.log(error);
                        if (error === 'Username or Email already taken') {
                            $scope.usernameError = error;
                        } else {
                            $scope.registerError = error;
                        }
                    });
            };
        }
    ])
    .controller('CollapseCrtl', function($scope) {
        $scope.isCollapsedHospital = true;
        $scope.isCollapsedDonor = true;
    });