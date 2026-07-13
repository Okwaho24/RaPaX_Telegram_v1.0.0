// ─────────────────────────────────────────────────────────────
//  RaPaX™ Telegram Bot — API Client
//  Talks to the RaPaX server's public + operator endpoints.
// ─────────────────────────────────────────────────────────────
import axios from 'axios';
import 'dotenv/config';

const BASE_URL = process.env.RAPAX_API_URL || 'http://localhost:4000/api';
const OPERATOR_SECRET = process.env.RAPAX_OPERATOR_SECRET || '';

let _token = null;

async function operatorLogin() {
  const res = await axios.post(`${BASE_URL}/operator/login`, { secret: OPERATOR_SECRET });
  _token = res.data.token;
  return _token;
}

async function getToken() {
  if (_token) return _token;
  return operatorLogin();
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

// ── Public API ───────────────────────────────────────────────
export async function listProducts() {
  const res = await axios.get(`${BASE_URL}/products`);
  return res.data.products || [];
}

export async function getProduct(id) {
  const res = await axios.get(`${BASE_URL}/product/${id}`);
  return res.data.product;
}

export async function initiatePurchase({ productId, currency, buyerWallet }) {
  const res = await axios.post(`${BASE_URL}/purchase/initiate`, {
    product_id: productId,
    currency: currency.toUpperCase(),
    buyer_wallet: buyerWallet || null,
  });
  return res.data;
}

export async function getPurchaseStatus(transactionId) {
  const res = await axios.get(`${BASE_URL}/purchase/status/${transactionId}`);
  return res.data;
}

// ── Operator API (authenticated) ────────────────────────────
export async function getAllProducts() {
  const token = await getToken();
  const res = await axios.get(`${BASE_URL}/operator/products`, { headers: authHeader(token) });
  return res.data.products || [];
}

export async function getTransactions(limit = 20) {
  const token = await getToken();
  const res = await axios.get(`${BASE_URL}/operator/transactions?limit=${limit}`, {
    headers: authHeader(token),
  });
  return res.data.transactions || [];
}

export async function getDeliveries(limit = 20) {
  const token = await getToken();
  const res = await axios.get(`${BASE_URL}/operator/deliveries?limit=${limit}`, {
    headers: authHeader(token),
  });
  return res.data.deliveries || [];
}

export async function getAuditLogs(limit = 20, eventType = '') {
  const token = await getToken();
  const q = eventType ? `?limit=${limit}&event_type=${eventType}` : `?limit=${limit}`;
  const res = await axios.get(`${BASE_URL}/operator/logs${q}`, { headers: authHeader(token) });
  return res.data.logs || [];
}
