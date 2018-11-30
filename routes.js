const express = require('express');
const authController = require('./controllers/authController');

const {
	validators, validate,
} = require('./controllers/validators');

const userRouter = express.Router();

userRouter.post('/api/register', validate(validators.register), authController.register);
userRouter.post('/api/login', validate(validators.login), authController.login);

// Endpoints that require authentication
userRouter.use(authController.authRequired);

userRouter.post('/api/logout', authController.logout);

const router = express.Router();

router.use(userRouter);

module.exports = router;