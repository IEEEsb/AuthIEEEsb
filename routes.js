const express = require('express');
const authController = require('./controllers/authController');
const servicesController = require('./controllers/servicesController');

const {
	validators, validate,
} = require('./controllers/validators');

const userRouter = express.Router();

userRouter.post('/api/register', validate(validators.register), authController.register);
userRouter.post('/api/login', validate(validators.login), authController.login);

// Endpoints that require authentication
userRouter.use(authController.authRequired);

userRouter.post('/api/logout', authController.logout);
userRouter.get('/api/user/self', authController.getUser);

userRouter.post('/api/service', validate(validators.addService), servicesController.addService);
userRouter.post('/api/service/:serviceId/grant', validate(validators.grantPermission), servicesController.grantPermission);

// Endpoints limited to administrators
userRouter.use(authController.adminRequired);

const serviceRouter = express.Router();

serviceRouter.post('/api/token', validate(validators.requestToken), servicesController.requestToken);

serviceRouter.use(validate(validators.token), servicesController.tokenRequired);

serviceRouter.get('/api/user', servicesController.getUser);

const router = express.Router();

router.use(userRouter);
router.use(serviceRouter);

module.exports = router;