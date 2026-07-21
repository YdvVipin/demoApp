/**
 * QADemo API — a small, deterministic REST API for the QA platform to test against.
 *
 * Zero dependencies (Node's built-in http) so it runs anywhere Node runs, with no
 * install step to fail before a demo. Started alongside Vite by start.sh on port 6163;
 * Vite proxies /api → here so the SPA can call it, and API Testing points straight at
 * http://localhost:6163 (or the OpenAPI at /api/openapi.json).
 *
 * Designed as a test surface: functional (GET lists), negative (401 login, 400 bad
 * email), boundary (cart quantity 1..99), schema (stable product shape).
 */

import http from 'node:http';
import { URL } from 'node:url';

const PORT = process.env.DEMO_API_PORT || 6163;

// ── Seed data (in-memory; resets on restart — deterministic for tests) ──────────
const PRODUCTS = [
  { id: 1, name: 'Wireless Mouse', price: 24.99, category: 'accessories', stock: 120 },
  { id: 2, name: 'Mechanical Keyboard', price: 89.99, category: 'accessories', stock: 45 },
  { id: 3, name: '27" 4K Monitor', price: 329.0, category: 'displays', stock: 12 },
  { id: 4, name: 'USB-C Hub', price: 39.5, category: 'accessories', stock: 0 },
  { id: 5, name: 'Laptop Stand', price: 34.0, category: 'accessories', stock: 78 },
];

const ORDERS = [
  { id: 1001, customer: 'alice', total: 114.98, status: 'shipped' },
  { id: 1002, customer: 'bob', total: 329.0, status: 'processing' },
];

// Coupon codes → discount percent. Unknown codes are simply invalid.
const COUPONS = { SAVE10: 10, SAVE20: 20, WELCOME15: 15 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Helpers ─────────────────────────────────────────────────────────────────────
function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(payload);
}

function readJson(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve(null); // signal malformed body → 400
      }
    });
  });
}

// ── OpenAPI (so API Testing's OpenAPI mode works against this) ───────────────────
function openapiSpec() {
  const ok = { description: 'ok' };
  // example = a valid body so the test generator sends a real functional request.
  const jsonBody = (props, required, example) => ({
    required: true,
    content: { 'application/json': { schema: { type: 'object', properties: props, required }, example } },
  });
  return {
    openapi: '3.0.0',
    info: { title: 'QADemo API', version: '1.0.0' },
    servers: [{ url: `http://localhost:${PORT}` }],
    paths: {
      '/api/health': { get: { summary: 'Health check', responses: { 200: ok } } },
      '/api/products': {
        get: {
          summary: 'List products',
          parameters: [
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: ok },
        },
      },
      '/api/products/{id}': {
        get: {
          summary: 'Get one product',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: ok, 404: { description: 'not found' } },
        },
      },
      '/api/cart': {
        post: {
          summary: 'Add to cart',
          requestBody: jsonBody(
            { productId: { type: 'integer' }, quantity: { type: 'integer' } },
            ['productId', 'quantity'],
            { productId: 1, quantity: 2 }
          ),
          responses: { 200: ok, 400: { description: 'bad input' }, 404: { description: 'unknown product' }, 422: { description: 'quantity out of range' } },
        },
      },
      '/api/coupon/validate': {
        post: {
          summary: 'Validate a coupon code',
          requestBody: jsonBody({ code: { type: 'string' } }, ['code'], { code: 'SAVE10' }),
          responses: { 200: ok, 400: { description: 'missing code' } },
        },
      },
      '/api/newsletter': {
        post: {
          summary: 'Subscribe to the newsletter',
          requestBody: jsonBody({ email: { type: 'string' } }, ['email'], { email: 'qa@example.com' }),
          responses: { 200: ok, 400: { description: 'invalid email' } },
        },
      },
      '/api/orders': { get: { summary: 'List orders', responses: { 200: ok } } },
      '/api/login': {
        post: {
          summary: 'Authenticate',
          requestBody: jsonBody(
            { username: { type: 'string' }, password: { type: 'string' } },
            ['username', 'password'],
            { username: 'admin', password: 'admin123' }
          ),
          responses: { 200: ok, 401: { description: 'invalid credentials' } },
        },
      },
    },
  };
}

// ── Router ───────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  // GET routes
  if (method === 'GET' && path === '/api/health') return send(res, 200, { status: 'ok' });
  if (method === 'GET' && path === '/api/openapi.json') return send(res, 200, openapiSpec());

  if (method === 'GET' && path === '/api/products') {
    let items = PRODUCTS;
    const cat = url.searchParams.get('category');
    const q = (url.searchParams.get('search') || '').toLowerCase();
    if (cat) items = items.filter((p) => p.category === cat);
    if (q) items = items.filter((p) => p.name.toLowerCase().includes(q));
    return send(res, 200, { products: items, total: items.length });
  }

  const prodMatch = path.match(/^\/api\/products\/(\d+)$/);
  if (method === 'GET' && prodMatch) {
    const p = PRODUCTS.find((x) => x.id === Number(prodMatch[1]));
    return p ? send(res, 200, p) : send(res, 404, { error: 'product not found' });
  }

  if (method === 'GET' && path === '/api/orders') {
    return send(res, 200, { orders: ORDERS, total: ORDERS.length });
  }

  // POST routes
  if (method === 'POST') {
    const body = await readJson(req);
    if (body === null) return send(res, 400, { error: 'malformed JSON body' });

    if (path === '/api/cart') {
      const { productId, quantity } = body;
      if (productId == null || quantity == null)
        return send(res, 400, { error: 'productId and quantity are required' });
      const product = PRODUCTS.find((p) => p.id === Number(productId));
      if (!product) return send(res, 404, { error: 'unknown product' });
      const qty = Number(quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 99)
        return send(res, 422, { error: 'quantity must be an integer between 1 and 99' });
      return send(res, 200, {
        productId: product.id,
        name: product.name,
        quantity: qty,
        lineTotal: Number((product.price * qty).toFixed(2)),
      });
    }

    if (path === '/api/coupon/validate') {
      const code = (body.code || '').toString().trim().toUpperCase();
      if (!code) return send(res, 400, { error: 'code is required' });
      const discount = COUPONS[code];
      return send(res, 200, {
        code,
        valid: discount != null,
        discountPercent: discount || 0,
      });
    }

    if (path === '/api/newsletter') {
      const email = (body.email || '').toString().trim();
      if (!EMAIL_RE.test(email)) return send(res, 400, { error: 'invalid email address' });
      return send(res, 200, { subscribed: true, email });
    }

    if (path === '/api/login') {
      const { username, password } = body;
      if (username === 'admin' && password === 'admin123')
        return send(res, 200, { token: 'demo-token-abc123', user: { username: 'admin', role: 'admin' } });
      return send(res, 401, { error: 'invalid username or password' });
    }
  }

  return send(res, 404, { error: `no route for ${method} ${path}` });
});

server.listen(PORT, () => {
  console.log(`QADemo API listening on http://localhost:${PORT} (OpenAPI at /api/openapi.json)`);
});
