(function () {
angular
    .module('beachLocator')
    .service('beachData', beachData);

function beachData ($http) {
  var locationByCoords = function (lat, lng) {
	 return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20');
	};
	var locationById = function (locationid) {
		return $http.get('/api/locations/' + locationid);
	};
	return {
		locationByCoords : locationByCoords,
		locationById : locationById
	};
};

})();