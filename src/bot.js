// ─────────────────────────────────────────────────────────────
//  RaPaX™ Telegram Bot — Entry Point
// ─────────────────────────────────────────────────────────────
import 'dotenv/config';
import { Telegraf } from 'telegraf';
import * as handlers from './handlers.js';
import { allCommands } from './commands.js';
import { startPoller } from './poller.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token || token.startsWith('replace_with')) {
  console.error('TELEGRAM_BOT_TOKEN is not set in .env — get one from @BotFather.');
  process.exit(1);
}

const bot = new Telegraf(token);

// Register command menu with Telegram
bot.telegram.setMyCommands(allCommands.map(({ command, description }) => ({ command, description })));

// Public commands
bot.start(handlers.handleStart);
bot.command('help', handlers.handleHelp);
bot.command('products', handlers.handleProducts);
bot.command('product', handlers.handleProduct);
bot.command('buy', handlers.handleBuy);
bot.command('status', handlers.handleStatus);

// Operator commands
bot.command('op_products', handlers.handleOpProducts);
bot.command('op_transactions', handlers.handleOpTransactions);
bot.command('op_deliveries', handlers.handleOpDeliveries);
bot.command('op_logs', handlers.handleOpLogs);

bot.catch((err, ctx) => {
  console.error(`Unhandled error for ${ctx.updateType}:`, err);
});

bot.launch().then(() => {
  console.log('RaPaX™ Telegram bot is running.');
  startPoller(bot);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
