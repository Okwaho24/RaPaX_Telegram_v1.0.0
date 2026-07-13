# RaPaX™ Telegram Bot

Telegram client for the RaPaX™ Sovereign Digital Products Vending Machine.
Mirrors the RaPaX™ Discord bot's command surface — product browsing,
purchase initiation, status checks, and operator management — over Telegram.

## Architecture

```
src/
  bot.js          — entry point, registers commands, launches Telegraf
  rapaxClient.js  — API client (public + operator endpoints)
  handlers.js     — command handler logic
  commands.js     — command definitions (registered with @BotFather menu)
  messages.js     — Telegram message formatting (Markdown)
  poller.js        — periodic delivery-completion notifier
```

## Setup

1. Create a bot with [@BotFather](https://t.me/BotFather) on Telegram, get the token.
2. Copy `.env.example` to `.env` and fill in:
   - `TELEGRAM_BOT_TOKEN` — from BotFather
   - `RAPAX_API_URL` — your running RaPaX server's API base (e.g. `http://localhost:4000/api`)
   - `RAPAX_OPERATOR_SECRET` — must match the RaPaX server's `OPERATOR_SECRET`
   - `OPERATOR_CHAT_IDS` — your numeric Telegram chat ID(s), comma-separated, for operator command access and delivery notifications
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run:
   ```bash
   npm start
   ```

## Commands

**Public**
- `/start` — welcome message
- `/products` — list available products
- `/product <id>` — product detail
- `/buy <product_id> <currency>` — initiate a purchase
- `/status <transaction_id>` — check purchase/delivery status
- `/help` — command list

**Operator** (gated by `OPERATOR_CHAT_IDS`)
- `/op_products` — list all products including inactive
- `/op_transactions` — recent transactions
- `/op_deliveries` — recent deliveries
- `/op_logs` — recent audit logs

## Notes

- This bot is a thin client — all business logic (payment verification,
  fingerprinting via AcerbE™, delivery) lives in the RaPaX™ server.
  This bot only calls the server's existing API.
- No secrets are hardcoded. `.env` is gitignored — never commit it.
- Delivery poller notifies operator chats only for deliveries that
  complete *after* the bot starts, not historical ones (baseline
  established on first poll).

---
© Archer Chain Analytics™ — All Rights Reserved.
