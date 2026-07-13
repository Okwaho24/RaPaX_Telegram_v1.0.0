// ─────────────────────────────────────────────────────────────
//  RaPaX™ Telegram Bot — Delivery Poller
//  Periodically checks for newly completed deliveries and
//  notifies configured operator chat(s). Mirrors the Discord
//  bot's poller.js pattern.
// ─────────────────────────────────────────────────────────────
import 'dotenv/config';
import * as rapax from './rapaxClient.js';

const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '15000', 10);
const OPERATOR_CHAT_IDS = (process.env.OPERATOR_CHAT_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

let _seenTransactionIds = new Set();
let _baselineEstablished = false;
let _bot = null;

export function startPoller(botInstance) {
  _bot = botInstance;
  setInterval(pollDeliveries, POLL_INTERVAL_MS);
  console.log(`Delivery poller started — interval ${POLL_INTERVAL_MS}ms.`);
}

async function pollDeliveries() {
  if (!OPERATOR_CHAT_IDS.length) return; // nothing to notify, skip silently

  try {
    const deliveries = await rapax.getDeliveries(20);

    if (!_baselineEstablished) {
      // First run: record existing deliveries as a baseline, don't notify.
      deliveries.forEach((d) => _seenTransactionIds.add(d.transaction_id));
      _baselineEstablished = true;
      return;
    }

    for (const d of deliveries) {
      if (_seenTransactionIds.has(d.transaction_id)) continue;
      _seenTransactionIds.add(d.transaction_id);

      const message = `✅ New delivery confirmed\nTransaction: \`${d.transaction_id}\``;
      for (const chatId of OPERATOR_CHAT_IDS) {
        if (_bot) {
          _bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' }).catch(() => {});
        }
      }
    }
  } catch (err) {
    console.error('Poller error:', err.message);
  }
}
