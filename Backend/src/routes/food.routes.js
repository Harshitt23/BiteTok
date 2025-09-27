const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")             
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept video files
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed'), false);
        }
    }
})

/* POST /api/food/ [protected]*/
router.post('/',
    authMiddleware.authFoodPartnerMiddleware, 
    upload.single("video"),
    foodController.createFood)


/* GET /api/food/ [protected] */
router.get("/",
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems)

/* DELETE /api/food/cleanup [protected] - Remove duplicate food items */
router.delete("/cleanup",
    authMiddleware.authUserMiddleware,
    foodController.deleteDuplicateFoodItems)

module.exports = router;