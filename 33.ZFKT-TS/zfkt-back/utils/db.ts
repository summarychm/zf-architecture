let mongoose = require("mongoose");

let { url } = require("../config/settings");
let dbConn = mongoose.createConnection(url);

let UserSchema = new mongoose.Schema({
	username: String,
	password: String, 
	email: String,
	avatar: String,
	phone: String,
});

module.exports = {
	User: dbConn.model("User", UserSchema),
};
