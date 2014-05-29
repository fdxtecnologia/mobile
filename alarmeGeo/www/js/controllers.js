angular.module('starter.controllers', ['ionic'])

.controller('AlarmsCtrl', function($scope, $state) {
  
})

.controller('AdressesCtrl', function($scope, $rootScope, $http, $state, $window) {
    
   $scope.items = angular.fromJson(window.localStorage["adresses"]);

  $scope.goToAdd = function(){
		$state.go('tab.adresses-add');
	};
})

.controller('NewAdressCtrl', function($scope, $ionicLoading, $http, $state, $window, $rootScope) {
  $scope.data = {};
	 var initialize = function() {
      var myLatlng = new google.maps.LatLng(-22.4329106,-45.4590677);
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapMaker: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        //alert("teste: "+map);

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
          e.preventDefault();
          return false;
        });

        $scope.map = map;
      }
      initialize();
      google.maps.event.addDomListener(window, 'load', initialize);
      


      $scope.centerOnMe = function() {
          var end = $scope.data.endereco;

        
          $scope.geocoder = new google.maps.Geocoder();
          //alert("Endereço: "+end);
          $scope.geocoder.geocode({'address': end}, function(results, status) {
            //alert(JSON.stringify(results[0]));
            //alert(status);
            if (status == google.maps.GeocoderStatus.OK) {
              //alert("Deu certo!");
              //alert("Latitude: "+results[0].geometry.location.lat());
              //alert("Latitude: "+results[0].geometry.location.lng());
              $scope.lat = results[0].geometry.location.lat();
              $scope.lng = results[0].geometry.location.lng();
              //alert("Scope lat: "+$scope.lat);
              //alert("Scope lng: "+$scope.lng);
              $scope.map.setCenter(new google.maps.LatLng($scope.lat, $scope.lng));
              var myLatlngNew = new google.maps.LatLng($scope.lat,$scope.lng);
              var marker = new google.maps.Marker({
                  position: myLatlngNew,
                  map: $scope.map,
                  title: 'Localização Endereço'
              });
              //$scope.map.panTo(new GLatLng(lat,lon));
            } else {
              alert("Endereço não localizado: " + status);
            }

          });
          
      }

      $scope.saveAdress = function() {
          var nomeLocal = $scope.data.nomeLocal;
          var end = $scope.data.endereco;

          $scope.userAlarm = {
                'local': nomeLocal,
                'end': end,
                'lat': $scope.lat,
                'lng': $scope.lng
          };

          alert("Alarme salvo com sucesso");

          $rootScope.alarms = undefined;

          $rootScope.alarms = angular.fromJson(window.localStorage["adresses"]);
          $rootScope.alarms.push($scope.userAlarm);

          window.localStorage["adresses"] = angular.toJson($rootScope.alarms);

          $state.go('tab.adresses');
          
      };
})

.controller('AccountCtrl', function($scope) {
});
