const mongoose = require('mongoose');

const { randomStringClou } = require('../common/utils.js');

const { Schema } = mongoose;

const Token = new Schema({
	token: { type: String, index: { unique: true, dropDups: true }, default: randomStringClou(12) },
	user: { type: Schema.Types.ObjectId, required: true },
	service: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('Token', Token);
