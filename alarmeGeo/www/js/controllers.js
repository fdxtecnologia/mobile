angular.module('starter.controllers', ['ngAudio'])

.controller('AlarmsCtrl', function($scope, $rootScope) {
    //*********************************************************//
    $scope.alarmsShow = angular.fromJson(window.localStorage['alarms']);
    // fim inicialização
    //*********************************************************//

    $scope.changeStatus = function(checked) {
        // update no estado do alarm e rearmazenamento no localStorage - True: ativado, False: desativado
        this.item.checked = !checked;
        window.localStorage['alarms'] = angular.toJson($scope.alarmsShow);
    };

    $rootScope.$on('alarmStatusChange', function() {
        $scope.alarmsShow = angular.fromJson(window.localStorage['alarms']);
        $scope.$apply();
    });
})

.controller('AdressesCtrl', function($scope, $state) {
    $scope.items = angular.fromJson(window.localStorage["adresses"]);
    $scope.goToAdd = function() {
        $state.go('tab.adresses-add');
    };
})

.controller('NewAdressCtrl', function($scope, $ionicLoading, $http, $state, $window, $rootScope) {
    $scope.data = {};
    var initialize = function() {
        var myLatlng = new google.maps.LatLng(-22.4329106, -45.4590677);
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
        $scope.geocoder.geocode({
            'address': end
        }, function(results, status) {
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
                var myLatlngNew = new google.maps.LatLng($scope.lat, $scope.lng);
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

        alert("Endereço salvo com sucesso.");

        $rootScope.alarms = undefined;

        $rootScope.alarms = angular.fromJson(window.localStorage["adresses"]);
        $rootScope.alarms.push($scope.userAlarm);

        window.localStorage["adresses"] = angular.toJson($rootScope.alarms);

        $state.go('tab.adresses');

    };
})

.controller('NewAlarmCtrl', function($scope, $state, $rootScope, ngAudio) {
    $scope.data = {};
    $scope.input = {
        'title': '',
        'ad': undefined
    };
    $scope.list = [];
    var alarm_json = {
        'id': 0,
        'title': '',
        'adress': {},
        'note': '',
        'alarm': '',
        'checked': false,
        'count': undefined
    };

    if (angular.isDefined($rootScope.input)) {
        $scope.input.title = $rootScope.input.title;
        $scope.input.note = $rootScope.input.note;
    } else {
        $rootScope.input = $scope.input;
    };

    $scope.adresses = angular.fromJson(window.localStorage["adresses"]);
    // fim inicialização de variáveis
    //*********************************************************//

    $scope.$on('$destroy', function() {
        $rootScope.input = $scope.input;
    });

    $scope.createAlarm = function() {
        // armazenar informações do alarm no localStorage
        alarm_json.title = $scope.input.title;
        alarm_json.adress = $scope.input.ad;
        alarm_json.count = undefined;
        alarm_json.note = document.getElementById('note').value;
        alarm_json.alarm = $scope.data.nomeSom;
        // variáveis armazenadas em alarm_json

        // IF titulo do alarme não estiver vazio e possuir endereço selecionado!
        if ($scope.input.title != '' && angular.isDefined($scope.input.ad)) {
            // ŚE não indice de alarmes não estiver definido:
            if (!angular.isDefined(window.localStorage['alarmIndex'])) {
                // Cria o primeiro elemento com indice 0 e id 0
                alarm_json.id = 0;
                $scope.list = [alarm_json];
                window.localStorage['alarmIndex'] = 0;
                window.localStorage['alarms'] = angular.toJson($scope.list);
            } else {
                // Incrementa index de alarmes e armazena novo alarme, alarme id = alarme index
                window.localStorage['alarmIndex'] = parseInt(window.localStorage['alarmIndex']) + 1;
                alarm_json.id = parseInt(window.localStorage['alarmIndex']);
                $scope.list = angular.fromJson(window.localStorage['alarms']); //array list
                $scope.list.push(alarm_json);
                window.localStorage['alarms'] = angular.toJson($scope.list);
            };

            //ngAudio.toggleMute(['audio/song1.mp3', 'audio/song2.mp3', 'audio/song3.mp3']);
            $scope.input = undefined;
            $state.go('tab.alarms');
        } else {
            alert("Alarm name and address options are required");
        };
    };
})

.controller('EditAlarmCtrl', function($scope, $state, $rootScope, $stateParams, $location) {
    // ****************************************************** //
    $scope.data = {};

    $scope.id = $stateParams.itemId;
    $scope.adresses = angular.fromJson(window.localStorage['adresses']);
    $scope.alarms = angular.fromJson(window.localStorage['alarms']);
    $scope.input = {
        'title': '',
        'ad': undefined
    };

    for (var i = 0; i < $scope.alarms.length; i++) {
        if ($scope.alarms[i].id == $scope.id) {
            document.getElementById('note').value = $scope.alarms[i].note;
            $scope.select = $scope.alarms[i];
            $scope.input.title = $scope.alarms[i].title;
        };
    };

    var alarm_json = {
        'id': 0,
        'title': '',
        'adress': {},
        'note': '',
        'alarm': '',
        'checked': false
    };
    $scope.list = [];
    // fim inicialização
    // ****************************************************** //

    $scope.updateAlarm = function() {
        for (var i = 0; i < $scope.alarms.length; i++) {
            if ($scope.alarms[i].id == $scope.id) {
                $scope.alarms[i].note = document.getElementById('note').value;
                if (angular.isDefined($scope.input.ad)) {
                    $scope.alarms[i].adress = $scope.input.ad;
                };
                $scope.alarms[i].title = $scope.input.title;
                $scope.alarms[i].alarm = $scope.data.nomeSom;
                window.localStorage['alarms'] = angular.toJson($scope.alarms);
            };
        };
        $location.path('tab.alarms');
    };

    $scope.removeAlarm = function() {
        for (var i = 0; i < $scope.alarms.length; i++) {
            if ($scope.alarms[i].id != $scope.id) {
                $scope.list.push($scope.alarms[i]);
            };
        };
        window.localStorage['alarms'] = angular.toJson($scope.list);
        $location.path('tab.alarms');
    };
});