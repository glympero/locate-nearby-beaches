(function () {
angular
	.module('beachLocator')
	.service('geoloc', geoloc);

function geoloc() {
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
}
})();