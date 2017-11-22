(function () {
//Register new service with application
  angular
    .module('beachLocator')
    .service('authentication', authentication);
  //Inject $window and $http service
  authentication.$inject = ['$http', '$window'];
  function authentication ($http, $window) {
	//Create a saveToken method to save a value to localStorage
    var saveToken = function (token) {
      $window.localStorage['beachLocator-token'] = token;
    };
	//Create a getToken method to read a value from localStorage
    var getToken = function () {
      return $window.localStorage['beachLocator-token'];
    };
	
    var isLoggedIn = function() {
	  //Get token from storage
      var token = getToken();

      if(token){
		//If token exists get payload, decode it, and parse it to JSON
        var payload = JSON.parse($window.atob(token.split('.')[1]));
		
		//Validate whether expiry date has passed
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };
    var isAdmin = function() {
      if(isLoggedIn()){
        var cUser = currentUser();
          if (cUser.email === "glympe77@gmail.com" && cUser.name === "admin"){
            return true;
          }else{
            return false;
          }
        return false;
      }
    };
    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return {
          email : payload.email,
          name : payload.name
        };
      }
    };

    register = function(user) {
      return $http.post('/api/register', user).success(function(data){
        saveToken(data.token);
      });
    };

    login = function(user) {
      return $http.post('/api/login', user).success(function(data) {
        saveToken(data.token);
      });
    };

    logout = function() {
      $window.localStorage.removeItem('beachLocator-token');
      $window.location.reload();
    };
	//Expose methods to application
    return {
      currentUser : currentUser,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      isAdmin : isAdmin,
      register : register,
      login : login,
      logout : logout
    };
  }


})();