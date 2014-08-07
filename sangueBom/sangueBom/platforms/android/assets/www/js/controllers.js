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

.controller('LoginCtrl', function($scope, $state){
    $scope.cadastrar = function(){
      $state.go('app.cadastrouser');
    }
})

.controller('CadastroUserCtrl', ['$scope', '$stateParams', '$http', 
    function($scope, $stateParams, $http) {
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

            
            userJson = serializeData(userJson);

                $http.post('http://localhost:3000/registerdonor', userJson)
                    .success(function(response) {
                        // authentication OK
                       alert("Certo!");
                    })
                    .error(function(error) {
                        // Error: authentication failed
                        alert(error);
                    });
                //$http.post('http://localhost:3000/registerdonor', userJson, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8').success().error();
                //$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8de";
                /*$http({
                      method: 'post',
                      url: 'localhost:3000/registerdonor',
                      params: userJson,
                      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
                  }).success(function(status) {
                          
                          alert("Cadastrado!");
                          
                      }).error(function(status) {
                          
                          alert(status);
                      });*/
                         
                  function serializeData( data ) {
           
                              // If this is not an object, defer to native stringification.
                              if ( ! angular.isObject( data ) ) {
           
                                  return( ( data == null ) ? "" : data.toString() );
           
                              }
           
                              var buffer = [];
           
                              // Serialize each key in the object.
                              for ( var name in data ) {
           
                                  if ( ! data.hasOwnProperty( name ) ) {
           
                                      continue;
           
                                  }
           
                                  var value = data[ name ];
           
                                  buffer.push(
                                      encodeURIComponent( name ) +
                                      "=" +
                                      encodeURIComponent( ( value == null ) ? "" : value )
                                  );
           
                              }
           
                              // Serialize the buffer and clean it up for transportation.
                              var source = buffer
                                  .join( "&" )
                                  .replace( /%20/g, "+" )
                              ;
           
                              return( source );
                  }
 
      } 
    }
]);
