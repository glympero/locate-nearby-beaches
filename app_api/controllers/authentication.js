var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var sendJSONresponse = function (res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.register = function (req, res) {
	//Respond with an error status if not all required fields are found
	if (!req.body.name || !req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}
	//Create a new user instance and set name and email
	var user = new User();
	user.name = req.body.name;
	user.email = req.body.email;
	//Use setPassword method to set salt and hash
	user.setPassword(req.body.password);
	//Save new user to MongoDB
	user.save(function (err) {
		var token;
		if (err) {
			sendJSONresponse(res, 404, err);
		} else {
			//Generate a JWT using schema method and send it to browser
			token = user.generateJwt();
			sendJSONresponse(res, 200, {
				"token": token
			});
		}
	});
};

module.exports.login = function (req, res) {
	//Validate that required fields have been supplied
	if (!req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}
	//Pass name of strategy and a callback to authenticate method
	passport.authenticate('local', function (err, user, info) {
		var token;
		//Return an error if method Passport returns an error
		if (err) {
			sendJSONresponse(res, 404, err);
			return;
		}
		//If Passport returned a user instance, generate and send a JWT
		if (user) {
			token = user.generateJwt();
			sendJSONresponse(res, 200, {
				"token": token
			});
		//Otherwise return info message (why authentication failed)
		} else {
			sendJSONresponse(res, 401, info);
		}
	//Make sure that req and res are available to Passport
	})(req, res);
};