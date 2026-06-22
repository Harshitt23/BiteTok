const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { signToken, cookieOptions, COOKIE_NAME } = require('../utils/token');

const SALT_ROUNDS = 10;

function issueToken(res, { id, role }) {
    const token = signToken({ id, role });
    res.cookie(COOKIE_NAME, token, cookieOptions());
    return token;
}

// ---------------------------------------------------------------- Users -----

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, address, password } = req.body;

    if (await userModel.exists({ email })) {
        throw ApiError.conflict('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userModel.create({
        fullName: `${firstName} ${lastName}`,
        email,
        phone,
        address,
        password: hashedPassword,
    });

    const token = issueToken(res, { id: user._id, role: 'user' });

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        role: 'user',
        user,
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const token = issueToken(res, { id: user._id, role: 'user' });
    user.password = undefined;

    res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token,
        role: 'user',
        user,
    });
});

// -------------------------------------------------------- Food partners -----

const registerFoodPartner = asyncHandler(async (req, res) => {
    const { businessName, contactName, phone, email, address, city, password } =
        req.body;

    if (await foodPartnerModel.exists({ email })) {
        throw ApiError.conflict('A food partner account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const foodPartner = await foodPartnerModel.create({
        businessName,
        contactName,
        phone,
        email,
        address,
        city,
        password: hashedPassword,
    });

    const token = issueToken(res, { id: foodPartner._id, role: 'foodPartner' });

    res.status(201).json({
        success: true,
        message: 'Food partner registered successfully',
        token,
        role: 'foodPartner',
        foodPartner,
    });
});

const loginFoodPartner = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({ email }).select('+password');
    if (!foodPartner || !(await bcrypt.compare(password, foodPartner.password))) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const token = issueToken(res, { id: foodPartner._id, role: 'foodPartner' });
    foodPartner.password = undefined;

    res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token,
        role: 'foodPartner',
        foodPartner,
    });
});

// ----------------------------------------------------------- Shared ---------

const logout = (req, res) => {
    res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

/** Returns the currently authenticated principal (used by the frontend). */
const getMe = asyncHandler(async (req, res) => {
    if (req.auth?.role === 'foodPartner') {
        return res.status(200).json({ success: true, role: 'foodPartner', foodPartner: req.foodPartner });
    }
    res.status(200).json({ success: true, role: 'user', user: req.user });
});

const getAllFoodPartners = asyncHandler(async (req, res) => {
    const partners = await foodPartnerModel.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        message: 'Food partners fetched successfully',
        count: partners.length,
        partners,
    });
});

module.exports = {
    registerUser,
    loginUser,
    registerFoodPartner,
    loginFoodPartner,
    logout,
    getMe,
    getAllFoodPartners,
};
