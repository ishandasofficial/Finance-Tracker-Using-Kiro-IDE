# Requirements Document: Finance Tracker

## Introduction

This document defines the functional and non-functional requirements for the Finance Tracker frontend — a client-side web application built with HTML, CSS, and vanilla JavaScript. Data is persisted in `localStorage`. No backend is required for this phase.

---

## Requirements

### 1. Transaction Management

#### 1.1 Add Transaction

**User Story**: As a user, I want to add a new transaction so that I can record my income and expenses.

**Acceptance Criteria**:
- The app MUST provide a form with fields: amount, type (income/expense), category, date, and an optional note
- When the user submits the form with valid data, a new transaction MUST be saved to `localStorage`
- The dashboard summary MUST update immediately after a transaction is added
- The transaction history list MUST update immediately after a transaction is added
- The form MUST reset to its default state after a successful submission

#### 1.2 Validate Transaction Input

**User Story**: As a user, I want to be informed of invalid inputs so that I don't accidentally save bad data.

**Acceptance Criteria**:
- The app MUST reject submissions where `amount` is not a positive number greater than 0
- The app MUST reject submissions where `type` is not selected
- The app MUST reject submissions where `category` is empty or not selected
- The app MUST reject submissions where `date` is empty
- Validation errors MUST be displayed inline next to the relevant field
- Invalid fields MUST be visually highlighted (e.g., red border)

#### 1.3 Categorize Transactions

**User Story**: As a user, I want to assign a category to each transaction so that I can organize my finances.

**Acceptance Criteria**:
- The app MUST provide a predefined list of categories for income (e.g., Salary, Freelance, Investment, Gift, Other)
- The app MUST provide a predefined list of categories for expenses (e.g., Food, Rent, Transport, Entertainment, Health, Shopping, Utilities, Other)
- The category dropdown MUST update its options based on the selected transaction type
- Each transaction MUST be stored with its assigned category

#### 1.4 Delete Transaction

**User Story**: As a user, I want to delete a transaction so that I can correct mistakes.

**Acceptance Criteria**:
- Each transaction in the history list MUST have a delete button
- Clicking delete MUST remove the transaction from `localStorage`
- The dashboard summary MUST update immediately after deletion
- The history list MUST update immediately after deletion
- The insights panel MUST update immediately after deletion

---

### 2. Dashboard Summary

#### 2.1 Display Balance

**User Story**: As a user, I want to see my current balance at a glance so that I know my financial position.

**Acceptance Criteria**:
- The dashboard MUST display the current balance (total income minus total expenses)
- The balance MUST be displayed prominently at the top of the page
- The balance MUST reflect all stored transactions at all times
- A positive balance MUST be displayed in green; a negative balance MUST be displayed in red

#### 2.2 Display Income and Expense Totals

**User Story**: As a user, I want to see my total income and total expenses separately so that I can understand my cash flow.

**Acceptance Criteria**:
- The dashboard MUST display total income as a separate summary card
- The dashboard MUST display total expenses as a separate summary card
- Both totals MUST update in real time after any transaction is added or deleted

---

### 3. Transaction History

#### 3.1 View Transaction History

**User Story**: As a user, I want to see a list of all my transactions so that I can review my financial activity.

**Acceptance Criteria**:
- The history panel MUST display all stored transactions
- Each transaction entry MUST show: date, category (as a badge), amount, type indicator, and optional note
- Income transactions MUST be visually distinguished from expense transactions (e.g., green vs red amount)
- Transactions MUST be sorted by date in descending order (most recent first) by default

#### 3.2 Filter History by Date

**User Story**: As a user, I want to filter transactions by month so that I can review a specific time period.

**Acceptance Criteria**:
- The history panel MUST provide a month/year filter control
- Selecting a month MUST update the history list to show only transactions from that month
- Clearing the filter MUST restore the full transaction list
- The filter MUST work in combination with type and category filters

#### 3.3 Filter History by Type and Category

**User Story**: As a user, I want to filter transactions by type and category so that I can focus on specific spending areas.

**Acceptance Criteria**:
- The history panel MUST provide a type filter (All / Income / Expense)
- The history panel MUST provide a category filter dropdown
- Filters MUST be combinable (e.g., show only "Food" expenses in "July 2025")
- The history list MUST update immediately when any filter changes

---

### 4. Spending Insights

#### 4.1 Category Breakdown Chart

**User Story**: As a user, I want to see a breakdown of my expenses by category so that I can identify where I spend the most.

**Acceptance Criteria**:
- The insights panel MUST display a bar chart showing expense totals per category
- The chart MUST use the native Canvas API (no external charting library)
- The chart MUST update when transactions are added or deleted
- If there are no expense transactions, the chart MUST display a "No expense data yet" message

#### 4.2 Income vs Expense Comparison

**User Story**: As a user, I want to compare my income against my expenses so that I can assess my savings rate.

**Acceptance Criteria**:
- The insights panel MUST display a visual comparison of total income vs total expenses
- The comparison MUST clearly indicate whether the user is in surplus or deficit
- The comparison MUST update in real time after any transaction change

#### 4.3 Top Spending Category

**User Story**: As a user, I want to know my top spending category so that I can focus on reducing it.

**Acceptance Criteria**:
- The insights panel MUST highlight the category with the highest total expense amount
- If there are no expense transactions, this section MUST display "No data yet"
- The top category MUST update after any transaction change

---

### 5. Data Persistence

#### 5.1 Persist Transactions in localStorage

**User Story**: As a user, I want my transactions to be saved so that they are still available when I reload the page.

**Acceptance Criteria**:
- All transactions MUST be saved to `localStorage` under a consistent key (e.g., `ft_transactions`)
- On page load, the app MUST read from `localStorage` and restore all previously saved transactions
- All UI panels (dashboard, history, insights) MUST reflect the restored data on load

#### 5.2 Handle localStorage Errors Gracefully

**User Story**: As a user, I want the app to still work even if storage is unavailable so that I don't lose my session.

**Acceptance Criteria**:
- If `localStorage` is unavailable, the app MUST fall back to an in-memory store for the session
- If stored JSON data is corrupt, the app MUST reset the store to an empty array and continue functioning
- The app MUST NOT crash or show a blank screen due to storage errors

---

### 6. UI and Accessibility

#### 6.1 Responsive Layout

**User Story**: As a user, I want the app to work on both desktop and mobile so that I can use it anywhere.

**Acceptance Criteria**:
- The layout MUST be responsive and usable on screen widths from 320px to 1920px
- On mobile, the layout MUST stack vertically; on desktop, panels MAY be displayed side by side
- All interactive elements MUST be large enough to tap on mobile (minimum 44x44px touch target)

#### 6.2 Safe DOM Rendering

**User Story**: As a developer, I want user-provided data to be rendered safely so that the app is not vulnerable to XSS.

**Acceptance Criteria**:
- All user-provided text (notes, amounts) MUST be inserted into the DOM using `textContent`, not `innerHTML`
- Category and type values MUST be validated against a whitelist before rendering
