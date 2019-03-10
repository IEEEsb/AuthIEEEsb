const crypto = require('crypto');

const { randomString } = require('../common/utils.js');

const User = require('../models/User');
const Token = require('../models/Token');
// eslint-disable-next-line import/no-unresolved
const { pwdIterations } = require('../config.json');
const {
	AuthenticationRequiredError, CredentialsError, InvalidSessionError, InvalidPermissionsError, WrongPropertiesError, UnknownObjectError,
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

module.exports.register = async (req, res, next) => {
	try {
		const saltedPassword = await generateSaltedPassword(req.body.password, pwdIterations);
		await User.create({
			alias: req.body.alias,
			email: req.body.email,
			name: req.body.name,
			pwd: saltedPassword,
			ieee: req.body.ieee,
		});

		return res.sendStatus(204);
	} catch (e) {
		return next(e);
	}
};

module.exports.login = async (req, res, next) => {
	try {
		if (req.session.userId) {
			const user = await User.findOne({ _id: req.session.userId });
			return res.send(200).json({ user });
		}

		const user = await User.findOne({ alias: req.body.alias, enabled: true });
		// Check that the specified user exists in the DB
		if (!user) throw new CredentialsError();

		// Validate the password provided against the one stored for this
		// user, using their specific salt
		const isValid = await validateSaltedPassword(req.body.password, user.pwd.salt, user.pwd.hash, user.pwd.iterations);
		if (!isValid) throw new CredentialsError();

		// Successful login. Set the session up and send the minimal set of
		// user information required by the application
		req.session.userId = user._id;
		return res.status(200).json({
			user: {
				name: user.name,
				alias: user.alias,
				email: user.email,
				ieee: user.ieee,
				services: user.services,
			},
		});
	} catch (e) {
		return next(e);
	}
};

module.exports.logout = async (req, res, next) => {
	try {
		await Token.deleteMany({ token: { $in: req.session.tokens } });
		return req.session.destroy((e) => {
			if (e) throw e;
			return res.sendStatus(204);
		});
	} catch (e) {
		return next(e);
	}
};

module.exports.addRole = async (req, res, next) => {
	try {
		const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { roles: req.body.role } }, { new: true, fields: '_id name alias email ieee services enabled roles' });
		if (!user) throw new UnknownObjectError('User');

		return res.status(200).send({ user });
	} catch (e) {
		return next(e);
	}
};

module.exports.updateUser = async (req, res, next) => {
	try {
		const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { fields: '_id name alias email ieee services enabled roles', new: true });
		// Check if any User were updated after the operation
		if (!user) throw new UnknownObjectError('User');

		// The backend doesn't complain if the User existed but it
		// didn't suffer any modifications at all, it just accepts the
		// request and leaves the object unmutated

		return res.status(200).json({ user });
	} catch (e) {
		return next(e);
	}
};

module.exports.enableUser = async (req, res, next) => {
	try {
		const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $set: { enabled: true } }, { fields: 'name alias email ieee services enabled roles', new: true });
		// Check if any User were updated after the operation
		if (!user) throw new UnknownObjectError('User');

		// The backend doesn't complain if the User existed but it
		// didn't suffer any modifications at all, it just accepts the
		// request and leaves the object unmutated

		return res.status(200).json({ user });
	} catch (e) {
		return next(e);
	}
};

module.exports.getUser = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.params.userId }, '_id name alias email ieee services enabled roles');
		if (user === null) throw new AuthenticationRequiredError();

		return res.status(200).json({ user });
	} catch (e) {
		return next(e);
	}
};

module.exports.getUserWithScope = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.userId }, `_id ${req.scope.join(' ')}`);
		if (!user) throw new InvalidPermissionsError();

		return res.status(200).json(user);
	} catch (e) {
		return next(e);
	}
};

module.exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find({ }, '_id name alias email ieee services enabled roles');

		return res.status(200).json({ users });
	} catch (e) {
		return next(e);
	}
};

module.exports.authRequired = (req, res, next) => {
	if (!req.session.userId) return next(new AuthenticationRequiredError());

	return next();
};

module.exports.adminRequired = async (req, res, next) => {
	try {
		const user = await User.findById(req.session.userId);
		if (user === null) throw new InvalidSessionError();
		// if (!user.roles.includes(adminRole)) throw new AdminRequiredError();

		return next();
	} catch (e) {
		return next(e);
	}
};
