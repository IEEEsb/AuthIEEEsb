const mongoose = require('mongoose');

const User = require('../models/User');
const Token = require('../models/Token');
const Service = require('../models/Service');
// eslint-disable-next-line import/no-unresolved
const {
	InvalidPermissionsError, InvalidServiceError, InvalidTokenError, InvalidCodeError,
} = require('../common/errors');


module.exports.addService = (req, res, next) => (
	Service.create({
		name: req.body.name,
		scope: req.body.scope ? req.body.scope : ['name'],
		owner: req.session.userId,
	}).then((service) => {
		if (!service) throw new InternalError();

		return res.sendStatus(204);
	}).catch(e => next(e))
);

module.exports.grantPermission = (req, res, next) => {
	let session;
	let token;

	return Service.findOne({ _id: req.params.serviceId, scope: { $all: req.body.scope } }).then((service) => {
		if (!service) throw new InvalidServiceError();

		return mongoose.startSession();
	}).then((_session) => {
		session = _session;
		session.startTransaction();

		return User.updateOne({ _id: req.session.userId }, { $pull: { services: { 'services.id': req.params.serviceId } } });
	}).then(() => (
		User.updateOne({ _id: req.session.userId }, {
			$push: {
				services: {
					id: req.params.serviceId,
					scope: req.body.scope,
				},
			},
		})
	)).then((result) => {
		if (result.nModified === 0) {
			session.abortTransaction();
			throw new InternalError();
		}

		return Token.create({
			user: req.session.userId,
			service: req.params.serviceId,
		});
	}).then((_token) => {
		if (!_token) {
			session.abortTransaction();
			throw new InternalError();
		}

		token = _token;
		return session.commitTransaction();
	}).then(() => (
		res.status(200).json({
			code: token.code,
		})
	)).catch(e => next(e));
};

module.exports.requestToken = (req, res, next) => {
	let token;
	return Service.findOne({ _id: req.body.service, secret: req.body.secret }).then((service) => {
		if (!service) throw new InvalidServiceError();

		return Token.findOneAndUpdate({ code: req.body.code, used: false }, { $set: { used: true } });
	}).then((_token) => {
		if (!_token) throw new InvalidCodeError();
		token = _token;

		return Token.deleteMany({ service: req.body.service, user: token.user, token: { $ne: token.token } });
	}).then(() => (
		res.status(200).json({ token: token.token })
	)).catch(e => next(e));
};

module.exports.getUser = (req, res, next) => (
	User.findOne({ _id: req.userId }, `-_id ${req.scope.join(' ')}`).then((user) => {
		if (!user) throw new InvalidPermissionsError();

		return res.status(200).json(user);
	}).catch(e => next(e))
);

module.exports.tokenRequired = (req, res, next) => (
	Token.findOne({ token: req.query.token }).then((token) => {
		if (!token) throw new InvalidTokenError();

		req.serviceId = token.service;
		req.userId = token.user;

		return User.findOne({ _id: token.user, 'services.id': token.service }, { 'services.$': 1 });
	}).then((user) => {
		if (!user) throw new InvalidPermissionsError();
		req.scope = user.services[0].scope;
		return next();
	}).catch(e => next(e))
);