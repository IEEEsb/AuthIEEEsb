const mongoose = require('mongoose');

const { randomStringClou } = require('../common/utils.js');

const { Schema } = mongoose;

const Service = new Schema({
	_id: { type: Schema.Types.ObjectId, required: true, default: randomStringClou(12) },
	name: { type: String, required: true, unique: true },
	scope: [{ type: String }],
	secret: { type: String, index: { unique: true, dropDups: true }, default: randomStringClou(12) },
	owner: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('Service', Service);