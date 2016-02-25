var mongoose = require( 'mongoose' );


var reviewSchema = new mongoose.Schema({
	author: String,
	rating: {type: Number, required: true, min: 0, max: 5},
	reviewText: String,
	createdOn: {type: Date, "default": Date.now}
});

var openingTimeSchema = new mongoose.Schema({
	days: {type: String, required: true},
	opening: String,
	closing: String,
	closed: {type: Boolean, required: true}
});

var locationSchema = new mongoose.Schema({
	name: {type: String, required: true},
	address: String,
	rating: {type: Number, "default": 0, min: 0, max: 5},
	facilities: [String],
	coords: {type: [Number], index: '2dsphere', required: true},
	openingTimes: [openingTimeSchema],
	reviews: [reviewSchema]
});

mongoose.model('Location', locationSchema);

//heroku config:set MONGOLAB_URI=mongodb://glympero:groth3263@ds055855.mongolab.com:55855/locate
//mongodb://glympero:groth3263@ds055855.mongolab.com:55855/locate


//mongodump -h localhost:27017 -d locate -o ~/tmp/mongodump

//mongorestore -h ds055855.mongolab.com:55855 -d locate -u glympero -p groth3263 ~/tmp/mongodump/locate

//mongo ds055855.mongolab.com:55855/locate -u glympero -p groth3263
