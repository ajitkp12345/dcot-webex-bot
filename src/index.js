import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import Framework from 'webex-node-bot-framework';
import axios from 'axios';

import { config } from './config.js';
import { logger } from './logger.js';
import { getStore } from './services/ackStore.js';
import { isAckMessage, extractTaskId, todayTaskId } from './utils/parser.js';
import { formatSummary } from './utils/summary.js';

const app = express();
app.use(bodyParser.json());

const framework = new Framework({
  token: config.BOT_TOKEN,
  webhookUrl: config.WEBHOOK_URL,
  removeWebhooksOnStart: false
});

const store = getStore({ dataDir: config.DATA_DIR });

function resolveTaskId(text) {
  if (config.DEFAULT_TASK_MODE === 'static') return config.DEFAULT_STATIC_TASK_ID;
  return extractTaskId(text) || todayTaskId();
}

async function listRoomMemberEmails(roomId) {
  const res = await axios.get('https://webexapis.com/v1/memberships', {
    params: { roomId },
    headers: { Authorization: `Bearer ${config.BOT_TOKEN}` }
  });
  const emails = new Set();
  for (const m of res.data.items || []) {
    if (m.personEmail && !m.personEmail.endsWith('@webex.bot')) emails.add(m.personEmail);
  }
  return Array.from(emails).sort();
}

async function postMessage(roomId, text) {
  try {
    await axios.post('https://webexapis.com/v1/messages', { roomId, text }, {
      headers: { Authorization: `Bearer ${config.BOT_TOKEN}` }
    });
  } catch (e) {
    logger.error(`Failed to post message: ${e.response?.data?.message || e.message}`);
  }
}

framework.on('initialized', () => logger.info('🤖 Webex ACK Bot initialized.'));

framework.on('messageCreated', async (trigger, message) => {
  try {
    const roomId = trigger.roomId;
    const text = message?.text || '';
    const personEmail = message?.personEmail || 'unknown@local';
    if (personEmail.endsWith('@webex.bot')) return;

    const mentionedBot = (message.mentionedPeople || []).some(p => p === framework.person.id);

    const lower = text.toLowerCase().trim();
    if (mentionedBot || trigger.roomType === 'direct') {
      if (lower.includes('help')) {
        return postMessage(roomId, [
          '🛠️ *Commands*',
          '- `ack <taskId?>` – Acknowledge current or specified task',
          '- `summary [<taskId>]` – Show task summary',
          '- `status [<taskId>]` – Alias for summary',
          '- `help` – This help message'
        ].join('\\n'));
      }
      if (lower.startsWith('ack')) {
        const tid = resolveTaskId(text);
        await store.ack(roomId, tid, personEmail);
        return postMessage(roomId, `✅ ACK recorded for **${personEmail}** (task: ${tid}).`);
      }
      if (lower.startsWith('summary') || lower.startsWith('status')) {
        const tid = resolveTaskId(text);
        const members = await listRoomMemberEmails(roomId);
        const acks = await store.getAcks(roomId, tid);
        const pending = members.filter(m => !acks.includes(m));
        const summary = formatSummary({ taskId: tid, acknowledged: acks, pending });
        return postMessage(roomId, summary);
      }
    }

    if (isAckMessage(text, config.ACK_KEYWORDS)) {
      const tid = resolveTaskId(text);
      await store.ack(roomId, tid, personEmail);
      logger.info(`ACK via keywords: ${personEmail} (task ${tid})`);
    }
  } catch (e) {
    logger.error(`messageCreated handler error: ${e.stack || e.message}`);
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.post('/webhook', framework.webhookHandler);

app.listen(config.PORT, () => logger.info(`HTTP server listening on :${config.PORT}`));
