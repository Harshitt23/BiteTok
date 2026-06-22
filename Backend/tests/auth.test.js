const request = require('supertest');
const createApp = require('../src/app');

const app = createApp();

const validUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '1234567890',
    address: '123 St',
    password: 'password123',
};

describe('Auth — users', () => {
    it('registers a user and sets a cookie', async () => {
        const res = await request(app).post('/api/auth/user/register').send(validUser);
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.user.email).toBe('test@example.com');
        expect(res.body.user.password).toBeUndefined();
        expect(res.headers['set-cookie'][0]).toMatch(/token=/);
    });

    it('rejects duplicate email', async () => {
        await request(app).post('/api/auth/user/register').send(validUser);
        const res = await request(app).post('/api/auth/user/register').send(validUser);
        expect(res.status).toBe(409);
    });

    it('rejects invalid registration payload', async () => {
        const res = await request(app)
            .post('/api/auth/user/register')
            .send({ email: 'bad', password: '1' });
        expect(res.status).toBe(400);
        expect(res.body.details).toBeDefined();
    });

    it('logs in with correct credentials and rejects wrong ones', async () => {
        await request(app).post('/api/auth/user/register').send(validUser);

        const ok = await request(app)
            .post('/api/auth/user/login')
            .send({ email: validUser.email, password: validUser.password });
        expect(ok.status).toBe(200);
        expect(ok.body.token).toBeDefined();

        const bad = await request(app)
            .post('/api/auth/user/login')
            .send({ email: validUser.email, password: 'wrong' });
        expect(bad.status).toBe(401);
    });

    it('returns the current user from /me', async () => {
        const reg = await request(app).post('/api/auth/user/register').send(validUser);
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${reg.body.token}`);
        expect(res.status).toBe(200);
        expect(res.body.role).toBe('user');
        expect(res.body.user.email).toBe(validUser.email);
    });

    it('blocks /me without a token', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.status).toBe(401);
    });
});

describe('Health', () => {
    it('reports healthy', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
