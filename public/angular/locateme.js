angular.module('beachLocator', []);

var _isNumeric = function (n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

var formatDistance = function () {
	return function (distance) {
		var numDistance, unit;
		if (distance && _isNumeric(distance)) {
			if (distance > 1) {
				numDistance = parseFloat(distance).toFixed(1);
				unit = 'km';
			} else {
				numDistance = parseInt(distance * 1000,10);
				unit = 'm';
			}
			return numDistance + unit;
		} else {
			return "?";
		}
	};
};

var ratingStars = function () {
	return {
		scope: {
			thisRating : '=rating'
		},
			templateUrl: '/angular/rating-stars.html'
	};
};

var beachLocatorData = function ($http) {
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

var geolocation = function () {
	var getPosition = function (cbSuccess, cbError, cbNoGeo) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
		}
		else {
			cbNoGeo();
		}
	};
	return {
		getPosition : getPosition
	};
};

var locationListCtrl = function ($scope, beachLocatorData, geolocation) {
	$scope.message = "Checking your location";
	
	$scope.getData = function (position) {
		var lat = position.coords.latitude,
			lng = position.coords.longitude;
			console.log(position.coords.latitude);
			console.log(position.coords.longitude);
		$scope.message = "Searching for nearby places";
		beachLocatorData.locationByCoords(lat, lng)
			.success(function(data) {
				$scope.message = data.length > 0 ? "" : "No locations found";
				$scope.data = { locations: data };
			})
			.error(function (e) {
				$scope.message = "Sorry, something's gone wrong";
			});
		};
		$scope.showError = function (error) {
			$scope.$apply(function() {
				$scope.message = error.message;
			});
		};
		$scope.noGeo = function () {
			$scope.$apply(function() {
				$scope.message = "Geolocation not supported by this browser.";
		});
	};
	geolocation.getPosition($scope.getData,$scope.showError,$scope.noGeo);
};

angular
	.module('beachLocator')
	.controller('locationListCtrl', locationListCtrl)
	.filter('formatDistance', formatDistance)
	.directive('ratingStars', ratingStars)
	.service('beachLocatorData', beachLocatorData)
	.service('geolocation', geolocation);
	
	
	
//db.locations.save({
//name: 'Gefyra',
//address: '125 High Street, Reading, RG6 1PS',
//rating: 3,
//facilities: ['Hot drinks', 'Food', 'Premium wifi'],
//coords: [20.97024, 39.148079],
//openingTimes: [{
//days: 'Monday - Friday',
//opening: '7:00am',
//closing: '7:00pm',
//closed: false
//}, {
//days: 'Saturday',
//opening: '8:00am',
//closing: '5:00pm',
//closed: false
//}, {
//days: 'Sunday',
//closed: true
//}]
//})
