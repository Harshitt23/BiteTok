const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    try {
        // Log file upload details
        console.log("📁 File received:", {
            fieldname: req.file?.fieldname,
            originalname: req.file?.originalname,
            mimetype: req.file?.mimetype,
            size: req.file?.size
        })
        console.log("📝 Form data received:", req.body)
        
        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Video file is required"
            })
        }

        // Check if required fields are provided
        if (!req.body.name) {
            return res.status(400).json({
                message: "Food name is required"
            })
        }

        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        })

        const response = {
            message: "food created successfully",
            food: foodItem
        }
        
        // Log the response to terminal
        console.log("✅ Food created successfully:", JSON.stringify(response, null, 2))
        
        res.status(201).json(response)

    } catch (error) {
        console.error("Error creating food:", error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    })
}

module.exports = {
    createFood,
    getFoodItems
}