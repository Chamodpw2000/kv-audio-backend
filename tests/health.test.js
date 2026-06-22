import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app.js';

// Prevent mongoose from attempting a real DB connection during import
vi.mock('mongoose', async (importOriginal) => {
    const actual = await importOriginal();
    return { ...actual, connect: vi.fn().mockResolvedValue(true) };
});

describe('Health & root routes', () => {
    it('GET /healthz returns 200 with status ok', async () => {
        const res = await request(app).get('/healthz');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });

    it('GET / returns welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toContain('KV-Audio');
    });

    it('POST / echoes request body', async () => {
        const res = await request(app).post('/').send({ test: 'data' });
        expect(res.status).toBe(200);
        expect(res.body.message).toContain('test');
    });
});
