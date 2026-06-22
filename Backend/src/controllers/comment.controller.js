const commentModel = require('../models/comment.model');
const foodModel = require('../models/food.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const addComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!(await foodModel.exists({ _id: id }))) {
        throw ApiError.notFound('Food item not found');
    }

    const comment = await commentModel.create({
        user: req.user._id,
        food: id,
        text: req.body.text,
    });
    await foodModel.updateOne({ _id: id }, { $inc: { commentCount: 1 } });

    const populated = await comment.populate('user', 'fullName');
    res.status(201).json({ success: true, comment: populated });
});

const listComments = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
        commentModel
            .find({ food: id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'fullName')
            .lean(),
        commentModel.countDocuments({ food: id }),
    ]);

    res.status(200).json({
        success: true,
        page,
        limit,
        total,
        hasMore: skip + comments.length < total,
        comments,
    });
});

const deleteComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comment = await commentModel.findById(id);
    if (!comment) throw ApiError.notFound('Comment not found');

    if (comment.user.toString() !== req.user._id.toString()) {
        throw ApiError.forbidden('You can only delete your own comments');
    }

    await comment.deleteOne();
    await foodModel.updateOne({ _id: comment.food }, { $inc: { commentCount: -1 } });

    res.status(200).json({ success: true, message: 'Comment deleted', deletedId: id });
});

module.exports = { addComment, listComments, deleteComment };
