/**
 * Seeds demo food partners + food items so a fresh deploy has a populated feed.
 *
 *   npm run seed
 *
 * Idempotent: removes any previously seeded data (partners on the @seed.bitetok
 * domain and their food) before re-inserting. Video URLs default to the sample
 * clips bundled in the frontend (`/videos/...`), served from the frontend origin.
 * Override with ASSET_BASE_URL to point at an absolute CDN/host.
 */
const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../src/db/db');
const foodPartnerModel = require('../src/models/foodpartner.model');
const foodModel = require('../src/models/food.model');

const ASSET = (process.env.ASSET_BASE_URL || '').replace(/\/$/, '');
const v = (p) => `${ASSET}${p}`;

const PARTNERS = [
    { businessName: 'Spice Garden', contactName: 'Asha Rao', phone: '9000000001', email: 'spice@seed.bitetok', address: 'MG Road', city: 'Pune' },
    { businessName: 'Choco Heaven', contactName: 'Rahul Jain', phone: '9000000002', email: 'choco@seed.bitetok', address: 'Park Street', city: 'Mumbai' },
    { businessName: 'Ariz Biryani Valley', contactName: 'Imran Khan', phone: '9000000003', email: 'biryani@seed.bitetok', address: 'Charminar Rd', city: 'Hyderabad' },
];

const FOODS = [
    { p: 0, name: 'Burger & White Sauce Pasta', description: 'Juicy burger with creamy Indian-style white sauce pasta.', tags: ['spicy'], video: v('/videos/vertical/3139863-hd_1080_1920_30fps.mp4') },
    { p: 0, name: 'Veg Biryani', description: 'Flavorful rice cooked with vegetables and aromatic spices.', tags: ['vegetarian'], video: v('/videos/vertical/10200320-hd_2160_3840_25fps.mp4') },
    { p: 1, name: 'Chocolate Pancakes', description: 'Rich, fluffy chocolate pancakes with a touch of sweetness.', tags: ['dessert'], video: v('/videos/vertical/7141505-uhd_2160_4096_30fps.mp4') },
    { p: 1, name: 'Pancakes with Honey', description: 'Fluffy golden pancakes drizzled with sweet honey.', tags: ['dessert', 'vegetarian'], video: v('/videos/vertical/3709159-uhd_2160_4096_25fps.mp4') },
    { p: 2, name: 'Homemade Laddoo', description: 'Soft laddoos made with flour, sugar, and ghee.', tags: ['dessert', 'vegetarian'], video: v('/videos/vertical/8844427-uhd_2160_3840_30fps.mp4') },
    { p: 2, name: 'Spaghetti', description: 'Classic spaghetti tossed in rich, flavorful sauce.', tags: ['vegetarian'], video: v('/videos/vertical/4058071-uhd_2160_4096_25fps.mp4') },
];

async function run() {
    await connectDB();
    console.log('Connected. Seeding…');

    // Clean previous seed data.
    const existing = await foodPartnerModel.find({ email: /@seed\.bitetok$/ }).distinct('_id');
    if (existing.length) {
        await foodModel.deleteMany({ foodPartner: { $in: existing } });
        await foodPartnerModel.deleteMany({ _id: { $in: existing } });
        console.log(`Removed ${existing.length} previously seeded partners and their food.`);
    }

    const hashed = await bcrypt.hash('password123', 10);
    const partners = await foodPartnerModel.insertMany(
        PARTNERS.map((p) => ({ ...p, password: hashed }))
    );

    const foods = FOODS.map((f) => ({
        name: f.name,
        description: f.description,
        tags: f.tags,
        video: f.video,
        foodPartner: partners[f.p]._id,
    }));
    await foodModel.insertMany(foods);

    console.log(`✅ Seeded ${partners.length} partners and ${foods.length} food items.`);
    console.log('   Demo partner login: spice@seed.bitetok / password123');
    await disconnectDB();
}

run().catch(async (err) => {
    console.error('❌ Seed failed:', err);
    await disconnectDB();
    process.exit(1);
});
