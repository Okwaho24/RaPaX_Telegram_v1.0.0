// ─────────────────────────────────────────────────────────────
//  RaPaX™ Telegram Bot — Message Formatting
//  Telegram equivalent of Discord's embeds.js — plain formatted
//  text + inline keyboards instead of rich embeds.
// ─────────────────────────────────────────────────────────────

export function formatProductList(products) {
  if (!products.length) return 'No products currently available.';
  return products
    .map((p, i) => `${i + 1}. *${p.name}*\n   ${p.price} ${p.currency || ''}\n   ID: \`${p.id}\``)
    .join('\n\n');
}

export function formatProductDetail(product) {
  return (
    `*${product.name}*\n\n` +
    `${product.description || 'No description.'}\n\n` +
    `Price: ${product.price} ${product.currency || ''}\n` +
    `ID: \`${product.id}\``
  );
}

export function formatPurchaseInitiated(purchase) {
  return (
    `*Purchase Initiated*\n\n` +
    `Transaction ID: \`${purchase.transaction_id}\`\n` +
    `Amount: ${purchase.amount} ${purchase.currency}\n` +
    `Send payment to: \`${purchase.payment_address}\`\n\n` +
    `Use /status ${purchase.transaction_id} to check delivery.`
  );
}

export function formatPurchaseStatus(status) {
  return (
    `*Purchase Status*\n\n` +
    `Transaction: \`${status.transaction_id}\`\n` +
    `Status: *${status.status}*\n` +
    (status.download_url ? `\nDownload: ${status.download_url}` : '')
  );
}

export function formatTransactionList(transactions) {
  if (!transactions.length) return 'No transactions found.';
  return transactions
    .map(
      (t) =>
        `\`${t.transaction_id}\` — ${t.status} — ${t.amount} ${t.currency}`
    )
    .join('\n');
}

export function formatDeliveryList(deliveries) {
  if (!deliveries.length) return 'No deliveries found.';
  return deliveries
    .map((d) => `\`${d.transaction_id}\` — ${d.delivered_at || 'pending'}`)
    .join('\n');
}

export function formatError(message) {
  return `⚠️ Error: ${message}`;
}
