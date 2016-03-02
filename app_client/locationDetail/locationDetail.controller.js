(function () {
	angular
		.module('beachLocator')
		.controller('locationDetailCtrl', locationDetailCtrl);

	locationDetailCtrl.$inject = ['$routeParams', '$uibModal', 'beachData'];
	function locationDetailCtrl($routeParams, $uibModal, beachData) {
		var vm = this;
		vm.locationid = $routeParams.locationid;

		beachData.locationById(vm.locationid)
			.success(function (data) {
			vm.data = { location: data };
			vm.pageHeader = {
				title: vm.data.location.name
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
				resolve : {
		          locationData : function () {
		            return {
		              locationid : vm.locationid,
		              locationName : vm.data.location.name
		            };
		          }
		        }
			});
		};
		
		
	}


})();