(function () {
	angular
		.module('beachLocator')
		.controller('navigationCtrl', navigationCtrl);
	navigationCtrl.$inject = ['$location', 'authentication'];
	function navigationCtrl($location, authentication) {
		var vm = this;
		vm.currentPath = $location.path();
		//Find out whether visitor is logged in
		vm.isLoggedIn = authentication.isLoggedIn();
		//Get current user’s name
		vm.currentUser = authentication.currentUser();
		//Create a logout function; redirect to homepage when complete
		vm.logout = function () {
			authentication.logout();
			$location.path('/');
			
		};
	}
})();