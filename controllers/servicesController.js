const mongoose = require('mongoose');

const User = require('../models/User');
const Token = require('../models/Token');
const Service = require('../models/Service');
// eslint-disable-next-line import/no-unresolved
const {
	InvalidPermissionsError, InvalidServiceError, InvalidSecretError, InvalidTokenError, UnknownObjectError, InternalError,
} = require('../common/errors');


module.exports.addService = async (req, res, next) => {
	try {
		const service = await Service.create({
			name: req.body.name,
			scope: req.body.scope ? req.body.scope : [],
			owner: req.session.userId,
		});
		if (!service) throw new InternalError();

		return res.status(200).send(service);
	} catch (e) {
		return next(e);
	}
};

module.exports.updateService = async (req, res, next) => {
	try {
		const service = await Service.findOneAndUpdate({ _id: req.params.serviceId, owner: req.session.userId }, { $set: req.body }, { new: true });
		if (!service) throw new UnknownObjectError('Service');

		return res.sendStatus(204);
	} catch (e) {
		return next(e);
	}
};

module.exports.removeService = async (req, res, next) => {
	try {
		const result = await Service.deleteOne({ _id: req.params.serviceId, owner: req.session.userId });
		if (result.nModified === 0) throw new UnknownObjectError('Service');

		await User.updateMany({ 'services.id': req.params.serviceId }, { $pull: { services: { 'services.id': req.params.serviceId } } });
		return res.sendStatus(204);
	} catch (e) {
		return next(e);
	}
};

module.exports.grantPermission = async (req, res, next) => {
	try {
		const query = {
			_id: req.params.serviceId,
		};
		if (req.body.scope.length > 0) {
			query.scope = { $all: req.body.scope };
		}
		const service = await Service.findOne(query);
		if (!service) throw new InvalidServiceError();

		const session = await mongoose.startSession();
		session.startTransaction();

		await User.updateOne({ _id: req.session.userId }, { $pull: { services: { 'services.id': req.params.serviceId } } }).session(session);
		const result = await User.updateOne({ _id: req.session.userId }, { $push: { services: { id: req.params.serviceId, scope: req.body.scope } } }).session(session);
		if (result.nModified === 0) {
			session.abortTransaction();
			throw new InternalError();
		}

		await session.commitTransaction();

		const token = await Token.create({ user: req.session.userId, service: service._id });

		if (!req.session.tokens) {
			req.session.tokens = [];
		}
		req.session.tokens.push(token.token);

		return res.status(200).json({
			scope: req.body.scope,
			token: token.token,
		});
	} catch (e) {
		return next(e);
	}
};

module.exports.getSelfServices = async (req, res, next) => {
	try {
		const services = await Service.find({ owner: req.session.userId }, '_id name scope secret');
		if (!services) throw new InvalidPermissionsError();

		return res.status(200).json(services);
	} catch (e) {
		return next(e);
	}
};

module.exports.getSelfService = async (req, res, next) => {
	try {
		const service = await Service.findOne({ _id: req.params.serviceId, owner: req.session.userId }, '_id name scope secret');
		if (!service) throw new InvalidPermissionsError();

		return res.status(200).json(service);
	} catch (e) {
		return next(e);
	}
};

module.exports.getService = async (req, res, next) => {
	try {
		const service = await Service.findOne({ _id: req.params.serviceId }, '_id name scope');
		if (!service) throw new InvalidPermissionsError();

		return res.status(200).json(service);
	} catch (e) {
		return next(e);
	}
};

module.exports.getScope = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.userId, 'services.id': req.serviceId }, { 'services.$': 1 });
		if (!user) throw new UnknownObjectError('User');

		return res.status(200).json(user.services[0].scope);
	} catch (e) {
		return next(e);
	}
};

module.exports.secretRequired = async (req, res, next) => {
	try {
		const service = await Service.findOne({ secret: req.query.secret });
		if (!service) throw new InvalidSecretError();

		req.serviceId = service._id;
		return next();
	} catch (e) {
		return next(e);
	}
};

module.exports.tokenRequired = async (req, res, next) => {
	try {
		const token = await Token.findOne({ token: req.query.token, service: req.serviceId });
		if (!token) throw new InvalidTokenError();

		req.userId = token.user;

		const user = await User.findOne({ _id: token.user, 'services.id': req.serviceId }, { 'services.$': 1 });
		if (!user) throw new InvalidPermissionsError();

		req.scope = user.services[0].scope;
		return next();
	} catch (e) {
		return next(e);
	}
};
