const { isCelebrate } = require('celebrate');

class CustomError extends Error {
	constructor(message, code, httpStatus) {
		super(message);
		this.errObject = { message, code };
		this.httpStatus = httpStatus;
	}
}

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