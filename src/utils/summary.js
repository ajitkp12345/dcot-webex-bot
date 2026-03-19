export const formatSummary = ({ taskId, acknowledged = [], pending = [] }) => {
  const lines = [];
  lines.push(`📊 Task Acknowledgement Summary (task: ${taskId})`);
  lines.push('');
  if (acknowledged.length) {
    lines.push('✅ Completed:'); acknowledged.forEach(u => lines.push(`• ${u}`)); lines.push('');
  } else { lines.push('✅ Completed: (none)'); }
  if (pending.length) {
    lines.push('❌ Pending:'); pending.forEach(u => lines.push(`• ${u}`));
  } else { lines.push('❌ Pending: (none)'); }
  return lines.join('\n');
};
