const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const {
    registerUserSchema,
    registerPartnerSchema,
    loginSchema,
} = require('../validators/auth.validator');

const router = express.Router();

// User auth
router.post('/user/register', validate(registerUserSchema), authController.registerUser);
router.post('/user/login', validate(loginSchema), authController.loginUser);
router.post('/user/logout', authController.logout);

// Food partner auth
router.post('/food-partner/register', validate(registerPartnerSchema), authController.registerFoodPartner);
router.post('/food-partner/login', validate(loginSchema), authController.loginFoodPartner);
router.post('/food-partner/logout', authController.logout);
router.get('/food-partner/all', authController.getAllFoodPartners);

// Current principal
router.get('/me', authenticate, authController.getMe);

module.exports = router;
