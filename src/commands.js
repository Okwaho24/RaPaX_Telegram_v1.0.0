// ─────────────────────────────────────────────────────────────
//  RaPaX™ Telegram Bot — Command List
//  Used to register bot commands with Telegram's BotFather menu.
// ─────────────────────────────────────────────────────────────

export const publicCommands = [
  { command: 'start', description: 'Show welcome message and available commands' },
  { command: 'products', description: 'List all available products' },
  { command: 'product', description: 'Get details for a specific product — /product <id>' },
  { command: 'buy', description: 'Start a purchase — /buy <product_id> <currency>' },
  { command: 'status', description: 'Check purchase status — /status <transaction_id>' },
  { command: 'help', description: 'Show help' },
];

export const operatorCommands = [
  { command: 'op_products', description: '[Operator] List all products including inactive' },
  { command: 'op_transactions', description: '[Operator] Recent transactions' },
  { command: 'op_deliveries', description: '[Operator] Recent deliveries' },
  { command: 'op_logs', description: '[Operator] Recent audit logs' },
];

export const allCommands = [...publicCommands, ...operatorCommands];
