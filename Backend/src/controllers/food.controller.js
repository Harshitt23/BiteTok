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

        // Restaurant name is optional, will use food partner name as fallback

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
        
        const foodItems = await foodModel.find({}).populate('foodPartner', 'businessName email')
        
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

async function deleteDuplicateFoodItems(req, res) {
    try {
        console.log("🧹 Starting duplicate cleanup...")
        
        // Find all food items
        const allFoodItems = await foodModel.find({})
        console.log(`📊 Found ${allFoodItems.length} total food items`)
        
        // Group by name and description to find duplicates
        const grouped = {}
        allFoodItems.forEach(item => {
            const key = `${item.name}-${item.description}`
            if (!grouped[key]) {
                grouped[key] = []
            }
            grouped[key].push(item)
        })
        
        let duplicatesToDelete = []
        let uniqueItems = []
        
        // Find duplicates (keep the first one, delete the rest)
        Object.values(grouped).forEach(group => {
            if (group.length > 1) {
                uniqueItems.push(group[0]) // Keep the first one
                duplicatesToDelete.push(...group.slice(1)) // Delete the rest
            } else {
                uniqueItems.push(group[0])
            }
        })
        
        console.log(`✅ Unique items to keep: ${uniqueItems.length}`)
        console.log(`🗑️ Duplicates to delete: ${duplicatesToDelete.length}`)
        
        if (duplicatesToDelete.length > 0) {
            // Delete duplicates
            const deleteIds = duplicatesToDelete.map(item => item._id)
            await foodModel.deleteMany({ _id: { $in: deleteIds } })
            console.log(`✅ Deleted ${duplicatesToDelete.length} duplicate items`)
        }
        
        res.status(200).json({
            message: "Duplicate cleanup completed",
            uniqueItems: uniqueItems.length,
            duplicatesDeleted: duplicatesToDelete.length
        })
        
    } catch (error) {
        console.error("❌ Error cleaning duplicates:", error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function deleteFoodItem(req, res) {
    try {
        const { id } = req.params;
        
        console.log(`🗑️ DELETE /api/food/${id} - Request received`);
        console.log("🍪 Cookies:", req.cookies);
        console.log("👤 User from middleware:", req.user);
        
        // Find the food item
        const foodItem = await foodModel.findById(id).populate('foodPartner');
        
        if (!foodItem) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }
        
        // Check if the user is the owner of this food item
        if (foodItem.foodPartner._id.toString() !== req.foodPartner._id.toString()) {
            return res.status(403).json({
                message: "You can only delete your own food items"
            });
        }
        
        // Delete the food item
        await foodModel.findByIdAndDelete(id);
        
        console.log(`✅ Food item deleted: ${foodItem.name}`);
        
        res.status(200).json({
            message: "Food item deleted successfully",
            deletedItem: {
                id: foodItem._id,
                name: foodItem.name
            }
        });
        
    } catch (error) {
        console.error("❌ Error deleting food item:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    createFood,
    getFoodItems,
    deleteDuplicateFoodItems,
    deleteFoodItem
}