'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$http', '$rootScope', 'Global', 'Menus',
    function($scope, $http, $rootScope, Global, Menus) {
        $scope.global = Global;
        $scope.menus = {};
        if (!angular.isDefined($rootScope.user) && angular.isDefined(sessionStorage.user)) {
            $rootScope.user = angular.fromJson(sessionStorage.user);
            queryMenu('main', defaultMainMenu);
            $scope.global = {
                authenticated: !! $rootScope.user,
                user: $rootScope.user
            };
        }else{
            $scope.global = {
                authenticated: !! $rootScope.user,
                user: $rootScope.user
            };
            queryMenu('main', defaultMainMenu);
        };


        // Default hard coded menu items for main menu
        var defaultMainMenu = [];

        // Query menus added by modules. Only returns menus that user is allowed to see.
        function queryMenu(name, defaultMenu) {
            Menus.query({
                name: name,
                defaultMenu: defaultMenu
            }, function(menu) {
                $scope.menus[name] = menu;
            });
        };

/*        if (!angular.isDefined($rootScope.user) && angular.isDefined(sessionStorage.user)) {
            $rootScope.user = sessionStorage.user;
            console.log('sessionStorage user: ' + $rootScope.user);
            $scope.$emit('loggedin');
        };*/

        // Query server for menus and check permissions
        queryMenu('main', defaultMainMenu);

        $scope.isCollapsed = false;

        $rootScope.$on('loggedin', function() {
            sessionStorage.user = angular.toJson($rootScope.user);
            queryMenu('main', defaultMainMenu);
            $scope.global = {
                authenticated: !! $rootScope.user,
                user: $rootScope.user
            };
        });

        $scope.logout = function() {
            delete sessionStorage.user;
            $http.get('/logout');
        };
    }
]);