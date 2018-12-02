const { isCelebrate } = require('celebrate');

class CustomError extends Error {
	constructor(message, code, httpStatus) {
		super(message);
		this.errObject = { message, code };
		this.httpStatus = httpStatus;
	}
}

module.exports.AdminRequiredError = class AdminRequiredError extends CustomError {
	constructor() {
		super('You must be an admin to do that', 'admin_required', 403);
	}
};

module.exports.AuthenticationRequiredError = class AuthenticationRequiredError extends CustomError {
	constructor() {
		super('You must be logged in to do that', 'authentication_required', 401);
	}
};

module.exports.CredentialsError = class CredentialsError extends CustomError {
	constructor() {
		super('Invalid user/password combination', 'wrong_user_pass', 400);
	}
};

module.exports.DuplicateObjectError = class DuplicateObjectError extends CustomError {
	constructor(objectType) {
		super(`A(n) "${objectType}" object with that name already exists`, 'duplicate_object', 400);
	}
};

module.exports.InvalidCandidateError = class InvalidCandidateError extends CustomError {
	constructor(pollName) {
		super(`Your choice for the poll "${pollName}" is not a valid candidate`, 'invalid_candidate', 400);
	}
};

module.exports.InvalidServiceError = class InvalidServiceError extends CustomError {
	constructor() {
		super('Invalid service. Please provide a valid one', 'invalid_service', 401);
	}
};

module.exports.InvalidCodeError = class InvalidCodeError extends CustomError {
	constructor() {
		super('Invalid code. Please provide a valid one', 'invalid_code', 401);
	}
};

module.exports.InvalidSessionError = class InvalidSessionError extends CustomError {
	constructor() {
		super('Invalid session. Please log in again', 'invalid_session', 401);
	}
};

module.exports.InvalidTokenError = class InvalidTokenError extends CustomError {
	constructor() {
		super('Invalid token. Please provide a valid one', 'invalid_token', 401);
	}
};

module.exports.InvalidPermissionsError = class InvalidPermissionsError extends CustomError {
	constructor() {
		super('You don\'t have the required permissions to access to this user', 'invalid_permissions', 401);
	}
};

module.exports.MissingRolesError = class MissingRolesError extends CustomError {
	constructor() {
		super('You don\'t have the required roles', 'missing_roles', 403);
	}
};

module.exports.NotInCensusError = class NotInCensusError extends CustomError {
	constructor() {
		super('You are not allowed to vote in this election. Maybe you already did?', 'not_in_census', 403);
	}
};

module.exports.PollsClosedError = class PollsClosedError extends CustomError {
	constructor(openingDate, closingDate) {
		super('The polls are closed. Their opening window is set from '
		+ `${openingDate.toISOString()} to ${closingDate.toISOString()}`,
		'polls_closed', 400);
	}
};

module.exports.PollsNotClosedError = class PollsNotClosedError extends CustomError {
	constructor(closingDate) {
		super(`The polls are still open, you must wait until they close (${closingDate.toISOString()})`, 'polls_still_open', 400);
	}
};

module.exports.UnknownObjectError = class UnknownObjectError extends CustomError {
	constructor(objectType) {
		super(`There are no "${objectType}" objects with such name`, 'unknown_object', 404);
	}
};

module.exports.WrongPropertiesError = class WrongPropertiesError extends CustomError {
	constructor() {
		super('None of the provided parameters are compatible with this model', 'no_valid_model_properties', 400);
	}
};

// eslint-disable-next-line no-unused-vars
module.exports.globalErrorHandler = (err, req, res, next) => {
	// This is a controlled error, it has been thrown by demokratia's own
	// code and we expected it might happen
	if (err instanceof CustomError) {
		return res.status(err.httpStatus).json(err.errObject);
	}
	// The exception for parameter validation problems is already provided
	// by celebrate, using that one to put the violations in the error object
	// as well
	if (isCelebrate(err)) {
		return res.status(400).json({
			message: 'Invalid parameters',
			code: 'invalid_parameters',
			violations: err.details,
		});
	}

	if (err.name === 'MongoError') {
		if (err.code === 11000) {
			let key = /.*index:\s(.*)_1/.exec(err.errmsg)[1];
			return res.status(400).json({
				message: 'Duplicate key error',
				code: 'duplicate_key',
				key
			});
		}
	}

	// Errors produced by Express's body-parser, that are thrown whenever the
	// body cannot be parsed because it isn't valid JSON
	if (err.type === 'entity.parse.failed') {
		return res.status(400).json({
			message: 'Invalid JSON object in the request\'s body',
			code: 'invalid_json_body',
		});
	}
	// Unknown error, something we haven't handled (and a potential bug).
	// Throw an internal server error and display it in the logs
	console.error(err); // eslint-disable-line no-console
	return res.status(500).json({
		message: 'Internal server error',
		code: 'internal_server_error',
	});
};