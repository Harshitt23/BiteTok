const request = require('supertest');

// Stub the CDN so tests never hit ImageKit. spyOn mutates the shared exports
// object that the controller already holds a reference to.
const storage = require('../src/services/storage.service');
vi.spyOn(storage, 'uploadVideo').mockResolvedValue({
    url: 'https://cdn.test/video.mp4',
    thumbnailUrl: 'https://cdn.test/thumb.jpg',
    fileId: 'file_123',
});
vi.spyOn(storage, 'deleteFile').mockResolvedValue(undefined);

const createApp = require('../src/app');
const app = createApp();

async function registerPartner() {
    const res = await request(app).post('/api/auth/food-partner/register').send({
        businessName: 'Tasty Co',
        contactName: 'Chef',
        phone: '111',
        email: `partner${Date.now()}@x.com`,
        address: 'Road 1',
        city: 'Pune',
        password: 'password123',
    });
    return res.body.token;
}

async function registerUser() {
    const res = await request(app).post('/api/auth/user/register').send({
        firstName: 'A',
        lastName: 'B',
        email: `user${Date.now()}@x.com`,
        phone: '222',
        address: 'Home',
        password: 'password123',
    });
    return res.body.token;
}

async function createFood(partnerToken) {
    const res = await request(app)
        .post('/api/food')
        .set('Authorization', `Bearer ${partnerToken}`)
        .field('name', 'Pizza')
        .field('description', 'Cheesy')
        .attach('video', Buffer.from('fake-video-bytes'), 'clip.mp4');
    return res;
}

describe('Food — creation & feed', () => {
    it('lets a food partner create a food item', async () => {
        const token = await registerPartner();
        const res = await createFood(token);
        expect(res.status).toBe(201);
        expect(res.body.food.name).toBe('Pizza');
        expect(res.body.food.video).toBe('https://cdn.test/video.mp4');
    });

    it('forbids a user from creating food', async () => {
        const token = await registerUser();
        const res = await request(app)
            .post('/api/food')
            .set('Authorization', `Bearer ${token}`)
            .field('name', 'Pizza')
            .attach('video', Buffer.from('x'), 'clip.mp4');
        expect(res.status).toBe(403);
    });

    it('serves a public, paginated feed', async () => {
        const token = await registerPartner();
        await createFood(token);
        const res = await request(app).get('/api/food?page=1&limit=10');
        expect(res.status).toBe(200);
        expect(res.body.foodItems).toHaveLength(1);
        expect(res.body.total).toBe(1);
        expect(res.body.foodItems[0].liked).toBe(false);
    });
});

describe('Food — likes, saves, comments', () => {
    let userToken;
    let foodId;

    beforeEach(async () => {
        const partnerToken = await registerPartner();
        const food = await createFood(partnerToken);
        foodId = food.body.food._id;
        userToken = await registerUser();
    });

    it('toggles a like on and off', async () => {
        const on = await request(app)
            .post(`/api/food/${foodId}/like`)
            .set('Authorization', `Bearer ${userToken}`);
        expect(on.status).toBe(200);
        expect(on.body.liked).toBe(true);
        expect(on.body.likeCount).toBe(1);

        const off = await request(app)
            .post(`/api/food/${foodId}/like`)
            .set('Authorization', `Bearer ${userToken}`);
        expect(off.body.liked).toBe(false);
        expect(off.body.likeCount).toBe(0);
    });

    it('toggles a save', async () => {
        const res = await request(app)
            .post(`/api/food/${foodId}/save`)
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.body.saved).toBe(true);
        expect(res.body.saveCount).toBe(1);
    });

    it('adds and lists comments', async () => {
        const add = await request(app)
            .post(`/api/food/${foodId}/comments`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ text: 'Looks delicious!' });
        expect(add.status).toBe(201);
        expect(add.body.comment.text).toBe('Looks delicious!');

        const list = await request(app).get(`/api/food/${foodId}/comments`);
        expect(list.status).toBe(200);
        expect(list.body.comments).toHaveLength(1);
    });

    it('requires auth to like', async () => {
        const res = await request(app).post(`/api/food/${foodId}/like`);
        expect(res.status).toBe(401);
    });
});
