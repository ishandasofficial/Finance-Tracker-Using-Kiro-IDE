/**
 * ui.js — DOM rendering helpers for Finance Tracker
 * All user data inserted via textContent (XSS-safe).
 */

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Other'];

/** Formats a number as INR currency */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
}

/** Formats ISO date string to readable format */
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Updates the dashboard summary cards.
 * @param {{ balance: number, income: number, expenses: number }} summary
 */
function renderDashboard(summary) {
  const balanceEl = document.getElementById('balance-amount');
  const incomeEl = document.getElementById('income-amount');
  const expenseEl = document.getElementById('expense-amount');

  if (!balanceEl) return;

  balanceEl.textContent = formatCurrency(summary.balance);
  balanceEl.className = 'summary-value ' + (summary.balance >= 0 ? 'positive' : 'negative');

  incomeEl.textContent = formatCurrency(summary.income);
  expenseEl.textContent = formatCurrency(summary.expenses);
}

/**
 * Renders the transaction history list.
 * @param {Array} transactions
 * @param {Function} onDelete - callback(id)
 */
function renderHistoryList(transactions, onDelete) {
  const container = document.getElementById('history-list');
  if (!container) return;

  container.innerHTML = '';

  if (transactions.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No transactions found.';
    container.appendChild(empty);
    return;
  }

  transactions.forEach(t => {
    const item = document.createElement('div');
    item.className = 'transaction-item';
    item.dataset.id = t.id;

    // Left: icon + info
    const left = document.createElement('div');
    left.className = 'transaction-left';

    const icon = document.createElement('span');
    icon.className = 'transaction-icon ' + t.type;
    icon.textContent = t.type === 'income' ? '↑' : '↓';

    const info = document.createElement('div');
    info.className = 'transaction-info';

    const catBadge = document.createElement('span');
    catBadge.className = 'category-badge';
    catBadge.textContent = t.category;

    const dateEl = document.createElement('span');
    dateEl.className = 'transaction-date';
    dateEl.textContent = formatDate(t.date);

    info.appendChild(catBadge);
    if (t.note) {
      const note = document.createElement('span');
      note.className = 'transaction-note';
      note.textContent = t.note;
      info.appendChild(note);
    }
    info.appendChild(dateEl);

    left.appendChild(icon);
    left.appendChild(info);

    // Right: amount + delete
    const right = document.createElement('div');
    right.className = 'transaction-right';

    const amount = document.createElement('span');
    amount.className = 'transaction-amount ' + t.type;
    amount.textContent = (t.type === 'income' ? '+' : '-') + formatCurrency(t.amount);

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.setAttribute('aria-label', 'Delete transaction');
    delBtn.textContent = '×';
    delBtn.addEventListener('click', () => onDelete(t.id));

    right.appendChild(amount);
    right.appendChild(delBtn);

    item.appendChild(left);
    item.appendChild(right);
    container.appendChild(item);
  });
}

/**
 * Updates the category dropdown based on selected type.
 * @param {'income'|'expense'} type
 */
function updateCategoryOptions(type) {
  const select = document.getElementById('form-category');
  if (!select) return;

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  select.innerHTML = '<option value="">Select category</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

/**
 * Populates the category filter dropdown with all available categories.
 * @param {string[]} categories
 */
function updateCategoryFilter(categories) {
  const select = document.getElementById('filter-category');
  if (!select) return;

  const current = select.value;
  select.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    if (cat === current) opt.selected = true;
    select.appendChild(opt);
  });
}

/**
 * Displays validation errors on the form.
 * @param {string[]} errors
 */
function showValidationErrors(errors) {
  clearValidationErrors();
  errors.forEach(err => {
    const field = document.getElementById(err.field);
    if (field) {
      field.classList.add('input-error');
      const msg = document.createElement('span');
      msg.className = 'error-msg';
      msg.textContent = err.message;
      field.parentNode.appendChild(msg);
    }
  });
}

/** Clears all validation error states from the form */
function clearValidationErrors() {
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  document.querySelectorAll('.error-msg').forEach(el => el.remove());
}

/** Resets the transaction form to default state */
function resetForm() {
  const form = document.getElementById('transaction-form');
  if (form) form.reset();
  clearValidationErrors();
  // Reset category to expense default
  updateCategoryOptions('expense');
  // Reset type radio to expense
  const expenseRadio = document.getElementById('type-expense');
  if (expenseRadio) expenseRadio.checked = true;
}

/**
 * Renders the insights panel.
 * @param {{ [category: string]: number }} breakdown
 * @param {{ income: number, expenses: number }} summary
 */
function renderInsights(breakdown, summary) {
  // Top spending category
  const topCatEl = document.getElementById('top-category');
  const topAmtEl = document.getElementById('top-category-amount');
  const entries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

  if (topCatEl) {
    if (entries.length > 0) {
      topCatEl.textContent = entries[0][0];
      if (topAmtEl) topAmtEl.textContent = formatCurrency(entries[0][1]);
    } else {
      topCatEl.textContent = 'No data yet';
      if (topAmtEl) topAmtEl.textContent = '';
    }
  }

  // Category bar chart
  const catCanvas = document.getElementById('category-chart');
  if (catCanvas) {
    if (entries.length === 0) {
      const noData = document.getElementById('chart-no-data');
      if (noData) noData.style.display = 'block';
      catCanvas.style.display = 'none';
    } else {
      const noData = document.getElementById('chart-no-data');
      if (noData) noData.style.display = 'none';
      catCanvas.style.display = 'block';
      catCanvas.width = catCanvas.parentElement.clientWidth || 400;
      renderCategoryBarChart(catCanvas, breakdown);
    }
  }

  // Income vs expense chart
  const ieCanvas = document.getElementById('income-expense-chart');
  if (ieCanvas) {
    ieCanvas.width = ieCanvas.parentElement.clientWidth || 400;
    renderIncomeExpenseChart(ieCanvas, summary);
  }
}
