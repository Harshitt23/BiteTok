const { randomUUID } = require('crypto');
const foodModel = require('../models/food.model');
const likeModel = require('../models/like.model');
const saveModel = require('../models/save.model');
const commentModel = require('../models/comment.model');
const storageService = require('../services/storage.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * Adds `liked` / `saved` booleans to a list of food items for the given user.
 * Done with two batched queries instead of N per item.
 */
async function decorateWithUserState(items, userId) {
    if (!userId || items.length === 0) {
        return items.map((it) => ({ ...it, liked: false, saved: false }));
    }
    const ids = items.map((it) => it._id);
    const [liked, saved] = await Promise.all([
        likeModel.find({ user: userId, food: { $in: ids } }).distinct('food'),
        saveModel.find({ user: userId, food: { $in: ids } }).distinct('food'),
    ]);
    const likedSet = new Set(liked.map(String));
    const savedSet = new Set(saved.map(String));
    return items.map((it) => ({
        ...it,
        liked: likedSet.has(String(it._id)),
        saved: savedSet.has(String(it._id)),
    }));
}

// --------------------------------------------------------------- Create -----

const createFood = asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('A video file is required');

    const uploaded = await storageService.uploadVideo(req.file.buffer, randomUUID());

    const food = await foodModel.create({
        name: req.body.name,
        description: req.body.description || '',
        video: uploaded.url,
        videoFileId: uploaded.fileId,
        thumbnail: uploaded.thumbnailUrl,
        foodPartner: req.foodPartner._id,
    });

    res.status(201).json({
        success: true,
        message: 'Food created successfully',
        food,
    });
});

// ----------------------------------------------------------------- Feed -----

const getFeed = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        foodModel
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('foodPartner', 'businessName city address phone')
            .lean(),
        foodModel.estimatedDocumentCount(),
    ]);

    const decorated = await decorateWithUserState(items, req.user?._id);

    res.status(200).json({
        success: true,
        page,
        limit,
        total,
        hasMore: skip + items.length < total,
        foodItems: decorated,
    });
});

const getFoodById = asyncHandler(async (req, res) => {
    const food = await foodModel
        .findById(req.params.id)
        .populate('foodPartner', 'businessName city address phone')
        .lean();
    if (!food) throw ApiError.notFound('Food item not found');

    const [decorated] = await decorateWithUserState([food], req.user?._id);
    res.status(200).json({ success: true, food: decorated });
});

const getPartnerFood = asyncHandler(async (req, res) => {
    const items = await foodModel
        .find({ foodPartner: req.foodPartner._id })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({ success: true, count: items.length, foodItems: items });
});

const getSavedFood = asyncHandler(async (req, res) => {
    const saved = await saveModel
        .find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate({
            path: 'food',
            populate: { path: 'foodPartner', select: 'businessName city' },
        })
        .lean();
    const foodItems = saved.map((s) => s.food).filter(Boolean);
    res.status(200).json({ success: true, count: foodItems.length, foodItems });
});

// ------------------------------------------------------- Likes / Saves ------

const toggleLike = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!(await foodModel.exists({ _id: id }))) {
        throw ApiError.notFound('Food item not found');
    }

    const existing = await likeModel.findOne({ user: req.user._id, food: id });
    let liked;
    if (existing) {
        await existing.deleteOne();
        await foodModel.updateOne({ _id: id }, { $inc: { likeCount: -1 } });
        liked = false;
    } else {
        await likeModel.create({ user: req.user._id, food: id });
        await foodModel.updateOne({ _id: id }, { $inc: { likeCount: 1 } });
        liked = true;
    }

    const food = await foodModel.findById(id).select('likeCount').lean();
    res.status(200).json({ success: true, liked, likeCount: food.likeCount });
});

const toggleSave = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!(await foodModel.exists({ _id: id }))) {
        throw ApiError.notFound('Food item not found');
    }

    const existing = await saveModel.findOne({ user: req.user._id, food: id });
    let saved;
    if (existing) {
        await existing.deleteOne();
        await foodModel.updateOne({ _id: id }, { $inc: { saveCount: -1 } });
        saved = false;
    } else {
        await saveModel.create({ user: req.user._id, food: id });
        await foodModel.updateOne({ _id: id }, { $inc: { saveCount: 1 } });
        saved = true;
    }

    const food = await foodModel.findById(id).select('saveCount').lean();
    res.status(200).json({ success: true, saved, saveCount: food.saveCount });
});

// --------------------------------------------------------------- Delete -----

const deleteFood = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const food = await foodModel.findById(id);
    if (!food) throw ApiError.notFound('Food item not found');

    if (food.foodPartner.toString() !== req.foodPartner._id.toString()) {
        throw ApiError.forbidden('You can only delete your own food items');
    }

    await Promise.all([
        likeModel.deleteMany({ food: id }),
        saveModel.deleteMany({ food: id }),
        commentModel.deleteMany({ food: id }),
        storageService.deleteFile(food.videoFileId),
    ]);
    await food.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Food item deleted successfully',
        deletedId: id,
    });
});

module.exports = {
    createFood,
    getFeed,
    getFoodById,
    getPartnerFood,
    getSavedFood,
    toggleLike,
    toggleSave,
    deleteFood,
};
