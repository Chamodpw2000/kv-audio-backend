import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

vi.mock('../models/products.js', () => ({
    default: {
        find: vi.fn(),
        findOne: vi.fn(),
        findOneAndDelete: vi.fn(),
        updateOne: vi.fn(),
        prototype: { save: vi.fn() },
    },
}));

import Product from '../models/products.js';

describe('GET /api/products/getProducts', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns products for unauthenticated users (availability filter)', async () => {
        const mockProducts = [
            { key: 'p1', name: 'Speaker', price: 100, availability: true },
        ];
        Product.find.mockResolvedValue(mockProducts);

        const res = await request(app).get('/api/products/getProducts');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProducts);
        expect(Product.find).toHaveBeenCalledWith({ availability: true });
    });

    it('returns 500 when database throws', async () => {
        Product.find.mockRejectedValue(new Error('DB error'));

        const res = await request(app).get('/api/products/getProducts');

        expect(res.status).toBe(500);
    });
});

describe('GET /api/products/:key', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns 404 when product not found', async () => {
        Product.findOne.mockResolvedValue(null);

        const res = await request(app).get('/api/products/nonexistent-key');

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Product not found');
    });

    it('returns product when found', async () => {
        const mockProduct = { key: 'spk-001', name: 'Speaker', price: 150 };
        Product.findOne.mockResolvedValue(mockProduct);

        const res = await request(app).get('/api/products/spk-001');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProduct);
    });
});

describe('POST /api/products/addProduct', () => {
    it('returns 401 when no token provided', async () => {
        const res = await request(app)
            .post('/api/products/addProduct')
            .send({ key: 'p1', name: 'Test', price: 10 });

        expect(res.status).toBe(401);
    });
});
