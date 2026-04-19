/**
 * store.js — Data layer for Finance Tracker
 * All persistence via localStorage with in-memory fallback.
 */

const STORAGE_KEY = 'ft_transactions';

// In-memory fallback when localStorage is unavailable
let _memoryStore = null;

function _isLocalStorageAvailable() {
  try {
    localStorage.setItem('__ft_test__', '1');
    localStorage.removeItem('__ft_test__');
    return true;
  } catch {
    return false;
  }
}

function _read() {
  if (!_isLocalStorageAvailable()) {
    return _memoryStore || [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    // Corrupt data — reset
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function _write(transactions) {
  if (!_isLocalStorageAvailable()) {
    _memoryStore = transactions;
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    _memoryStore = transactions;
  }
}

/** Returns all stored transactions */
function getAllTransactions() {
  return _read();
}

/** Appends a new transaction and persists. Returns updated list. */
function addTransaction(transaction) {
  const list = _read();
  list.push(transaction);
  _write(list);
  return list;
}

/** Removes transaction by id and persists. Returns updated list. */
function deleteTransaction(id) {
  const list = _read().filter(t => t.id !== id);
  _write(list);
  return list;
}

/**
 * Returns transactions matching all non-empty filter criteria,
 * sorted by date descending.
 * @param {{ month: string, type: string, category: string }} filters
 */
function getTransactions(filters = {}) {
  let list = _read();

  if (filters.month) {
    list = list.filter(t => t.date.startsWith(filters.month));
  }
  if (filters.type) {
    list = list.filter(t => t.type === filters.type);
  }
  if (filters.category) {
    list = list.filter(t => t.category === filters.category);
  }

  return list.sort((a, b) => new Date(b.date) - new Date(a.date) || b.createdAt - a.createdAt);
}

/** Computes { balance, income, expenses } from all transactions */
function getSummary() {
  const list = _read();
  let income = 0;
  let expenses = 0;
  for (const t of list) {
    if (t.type === 'income') income += t.amount;
    else expenses += t.amount;
  }
  return { balance: income - expenses, income, expenses };
}

/** Returns expense totals per category: { [category]: totalAmount } */
function getCategoryBreakdown() {
  const list = _read();
  const breakdown = {};
  for (const t of list) {
    if (t.type === 'expense') {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    }
  }
  return breakdown;
}

/** Returns all unique categories present in stored transactions */
function getAllCategories() {
  const list = _read();
  return [...new Set(list.map(t => t.category))].sort();
}
