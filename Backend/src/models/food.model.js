const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true, default: '' },
        video: { type: String, required: true },
        videoFileId: { type: String, default: '' },
        thumbnail: { type: String, default: '' },
        tags: { type: [String], default: [], index: true },
        foodPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'foodpartner',
            required: true,
            index: true,
        },
        // Denormalized counters kept in sync with the Like/Save/Comment models.
        likeCount: { type: Number, default: 0, min: 0 },
        saveCount: { type: Number, default: 0, min: 0 },
        commentCount: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);

foodSchema.index({ createdAt: -1 });

module.exports = mongoose.model('food', foodSchema);
