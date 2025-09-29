const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const foodPartnerModel = mongoose.model("foodpartner", foodPartnerSchema);

module.exports = foodPartnerModel;