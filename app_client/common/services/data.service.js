(function () {
	angular
		.module('beachLocator')
		.service('beachData', beachData);

	beachData.$inject = ['$http', 'authentication'];
	function beachData($http, authentication) {
		var locationByCoords = function (lat, lng) {
			return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20000000');
		};
		var locationById = function (locationid) {
			return $http.get('/api/locations/' + locationid);
		};
		var addReviewById = function (locationid, data) {
			return $http.post('/api/locations/' + locationid + '/reviews', data, {
				headers: {
					Authorization: 'Bearer ' + authentication.getToken()
				}
			});
		};
		var addLocation = function(data){
			return $http.post('/api/locations', data, {
				header: {
					Authorization: 'Bearer ' + authentication.getToken()
				}
			});
		};
		return {
			locationByCoords: locationByCoords,
			locationById: locationById,
			addReviewById: addReviewById,
			addLocation: addLocation
		};
	};

})();