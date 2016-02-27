var request = require('request');
var apiOptions = {
	//Set default server URL for local development
	server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	//If application running in production mode set different base URL
	apiOptions.server = "https://thawing-anchorage-72783.herokuapp.com/";
}

var renderHomepage = function(req, res, responseBody){
//	//Define a variable to hold a message
//	var message;
//	//If response isn’t array, set message, and set responseBody to be empty array
//	if (!(responseBody instanceof Array)) {
//		message = "API lookup error";
//		responseBody = [];
//	} else {
//		//If response is array with no length, set message
//		if (!responseBody.length) {
//			message = "No places found nearby";
//		}
//	}
	res.render('locations-list', {
		title: 'Loc8r - find a place to work with wifi',
		pageHeader: {
			title: 'Beach Locator',
			strapline: 'Find places to work with wifi near you!'
		},
		sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for."
//		locations: responseBody,
//		message: message
	});
};


/* GET 'home' page */
module.exports.homelist = function(req, res){
//	var requestOptions, path;
//	path = '/api/locations';
//	//Set request options, including URL, method, empty JSON body, and hard-coded query string parameters
//	requestOptions = {
//    url : apiOptions.server + path,
//    method : "GET",
//    json : {},
//    qs : {
//      lng : -0.9690884,
//      lat : 51.455040,
//      maxDistance : 1000
//    }
//  };
//	//Make request, sending through request options
//	request(
//		requestOptions,
//		function(err, response, body) {
//			var i, data;
//			//Assign returned body data to a new variable
//			data = body;
//			if (response.statusCode === 200 && data.length) {
//				for (i=0; i<data.length; i++) {
//					//Loop through array, formatting distance value of location
//					data[i].distance = _formatDistance(data[i].distance);
//				}
//			}
//			//Call new renderHomepage function from homelist controller
//			renderHomepage(req, res, data);
//		}	
//	);
	renderHomepage(req, res);
};


var renderDetailPage = function (req, res, locDetail) {//Add locDetail parameter for data in function definition
	res.render('location-info', { 
		title: locDetail.name,
		pageHeader: {title: locDetail.name},
		sidebar: {
			context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
			callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
		},
		location: locDetail
	});
};


/* GET 'Location info' page */
module.exports.locationInfo = function(req, res){
	getLocationInfo(req, res, function(req, res, responseData) {
		renderDetailPage(req, res, responseData);
	});
};

//locDetail is the third parameter from getLocationInfo(callback)
var renderReviewForm = function (req, res, locDetail) {
	res.render('location-review-form', {
		title: 'Review ' + locDetail.name + ' on Beach Locators',
		pageHeader: { title: 'Review ' + locDetail.name },
		error: req.query.err,
		url: req.originalUrl
	});
};
/* GET 'Add review' page */
module.exports.addReview = function(req, res){
	//Also call getLocationInfo from addReview controller, but this time pass renderReviewForm in callback
	getLocationInfo(req, res, function(req, res, responseData) {
		renderReviewForm(req, res, responseData);
	});
};

module.exports.doAddReview = function(req, res){
	var requestOptions, path, locationid, postdata;
		//Get location ID from URL to construct API URL
		locationid = req.params.locationid;
		path = "/api/locations/" + locationid + '/reviews';
		//Create data object to send to API using submitted form data
		postdata = {
			author: req.body.name,
			rating: parseInt(req.body.rating, 10),
			reviewText: req.body.review
		};
		//Set request options, including path, setting POST method and passing submitted form data into json parameter
		requestOptions = {
			url : apiOptions.server + path,
			method : "POST",
			json : postdata
		};
		//If any of three required data fields are falsey, then redirect to Add Review page, appending query string used to display error message
		if (!postdata.author || !postdata.rating || !postdata.reviewText) {
			res.redirect('/location/' + locationid + '/reviews/new?err=val');
		} else {
			//Make the request
			request(requestOptions,function(err, response, body) {
			//Redirect to Details page if review was added successfully or show an error page if API returned an error
			if (response.statusCode === 201) {
				res.redirect('/location/' + locationid);
			} else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
				res.redirect('/location/' + locationid + '/reviews/new?err=val');
			} else {
				_showError(req, res, response.statusCode);
			}
		});
	}
};


//getLocationInfo accepts callback as thirdparameter 
var getLocationInfo = function (req, res, callback) {
	var requestOptions, path;
	path = "/api/locations/" + req.params.locationid;
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};
	request(requestOptions,function(err, response, body) {
		var data = body;
		if (response.statusCode === 200) {
			data.coords = {
			lng : body.coords[0],
			lat : body.coords[1]
			};
			//Following successful API response, invoke callback ninstead of named function
			callback(req, res, data);
		} else {
			_showError(req, res, response.statusCode);
		}
	});
};

var _formatDistance = function (distance) {
	if (!distance){
	
	}else {
		var numDistance, unit;
		if (distance > 1) {
			numDistance = parseFloat(distance).toFixed(1);
			unit = 'km';
		} else {
			numDistance = parseInt(distance * 1000,10);
			unit = 'm';
		}
		return numDistance + unit;
	}
};

var _showError = function (req, res, status) {
	var title, content;
	//If status passed through is 404, set title and content for page
	if (status === 404) {
		title = "404, page not found";
		content = "Oh dear. Looks like we can't find this page. Sorry.";
	//Otherwise set a generic catch-all message
	} else {
		title = status + ", something's gone wrong";
		content = "Something, somewhere, has gone just a little bit wrong.";
	}
	//Use status parameter to set response status
	res.status(status);
	//Send data to view to be compiled and sent to browser
	res.render('generic-text', {
		title : title,
		content : content
	});
};