export const isAckMessage = (text = '', keywords = []) => {
  const lower = (text || '').toLowerCase();
  return keywords.some(k => lower.includes(k));
};
export const extractTaskId = (text = '') => {
  const patterns = [
    /task[-_:\s]*([A-Za-z0-9._]+)/i,
    /ticket[-_:\s]*([A-Za-z0-9._]+)/i,
    /id[-_:=\s]*([A-Za-z0-9._]+)/i
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
};
export const todayTaskId = () => new Date().toISOString().slice(0,10);
