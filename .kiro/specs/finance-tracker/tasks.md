# Tasks: Finance Tracker

## Task List

- [x] 1. Project Scaffold
  - [x] 1.1 Create `index.html` with semantic structure (header, main sections for dashboard, form, history, insights)
  - [x] 1.2 Create `css/style.css` with CSS variables, reset, and responsive grid layout
  - [x] 1.3 Create `js/store.js` — localStorage data layer
  - [x] 1.4 Create `js/ui.js` — DOM rendering helpers
  - [x] 1.5 Create `js/charts.js` — Canvas chart renderer
  - [x] 1.6 Create `js/app.js` — main controller and event wiring

- [x] 2. Data Store (`js/store.js`)
  - [x] 2.1 Implement `getAllTransactions()` — reads and parses from localStorage with error handling
  - [x] 2.2 Implement `addTransaction(transaction)` — appends and persists
  - [x] 2.3 Implement `deleteTransaction(id)` — filters out and persists
  - [x] 2.4 Implement `getTransactions(filters)` — filters by month, type, category; sorts by date desc
  - [x] 2.5 Implement `getSummary()` — computes balance, income, expenses totals
  - [x] 2.6 Implement `getCategoryBreakdown()` — returns expense totals per category

- [x] 3. Transaction Form (`index.html` + `js/app.js`)
  - [x] 3.1 Build form HTML: amount input, type radio/select, category dropdown, date picker, note textarea, submit button
  - [x] 3.2 Implement dynamic category options that update when type changes (income vs expense categories)
  - [x] 3.3 Implement `validateTransaction(formData)` — returns array of error messages
  - [x] 3.4 Implement `handleAddTransaction()` — validates, builds transaction object, calls store, refreshes UI
  - [x] 3.5 Display inline validation errors and highlight invalid fields

- [x] 4. Dashboard Summary (`js/ui.js` + `js/app.js`)
  - [x] 4.1 Implement `renderDashboard(summary)` — updates balance, income, expense cards in DOM
  - [x] 4.2 Apply green/red color to balance based on positive/negative value

- [x] 5. Transaction History (`js/ui.js` + `js/app.js`)
  - [x] 5.1 Implement `renderHistoryList(transactions)` — renders each transaction as a list item with date, category badge, amount, type indicator, note, and delete button
  - [x] 5.2 Color-code income (green) vs expense (red) amounts
  - [x] 5.3 Build filter controls HTML: month input, type select, category select
  - [x] 5.4 Implement `handleFilterChange()` — reads filter values, calls `store.getTransactions(filters)`, re-renders list
  - [x] 5.5 Wire delete button click to `store.deleteTransaction(id)` and full UI refresh

- [x] 6. Insights Panel (`js/charts.js` + `js/ui.js`)
  - [x] 6.1 Implement `renderCategoryBarChart(breakdown)` — draws bar chart on `<canvas>` using Canvas API
  - [x] 6.2 Implement income vs expense comparison display (summary cards or simple visual bar)
  - [x] 6.3 Implement top spending category highlight
  - [x] 6.4 Show "No data yet" states when there are no expense transactions

- [x] 7. Initialization & Persistence
  - [x] 7.1 Implement `initApp()` — loads from localStorage, renders all panels, binds all event listeners
  - [x] 7.2 Handle localStorage unavailability (try/catch, fall back to in-memory array)
  - [x] 7.3 Handle corrupt JSON in localStorage (try/catch on parse, reset to empty array)

- [x] 8. Styling & Responsiveness (`css/style.css`)
  - [x] 8.1 Style dashboard summary cards (balance, income, expenses)
  - [x] 8.2 Style transaction form with clear labels and validation error states
  - [x] 8.3 Style history list items with category badges and color-coded amounts
  - [x] 8.4 Style insights panel and chart container
  - [x] 8.5 Implement responsive layout: stacked on mobile (≤768px), side-by-side on desktop
  - [x] 8.6 Ensure all interactive elements meet 44x44px minimum touch target size
