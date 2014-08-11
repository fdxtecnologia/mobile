angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  },

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('LoginCtrl', function($scope, $state, $http, $rootScope){
    $scope.data = {};

    $scope.login = function(){
      var email = $scope.data.email;
      var password = $scope.data.password;

      var userJsonLogin = {
        'email': email,
        'password': password
      };

      $http.post('http://localhost:3000/donor/login', userJsonLogin)
        .success(function(response){
           $rootScope.donor = response.donor;
           $rootScope.donor.senha = password;
           //alert(JSON.stringify($rootScope.donor));
           $state.go('app.home');
        })
        .error(function(data, status, headers, config){
          if(status == 400){
            alert("Preencha todos os campos!");
          }
          if(status == 401){
            alert("Email ou Senha incorretos!");
          }

        });
    }

    $scope.cadastrar = function(){
      $state.go('app.cadastrouser');
    }
})

.controller('HomeCtrl', ['$scope', '$stateParams', '$http', '$rootScope', '$state',
    function($scope, $stateParams, $http, $rootScope, $state) {
      $scope.donor = $rootScope.donor;
      
      $scope.editarDados = function(){
        $state.go('app.editardados');
      }

      $scope.desativar = function(){
          console.log($rootScope.donor);
          var userJson = {
            '_id': $rootScope.donor._id
          }

          $http.put('http://localhost:3000/donor/api/remove/'+$rootScope.donor._id)
            .success(function(data, status, headers, config) {
                // authentication OK
              alert("Desativado com sucesso!");
               $state.go('app.home');
            })
            .error(function(data, status, headers, config) {
                // Error: authentication failed
                alert("ERRO!");
            });
      }

      $scope.ativar = function(){
          var userJson = {
            '_id': $rootScope.donor._id
          }

          $http.put('http://localhost:3000/donor/api/ativa/'+$rootScope.donor._id)
            .success(function(data, status, headers, config) {
                // authentication OK
              alert("Ativado com sucesso!");
               $state.go('app.home');
            })
            .error(function(data, status, headers, config) {
                // Error: authentication failed
                alert("ERRO!");
            });
      }

    }    
])
.controller('CadastroUserCtrl', ['$scope', '$stateParams', '$http', '$state', '$rootScope',
    function($scope, $stateParams, $http, $state, $rootScope) {
      $scope.data = {};

      $scope.cadastrarUser = function(){
            var nome = $scope.data.nome;
            var email = $scope.data.email;
            var login = $scope.data.login;
            var senha = $scope.data.senha;
            var confirmSenha = $scope.data.confirmSenha;

            var userJson = {
              'name': nome,
              'email': email,
              'username': login,
              'password': senha,
              'confirmPassword': confirmSenha
            };
                
                $http.post('http://localhost:3000/registerdonor', userJson)
                    .success(function(data, status, headers, config) {
                          // authentication OK
                          alert("cadastrado!");
                         var userJsonLogin = {
                            'email': email,
                            'password': senha
                          };

                          $http.post('http://localhost:3000/donor/login', userJsonLogin)
                            .success(function(response){
                               $rootScope.donor = response.donor;
                               $rootScope.donor.senha = senha;
                               alert(JSON.stringify($rootScope.donor));
                               $state.go('app.cadastrousercontinuacao');
                            })
                            .error(function(data, status, headers, config){
                               alert("erro!");

                            });
                    })
                    .error(function(data, status, headers, config) {
                        // Error: authentication failed
                        alert(status);
                    });
      } 
    }
])
.controller('CadastroUserContCtrl', ['$scope', '$stateParams', '$http', '$state', '$rootScope',
    function($scope, $stateParams, $http, $state, $rootScope) {
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

      $scope.cadastrarUserCont = function(){
            var telefone = $scope.data.telefone;
            var celular = $scope.data.celular;
            var endereco = $scope.data.endereco;
            var aniversario = $scope.data.aniversario;
            var peso = $scope.data.peso;
            if($scope.data.sexo == "Masculino"){
              var sexo = "M";
            } else {
              var sexo = "F";
            }
            var hepatite = $scope.data.hepatite;
            var chagas = $scope.data.chagas;
            var malaria = $scope.data.malaria;
            var epilepsia = $scope.data.epilepsia;
            var sifilis = $scope.data.sifilis;
            var diabetes = $scope.data.diabetes;
            var tatuagem = $scope.data.tatuagem;
            var tfsangue = $scope.data.tfsangue;
            var aids = $scope.data.aids;
            var tiposanguinio = $scope.data.tipoSanguinio;
                
            var userDados = $rootScope.donor._id+"@"+telefone+"@"+celular+"@"+$scope.lat+"@"+$scope.lng+"@"+aniversario+"@"+peso+"@"+sexo+"@"+hepatite+"@"+chagas+"@"+malaria+"@"+epilepsia+"@"+sifilis+"@"+diabetes+"@"+tatuagem+"@"+tfsangue+"@"+aids+"@"+tiposanguinio+"@"+endereco;

              $http.put('http://localhost:3000/donor/api/updatecadastro/'+userDados)
                    .success(function(data, status, headers, config) {
                        // authentication OK
                      alert("Cadastro Finalizado!");
                      var userJsonLogin = {
                            'email': $rootScope.donor.email,
                            'password': $rootScope.donor.password,
                          };

                          $http.post('http://localhost:3000/donor/login', userJsonLogin)
                            .success(function(response){
                               $rootScope.donor = response.donor;
                               alert(JSON.stringify($rootScope.donor));
                               $state.go('app.cadastrousercontinuacao');
                            })
                            .error(function(data, status, headers, config){
                               alert("erro!");

                            });
                       $state.go('app.home');
                    })
                    .error(function(data, status, headers, config) {
                        // Error: authentication failed
                        alert(data);
                    });
      } 
    }
])
.controller('EditarDadosCtrl', ['$scope', '$stateParams', '$http', '$state', '$rootScope',
    function($scope, $stateParams, $http, $state, $rootScope) {
      $scope.data = {};

        var userData = JSON.stringify($rootScope.donor);

        alert(userData);

        //carregar dados do usuario no formulario!
           $scope.options = ['Sim', 'Não'];
           $scope.aids = ['Sim', 'Não', 'Não sei'];
           $scope.sex = ['M', 'F'];
           $scope.bloodType = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'];


          $scope.data.nome = $rootScope.donor.name;
          $scope.data.telefone = $rootScope.donor.phoneFix;
          $scope.data.celular = $rootScope.donor.phoneMobile;
          $scope.data.endereco = $rootScope.donor.adress;
           if (angular.isDefined($rootScope.donor.birthDate)){
               aniversarioConvertido = $rootScope.donor.birthDate.substring(0,10);
                var year = aniversarioConvertido.slice(0,4);
                var month = aniversarioConvertido.slice(5,7);
                var day = aniversarioConvertido.slice(8,10);
                //alert(year+"-"+month+"-"+day);
                $scope.data.aniversario = year+"-"+month+"-"+day;
           }
         
          $scope.data.peso = $rootScope.donor.weight;
          $scope.data.sexo = $rootScope.donor.gender;
          $scope.data.hepatite = $rootScope.donor.hadHepatite;
          $scope.data.chagas = $rootScope.donor.contactWChagas;
          $scope.data.malaria = $rootScope.donor.hadMalaria;
          $scope.data.epilepsia = $rootScope.donor.hasEpilepsia;
          $scope.data.sifilis = $rootScope.donor.hasSiflis;
          $scope.data.diabetes = $rootScope.donor.hasDiabetes;
          $scope.data.tatuagem = $rootScope.donor.hasRecentTattos;
          $scope.data.tfsangue = $rootScope.donor.hasRecentTransfusion;
          $scope.data.aids = $rootScope.donor.hasAIDS;
          $scope.data.tipoSanguinio = $rootScope.donor.bloodType;


        //================================================

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

      $scope.editarUser = function(){
            var nome = $scope.data.nome;
            var senha = $scope.data.password;
            var confirmSenha = $scope.data.confirmarPassword;
            var telefone = $scope.data.telefone;
            var celular = $scope.data.celular;
            var endereco = $scope.data.endereco;
            var aniversario = $scope.data.aniversario;
            var peso = $scope.data.peso;
            var sexo = $scope.data.sexo;
            var hepatite = $scope.data.hepatite;
            var chagas = $scope.data.chagas;
            var malaria = $scope.data.malaria;
            var epilepsia = $scope.data.epilepsia;
            var sifilis = $scope.data.sifilis;
            var diabetes = $scope.data.diabetes;
            var tatuagem = $scope.data.tatuagem;
            var tfsangue = $scope.data.tfsangue;
            var aids = $scope.data.aids;
            var tiposanguinio = $scope.data.tipoSanguinio;

            var userDados = $rootScope.donor._id+"@"+nome+"@"+senha+"@"+telefone+"@"+celular+"@"+$scope.lat+"@"+$scope.lng+"@"+aniversario+"@"+peso+"@"+sexo+"@"+hepatite+"@"+chagas+"@"+malaria+"@"+epilepsia+"@"+sifilis+"@"+diabetes+"@"+tatuagem+"@"+tfsangue+"@"+aids+"@"+tiposanguinio+"@"+endereco;
               

                $http.put('http://localhost:3000/donor/api/update/'+userDados)
                    .success(function(data, status, headers, config) {
                        // authentication OK
                        alert("Dados atualizados!");

                        if(senha == "undefined"){
                          password = $rootScope.donor.senha;
                        }else{
                          password = senha;
                        }
                         var userJsonLogin = {
                            'email': $rootScope.donor.email,
                            'senha': password
                          };

                          $http.post('http://localhost:3000/donor/login', userJsonLogin)
                            .success(function(response){
                               $rootScope.donor = response.donor;
                               $rootScope.donor.senha = password;
                               alert(JSON.stringify($rootScope.donor));
                            })
                            .error(function(data, status, headers, config){
                               alert("erro!");

                            });

                        $state.go('app.home');
                    })
                    .error(function(data, status, headers, config) {
                        // Error: authentication failed
                        alert(data);
                    });
      }

      $scope.cancelEditarUser = function(){
        $state.go('app.home');
      }
    }
]);
