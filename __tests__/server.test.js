'use strict';

const request = require('supertest');
const app = require('../server');

describe('Comment API', () => {
  test('GET /api/comments returns an array', async () => {
    const res = await request(app).get('/api/comments');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/comments stores a plain comment', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ text: 'Hello world' });
    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Hello world');
  });

  test('POST /api/comments neutralizes <script> tags (XSS prevention)', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ text: '<script>alert("xss")</script>' });
    expect(res.statusCode).toBe(201);
    // The xss library HTML-encodes the tag so it is never executable in a browser.
    expect(res.body.text).not.toMatch(/<script>/i);
  });

  test('POST /api/comments strips inline event handlers', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ text: '<img src=x onerror=alert(1)>' });
    expect(res.statusCode).toBe(201);
    expect(res.body.text).not.toMatch(/onerror/i);
  });

  test('POST /api/comments returns 400 for empty text', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ text: '' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/comments returns 400 when text is missing', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
