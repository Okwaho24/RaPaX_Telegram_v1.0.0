// ─────────────────────────────────────────────────────────────
//  RaPaX™ Telegram Bot — Handlers
//  Wires Telegram commands to the RaPaX API client and formats
//  responses using messages.js.
// ─────────────────────────────────────────────────────────────
import * as rapax from './rapaxClient.js';
import * as fmt from './messages.js';

const OPERATOR_CHAT_IDS = (process.env.OPERATOR_CHAT_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function isOperator(ctx) {
  return OPERATOR_CHAT_IDS.includes(String(ctx.chat.id));
}

export async function handleStart(ctx) {
  await ctx.reply(
    'Welcome to RaPaX™ — Sovereign Digital Products Vending Machine.\n\n' +
      'Use /products to browse, /buy <id> <currency> to purchase, ' +
      '/status <transaction_id> to check delivery.'
  );
}

export async function handleHelp(ctx) {
  await ctx.reply(
    '/products — browse available products\n' +
      '/product <id> — view product details\n' +
      '/buy <id> <currency> — start a purchase\n' +
      '/status <transaction_id> — check purchase status'
  );
}

export async function handleProducts(ctx) {
  try {
    const products = await rapax.listProducts();
    await ctx.replyWithMarkdown(fmt.formatProductList(products));
  } catch (err) {
    await ctx.reply(fmt.formatError(err.message));
  }
}

export async function handleProduct(ctx) {
  const id = ctx.message.text.split(' ')[1];
  if (!id) return ctx.reply('Usage: /product <id>');
  try {
    const product = await rapax.getProduct(id);
    await ctx.replyWithMarkdown(fmt.formatProductDetail(product));
  } catch (err) {
    await ctx.reply(fmt.formatError(err.message));
  }
}

export async function handleBuy(ctx) {
  const parts = ctx.message.text.split(' ');
  const productId = parts[1];
  const currency = parts[2];
  if (!productId || !currency) return ctx.reply('Usage: /buy <product_id> <currency>');
  try {
    const purchase = await rapax.initiatePurchase({
      productId,
      currency,
      buyerWallet: null,
    });
    await ctx.replyWithMarkdown(fmt.formatPurchaseInitiated(purchase));
  } catch (err) {
    await ctx.reply(fmt.formatError(err.message));
  }
}

export async function handleStatus(ctx) {
  const transactionId = ctx.message.text.split(' ')[1];
  if (!transactionId) return ctx.reply('Usage: /status <transaction_id>');
  try {
    const status = await rapax.getPurchaseStatus(transactionId);
    await ctx.replyWithMarkdown(fmt.formatPurchaseStatus(status));
  } catch (err) {
    await ctx.reply(fmt.formatError(err.message));
  }
}

// ── Operator handlers — gated by OPERATOR_CHAT_IDS ────────────
export async function handleOpProducts(ctx) {
  if (!isOperator(ctx)) return ctx.reply('Not authorized.');
  try {
    const products = await rapax.getAllProducts();
    await ctx.replyWithMarkdown(fmt.formatProductList(products));
  } catch (err) {
    await ctx.reply(fmt.formatError(err.message));
  }
}

export async function handleOpTransactions(ctx) {
  if (!isOperator(ctx)) return ctx.reply('Not authorized.');
  try {
    const txs = await rapax.getTransactions();
    await ctx.replyWithMarkdown(fmt.formatTransactionList(txs));
  } catch (err) {
    await ctx.reply(fmt.formatError(err.message));
  }
}

export async function handleOpDeliveries(ctx) {
  if (!isOperator(ctx)) return ctx.reply('Not authorized.');
  try {
    const deliveries = await rapax.getDeliveries();
    await ctx.replyWithMarkdown(fmt.formatDeliveryList(deliveries));
  } catch (err) {
    await ctx.reply(fmt.formatError(err.message));
  }
}

export async function handleOpLogs(ctx) {
  if (!isOperator(ctx)) return ctx.reply('Not authorized.');
  try {
    const logs = await rapax.getAuditLogs();
    const text = logs.map((l) => `${l.event_type} — ${l.created_at}`).join('\n') || 'No logs.';
    await ctx.reply(text);
  } catch (err) {
    await ctx.reply(fmt.formatError(err.message));
  }
}
