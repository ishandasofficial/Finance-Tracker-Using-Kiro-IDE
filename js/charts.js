/**
 * charts.js — Canvas-based chart rendering for Finance Tracker
 * No external dependencies; uses native Canvas 2D API.
 */

const CHART_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
  '#f97316', '#84cc16'
];

/**
 * Renders a horizontal bar chart for category expense breakdown.
 * @param {HTMLCanvasElement} canvas
 * @param {{ [category: string]: number }} breakdown
 */
function renderCategoryBarChart(canvas, breakdown) {
  const ctx = canvas.getContext('2d');
  const entries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (entries.length === 0) return;

  const padding = { top: 16, right: 24, bottom: 16, left: 110 };
  const barHeight = 28;
  const barGap = 12;
  const totalBars = entries.length;
  const chartHeight = totalBars * (barHeight + barGap) + padding.top + padding.bottom;

  // Resize canvas to fit content
  canvas.height = chartHeight;
  const chartWidth = canvas.width - padding.left - padding.right;

  const maxVal = entries[0][1];

  entries.forEach(([category, amount], i) => {
    const y = padding.top + i * (barHeight + barGap);
    const barWidth = maxVal > 0 ? (amount / maxVal) * chartWidth : 0;
    const color = CHART_COLORS[i % CHART_COLORS.length];

    // Bar
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(padding.left, y, barWidth, barHeight, 4);
    ctx.fill();

    // Category label
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-primary').trim() || '#1e293b';
    ctx.font = '13px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(category, padding.left - 8, y + barHeight / 2);

    // Amount label
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText(formatCurrency(amount), padding.left + barWidth + 6, y + barHeight / 2);
  });
}

/**
 * Renders a simple income vs expense comparison bar.
 * @param {HTMLCanvasElement} canvas
 * @param {{ income: number, expenses: number }} summary
 */
function renderIncomeExpenseChart(canvas, summary) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { income, expenses } = summary;
  const total = income + expenses;
  if (total === 0) return;

  const padding = { top: 20, right: 16, bottom: 40, left: 16 };
  const chartWidth = canvas.width - padding.left - padding.right;
  const barH = 32;
  const y = padding.top;

  // Income bar
  const incomeWidth = (income / total) * chartWidth;
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.roundRect(padding.left, y, incomeWidth, barH, [4, 0, 0, 4]);
  ctx.fill();

  // Expense bar
  const expenseWidth = (expenses / total) * chartWidth;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(padding.left + incomeWidth, y, expenseWidth, barH, [0, 4, 4, 0]);
  ctx.fill();

  // Labels
  ctx.font = '12px system-ui, sans-serif';
  ctx.textBaseline = 'top';

  ctx.fillStyle = '#10b981';
  ctx.textAlign = 'left';
  ctx.fillText(`Income ${formatCurrency(income)}`, padding.left, y + barH + 8);

  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'right';
  ctx.fillText(`Expenses ${formatCurrency(expenses)}`, padding.left + chartWidth, y + barH + 8);
}

/** Formats a number as currency string */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
