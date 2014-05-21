angular.module('starter.controllers', [])

.controller('AlarmsCtrl', function($scope) {
})

.controller('AdressesCtrl', function($scope, $state) {
	$scope.goToAdd = function(){
		$state.go('tab.adresses-add');
	};
})

.controller('NewAdressCtrl', function($scope, $stateParams) {

})

.controller('AccountCtrl', function($scope) {
});
