(function () {
	angular
		.module('beachLocator')
		.controller('locationDetailCtrl', locationDetailCtrl);

	locationDetailCtrl.$inject = ['$routeParams', '$location', '$uibModal', 'beachData', 'authentication'];
	function locationDetailCtrl($routeParams, $location, $uibModal, beachData, authentication) {
		var vm = this;
		vm.locationid = $routeParams.locationid;
		//Create isLoggedIn method to get current visitor state
		vm.isLoggedIn = authentication.isLoggedIn();
		//Get current URL path of visitor
		vm.currentPath = $location.path();
		beachData.locationById(vm.locationid)
			.success(function (data) {
			vm.data = { location: data };
			
			vm.pageHeader = {
				title: vm.data.location.name,
				strapline: vm.data.location.address,
				image: vm.data.location.image
				};
			})
			.error(function (e) {
			console.log(e);
		});

		vm.popupReviewForm = function () {
			var modalInstance = $uibModal.open({
				templateUrl: '/reviewModal/reviewModal.view.html',
				controller: 'reviewModalCtrl',
				controllerAs: 'vm',
				resolve: {
					locationData: function () {
						return {
							locationid: vm.locationid,
							locationName: vm.data.location.name
						};
					}
				}
			});
			//When modal promise is resolved...
			modalInstance.result.then(function (data) {
				//Push returned data into array of reviews; Angular binding will do the rest
				vm.data.location.reviews.push(data);
			});
		};




	}


})();