// User login endpoint
require('dotenv').config();
const userModel = require('../lib/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB } = require('../lib/database');

module.exports = async (req, res) => {
    // Connect to database first
    await connectDB();
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                address: user.address
            },
            token
        });

        console.log('User logged in:', user.email);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: "Internal server error during login"
        });
    }
};
