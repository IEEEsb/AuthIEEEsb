const express = require('express');
const authController = require('./controllers/authController');
const servicesController = require('./controllers/servicesController');

const {
	validators, validate, validateWithoutStripping,
} = require('./controllers/validators');

function selfUser(req, res, next) {
	req.params.userId = req.session.userId;
	next();
}

const userRouter = express.Router();

userRouter.post('/register', validate(validators.register), authController.register);
userRouter.post('/login', validate(validators.login), authController.login);

// Endpoints that require authentication
userRouter.use(authController.authRequired);

userRouter.post('/logout', authController.logout);
userRouter.get('/self', selfUser, authController.getUser);
userRouter.patch('/self', validate(validators.updateUser), selfUser, authController.updateUser);

userRouter.get('/service/all', servicesController.getSelfServices);
userRouter.get('/service/self/:serviceId', servicesController.getSelfService);
userRouter.get('/service/:serviceId', servicesController.getService);
userRouter.post('/service', validate(validators.addService), servicesController.addService);
userRouter.patch('/service/:serviceId', validate(validators.updateService), servicesController.updateService);
userRouter.delete('/service/:serviceId', servicesController.removeService);
userRouter.post('/service/:serviceId/grant', validate(validators.grantPermission), servicesController.grantPermission);

// Endpoints limited to administrators
userRouter.use(authController.adminRequired);

userRouter.get('/all', authController.getAllUsers);
userRouter.get('/:userId', authController.getUser);
userRouter.post('/:userId/addRole', validate(validators.addRole), authController.addRole);
userRouter.post('/:userId/enable', authController.enableUser);

const serviceRouter = express.Router();

serviceRouter.use(validateWithoutStripping(validators.secret), servicesController.secretRequired);

serviceRouter.use(validateWithoutStripping(validators.token), servicesController.tokenRequired);

serviceRouter.get('/scope', servicesController.getScope);
serviceRouter.get('/user', authController.getUserWithScope);

const router = express.Router();

router.use('/api/user', userRouter);
router.use('/api/service', serviceRouter);

module.exports = router;
