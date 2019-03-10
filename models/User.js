const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
	alias: { type: String, index: { unique: true, dropDups: true } },
	email: { type: String, index: { unique: true, sparse: true, dropDups: true } },
	name: { type: String, default: '' },
	enabled: { type: Boolean, default: false },
	pwd: {
		hash: { type: String, default: '' },
		salt: { type: String, default: '' },
		iterations: { type: Number, default: 10000 },
	},
	ieee: { type: Number, index: { unique: true, dropDups: true } },
	services: [{
		id: { type: Schema.Types.ObjectId, require: true },
		scope: [{ type: String }],
	}],
	roles: [{ type: String }],
});

module.exports = mongoose.model('User', User);
