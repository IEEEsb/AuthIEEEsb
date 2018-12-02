const mongoose = require('mongoose');

const { randomStringClou } = require('../common/utils.js');

const { Schema } = mongoose;

const Token = new Schema({
	code: { type: String, index: { unique: true, dropDups: true }, default: randomStringClou(12) },
	token: { type: String, index: { unique: true, dropDups: true }, default: randomStringClou(12) },
	user: { type: String, required: true },
	service: { type: String, required: true },
	used: { type: Boolean, default: false },
});

module.exports = mongoose.model('Token', Token);