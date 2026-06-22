const express = require('express');
const foodController = require('../controllers/food.controller');
const commentController = require('../controllers/comment.controller');
const validate = require('../middlewares/validate.middleware');
const { uploadVideo } = require('../middlewares/upload.middleware');
const {
    requireUser,
    requireFoodPartner,
    optionalAuth,
} = require('../middlewares/auth.middleware');
const {
    createFoodSchema,
    foodIdParamSchema,
    feedQuerySchema,
} = require('../validators/food.validator');
const {
    createCommentSchema,
    listCommentsSchema,
    commentIdParamSchema,
} = require('../validators/comment.validator');

const router = express.Router();

// Public feed (likes/saves flags added when a valid token is present).
router.get('/', optionalAuth, validate(feedQuerySchema), foodController.getFeed);

// Food partner: own items
router.get('/mine', requireFoodPartner, foodController.getPartnerFood);

// User: saved items
router.get('/saved', requireUser, foodController.getSavedFood);

// Create (food partner only)
router.post(
    '/',
    requireFoodPartner,
    uploadVideo.single('video'),
    validate(createFoodSchema),
    foodController.createFood
);

// Single item
router.get('/:id', optionalAuth, validate(foodIdParamSchema), foodController.getFoodById);

// Likes / saves (users)
router.post('/:id/like', requireUser, validate(foodIdParamSchema), foodController.toggleLike);
router.post('/:id/save', requireUser, validate(foodIdParamSchema), foodController.toggleSave);

// Comments
router.get('/:id/comments', validate(listCommentsSchema), commentController.listComments);
router.post('/:id/comments', requireUser, validate(createCommentSchema), commentController.addComment);
router.delete('/comments/:id', requireUser, validate(commentIdParamSchema), commentController.deleteComment);

// Delete (owner food partner only)
router.delete('/:id', requireFoodPartner, validate(foodIdParamSchema), foodController.deleteFood);

module.exports = router;
