import 'dotenv/config';
const env = (k, d) => process.env[k] ?? d;
export const config = {
  BOT_TOKEN: env('BOT_TOKEN'),
  WEBHOOK_URL: env('WEBHOOK_URL'),
  PORT: parseInt(env('PORT', '3000'), 10),
  DEFAULT_TASK_MODE: env('DEFAULT_TASK_MODE', 'daily'),
  DEFAULT_STATIC_TASK_ID: env('DEFAULT_STATIC_TASK_ID', 'shift-1'),
  ACK_KEYWORDS: (env('ACK_KEYWORDS', 'ack,done,completed,finished,ok') || '').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean),
  SUMMARY_CRON: env('SUMMARY_CRON', ''),
  DATA_DIR: env('DATA_DIR', 'data'),
  MONGODB_URI: env('MONGODB_URI', '')
};
