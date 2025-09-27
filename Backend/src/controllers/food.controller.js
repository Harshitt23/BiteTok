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
    try {
        // Debug: Log what we receive
        console.log("🔍 GET /api/food - Request received")
        console.log("🍪 Cookies:", req.cookies)
        console.log("👤 User from middleware:", req.user)
        
        const foodItems = await foodModel.find({}).populate('foodPartner', 'name email')
        
        const response = {
            message: "Food items fetched successfully",
            foodItems
        }
        
        console.log("📋 Food items found:", foodItems.length)
        console.log("📊 Food items details:")
        foodItems.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.name} - Video: ${item.video.substring(0, 50)}...`)
        })
        console.log("✅ GET /api/food response:", JSON.stringify(response, null, 2))
        
        res.status(200).json(response)
    } catch (error) {
        console.error("❌ Error fetching food items:", error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    createFood,
    getFoodItems
}