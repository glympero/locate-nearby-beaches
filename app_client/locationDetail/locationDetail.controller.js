(function () {
	angular
		.module('beachLocator')
		.controller('locationDetailCtrl', locationDetailCtrl);
	locationDetailCtrl.$inject = ['$routeParams', 'beachData'];
	function locationDetailCtrl($routeParams, beachData) {
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
	}
})();