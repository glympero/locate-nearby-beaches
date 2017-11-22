(function () {
	angular
		.module('beachLocator')
		.controller('navigationCtrl', navigationCtrl);
	navigationCtrl.$inject = ['$location', '$uibModal', 'authentication'];
	function navigationCtrl($location, $uibModal, authentication) {
		var vm = this;
		vm.currentPath = $location.path();
		//Find out whether visitor is logged in
		vm.isLoggedIn = authentication.isLoggedIn();
		//Get current user’s name
		vm.currentUser = authentication.currentUser();
		//Create a logout function; redirect to homepage when complete
		vm.isAdmin = authentication.isAdmin();
		vm.logout = function () {
			authentication.logout();
			$location.path('/');
			
		};
		
		vm.popupBeachForm = function () {
			var modalInstance = $uibModal.open({
				templateUrl: '/beachModal/beachModal.view.html',
				controller: 'beachModalCtrl',
				controllerAs: 'vm'
			});
			console.log(modalInstance);
			//When modal promise is resolved...
			modalInstance.result.then(function () {
				//Push returned data into array of reviews; Angular binding will do the rest
				alert("Success");
			});
		};
	}
})();