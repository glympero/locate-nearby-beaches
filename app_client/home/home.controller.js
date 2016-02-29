(function () {
angular
    .module('beachLocator')
    .controller('homeCtrl', homeCtrl);
homeCtrl.$inject = ['$scope', 'beachData', 'geoloc'];
function homeCtrl ($scope, beachData, geoloc) {
	var vm = this;
	vm.pageHeader = {
		title: 'Beach Locator',
		strapline: 'Find beaches near you!'
	};
	vm.sidebar = {
		content: "Looking for beaches and sun "
	};
	vm.message = "Checking your location";
	vm.getData = function (position) {
		var lat = position.coords.latitude,
		lng = position.coords.longitude;
		vm.message = "Searching for nearby places";
		beachData.locationByCoords(lat, lng)
			.success(function(data) {
				vm.message = data.length > 0 ? "" : "No locations found nearby";
				vm.data = { locations: data };
		})
			.error(function (e) {
				vm.message = "Sorry, something's gone wrong";
			});
		};
		vm.showError = function (error) {
			$scope.$apply(function() {
				vm.message = error.message;
			});
		};
		vm.noGeo = function () {
			$scope.$apply(function() {
				vm.message = "Geolocation is not supported by this browser.";
		});
	};
	geoloc.getPosition(vm.getData,vm.showError,vm.noGeo);
}
})();
