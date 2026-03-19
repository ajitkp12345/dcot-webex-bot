import fs from 'fs';
import path from 'path';
export class FileStore {
  constructor({ dataDir = 'data' } = {}) {
    this.dataDir = dataDir;
    this.filePath = path.join(this.dataDir, 'store.json');
    if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
    if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, JSON.stringify({ rooms: {} }, null, 2));
  }
  _load() { return JSON.parse(fs.readFileSync(this.filePath, 'utf-8')); }
  _save(d) { fs.writeFileSync(this.filePath, JSON.stringify(d, null, 2)); }
  async ack(roomId, taskId, personEmail) {
    const d = this._load();
    d.rooms[roomId] = d.rooms[roomId] || { tasks: {} };
    const t = (d.rooms[roomId].tasks[taskId] = d.rooms[roomId].tasks[taskId] || { acknowledgedBy: [] });
    if (!t.acknowledgedBy.includes(personEmail)) t.acknowledgedBy.push(personEmail);
    this._save(d);
  }
  async getAcks(roomId, taskId) {
    const d = this._load();
    const t = d.rooms?.[roomId]?.tasks?.[taskId];
    return t?.acknowledgedBy || [];
  }
}
