import { FileStore } from './fileStore.js';
const singleton = { store: null };
export const getStore = (opts = {}) => {
  if (singleton.store) return singleton.store;
  singleton.store = new FileStore({ dataDir: opts.dataDir || 'data' });
  return singleton.store;
};
