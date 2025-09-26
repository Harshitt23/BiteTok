const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")             
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
})

/* POST /api/food/ [protected]*/
router.post('/',
    authMiddleware.authFoodPartnerMiddleware, 
    upload.single("video"),
    foodController.createFood)

/* POST /api/food/test [unprotected - for testing]*/
router.post('/test',
    upload.single("video"),
    (req, res) => {
        console.log('=== TEST ROUTE ===');
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        res.json({ body: req.body, file: req.file });
    })


module.exports = router;