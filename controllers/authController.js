const crypto = require('crypto');

const { randomString } = require('../common/utils.js');

const User = require('../models/User');
// eslint-disable-next-line import/no-unresolved
const { pwdIterations } = require('../config.json');
const {
	AuthenticationRequiredError, CredentialsError,
} = require('../common/errors');


function generateSaltedPassword(password, iterations) {
	const salt = randomString(20);
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(password.toLowerCase(), salt, iterations, 256, 'sha256', (err, key) => {
			if (err) return reject(err);
			const hash = key.toString('hex');
			return resolve({ salt, hash, iterations });
		});
	});
}

function validateSaltedPassword(password, salt, hash, iterations) {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(password.toLowerCase(), salt, iterations, 256, 'sha256', (err, key) => {
			if (err) return reject(err);
			const calculatedHash = key.toString('hex');
			return resolve(calculatedHash === hash);
		});
	});
}

module.exports.register = (req, res, next) => (
	generateSaltedPassword(req.body.password, pwdIterations).then(saltedPassword => (
		User.create({
			alias: req.body.alias,
			email: req.body.email,
			name: req.body.name,
			pwd: saltedPassword,
			ieee: req.body.ieee,
		})
	)).then((user) => {
		if (!user) throw new InternalError();

		return res.sendStatus(204);
	}).catch(e => next(e))
);

module.exports.login = (req, res, next) => {
	let user;

	return User.findOne({ alias: req.body.alias }).then((_user) => {
		// Check that the specified user exists in the DB
		if (!_user) throw new CredentialsError();
		user = _user;

		// Validate the password provided against the one stored for this
		// user, using their specific salt
		return validateSaltedPassword(req.body.password, user.pwd.salt, user.pwd.hash, user.pwd.iterations);
	}).then((isValid) => {
		if (!isValid) throw new CredentialsError();
		// Successful login. Set the session up and send the minimal set of
		// user information required by the application
		req.session.userId = user._id;
		return res.status(200).json({
			name: user.name,
			alias: user.alias,
			services: user.services,
		});
	}).catch(e => next(e));
};

module.exports.logout = (req, res) => (
	req.session.destroy((e) => {
		if (e) throw e;
		return res.sendStatus(204);
	})
);

module.exports.authRequired = (req, res, next) => {
	if (!req.session.userId) return next(new AuthenticationRequiredError());

	return next();
};
