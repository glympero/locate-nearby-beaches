var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var userSchema = new mongoose.Schema({
	//Email should be required and unique
	email: {
		type: String,
		unique: true,
		required: true
	},
	//Name is also required, but not necessarily unique
	name: {
		type: String,
		required: true
	},
	//Hash and salt are both just strings
	hash: String,
	salt: String
});

userSchema.methods.setPassword = function (password) {
	//Create a random string for salt
	this.salt = crypto.randomBytes(16).toString('hex');
	//Create encrypted hash
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function (password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
	var expiry = new Date();
	//Create expiry date object and set for seven days
	expiry.setDate(expiry.getDate() + 7);
	//Call jwt.sign method and return what it returns
	return jwt.sign({
		//Pass payload to method
		_id: this._id,
		email: this.email,
		name: this.name,
		//Including exp as Unix hashing time in seconds
		exp: parseInt(expiry.getTime() / 1000),
		//Send secret for hashing algorithm to use
	}, process.env.JWT_SECRET);
};

mongoose.model('User', userSchema);