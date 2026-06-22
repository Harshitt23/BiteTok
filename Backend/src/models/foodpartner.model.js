const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema(
    {
        businessName: { type: String, required: true, trim: true },
        contactName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        password: { type: String, required: true, select: false },
    },
    { timestamps: true }
);

foodPartnerSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model('foodpartner', foodPartnerSchema);
