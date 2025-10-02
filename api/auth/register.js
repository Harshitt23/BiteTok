// User registration endpoint
require('dotenv').config();
const userModel = require('../lib/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB } = require('../lib/database');

module.exports = async (req, res) => {
    // Connect to database first
    await connectDB();
    try {
        const { firstName, lastName, email, phone, address, password } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !address || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        const isUserAlreadyExists = await userModel.findOne({ email });

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName: `${firstName} ${lastName}`,
            email,
            phone,
            address,
            password: hashedPassword
        });

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                address: user.address
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: "Internal server error during registration"
        });
    }
};
