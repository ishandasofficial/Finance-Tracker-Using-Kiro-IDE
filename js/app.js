/**
 * app.js — Main controller for Finance Tracker
 * Wires events, validates input, and coordinates store ↔ UI.
 */

// Current active filters
let currentFilters = { month: '', type: '', category: '' };

/** Generates a unique ID for a transaction */
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * Validates transaction form data.
 * @returns {Array<{field: string, message: string}>} errors array
 */
function validateTransaction(data) {
  const errors = [];

  if (!data.amount || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
    errors.push({ field: 'form-amount', message: 'Enter a valid positive amount.' });
  }
  if (!data.type) {
    errors.push({ field: 'form-type-group', message: 'Select a transaction type.' });
  }
  if (!data.category) {
    errors.push({ field: 'form-category', message: 'Select a category.' });
  }
  if (!data.date) {
    errors.push({ field: 'form-date', message: 'Select a date.' });
  }

  return errors;
}

/** Reads form values and returns a plain object */
function getFormData() {
  return {
    amount: document.getElementById('form-amount').value.trim(),
    type: document.querySelector('input[name="type"]:checked')?.value || '',
    category: document.getElementById('form-category').value,
    date: document.getElementById('form-date').value,
    note: document.getElementById('form-note').value.trim()
  };
}

/** Refreshes all UI panels from the store */
function refreshAll() {
  const summary = getSummary();
  const filtered = getTransactions(currentFilters);
  const breakdown = getCategoryBreakdown();
  const allCategories = getAllCategories();

  renderDashboard(summary);
  renderHistoryList(filtered, handleDelete);
  renderInsights(breakdown, summary);
  updateCategoryFilter(allCategories);
}

/** Handles form submission */
function handleAddTransaction(e) {
  e.preventDefault();
  clearValidationErrors();

  const data = getFormData();
  const errors = validateTransaction(data);

  if (errors.length > 0) {
    showValidationErrors(errors);
    return;
  }

  const transaction = {
    id: generateId(),
    type: data.type,
    amount: parseFloat(data.amount),
    category: data.category,
    date: data.date,
    note: data.note,
    createdAt: Date.now()
  };

  addTransaction(transaction);
  resetForm();
  refreshAll();
}

/** Handles transaction deletion */
function handleDelete(id) {
  deleteTransaction(id);
  refreshAll();
}

/** Handles any filter change */
function handleFilterChange() {
  currentFilters = {
    month: document.getElementById('filter-month').value,
    type: document.getElementById('filter-type').value,
    category: document.getElementById('filter-category').value
  };
  const filtered = getTransactions(currentFilters);
  renderHistoryList(filtered, handleDelete);
}

/** Handles type radio change — updates category dropdown */
function handleTypeChange(e) {
  updateCategoryOptions(e.target.value);
}

/** Clears all filters */
function handleClearFilters() {
  document.getElementById('filter-month').value = '';
  document.getElementById('filter-type').value = '';
  document.getElementById('filter-category').value = '';
  currentFilters = { month: '', type: '', category: '' };
  renderHistoryList(getTransactions({}), handleDelete);
}

/** Initializes the app */
function initApp() {
  // Set default date to today
  const dateInput = document.getElementById('form-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Set default category options (expense is default type)
  updateCategoryOptions('expense');

  // Bind form submit
  const form = document.getElementById('transaction-form');
  if (form) form.addEventListener('submit', handleAddTransaction);

  // Bind type radio change
  document.querySelectorAll('input[name="type"]').forEach(radio => {
    radio.addEventListener('change', handleTypeChange);
  });

  // Bind filter controls
  document.getElementById('filter-month')?.addEventListener('change', handleFilterChange);
  document.getElementById('filter-type')?.addEventListener('change', handleFilterChange);
  document.getElementById('filter-category')?.addEventListener('change', handleFilterChange);
  document.getElementById('clear-filters-btn')?.addEventListener('click', handleClearFilters);

  // Initial render
  refreshAll();
}

document.addEventListener('DOMContentLoaded', initApp);
