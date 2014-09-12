'use strict';

angular.module('mean.pages').config(['$stateProvider',
    function($stateProvider) {
        /*        $stateProvider.state('pages example page', {
            url: '/pages/example',
            templateUrl: 'pages/views/index.html'
        });*/
        $stateProvider
            .state('profile', {
                url: '/donor/profile',
                templateUrl: 'pages/views/profile.html'
            })
            .state('search donors', {
                url: '/hospial/searchdonors',
                templateUrl: 'pages/views/searchdonors.html'
            })
            .state('search centers', {
                url: '/donors/searchcenters',
                templateUrl: 'pages/views/searchcenters.html'
            });
    }
]);