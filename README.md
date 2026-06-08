# expense-tracker-
expense tracking app with crud operations and the expense summary made in react native 



#  React Native Expense Tracker

A lightweight, mobile-first expense tracking application built with React Native and Expo. This project features a clean, highly optimized UI designed to help users efficiently log, manage, and visualize their daily financial transactions.

##  Features

**1. Add a New Expense**
* Dedicated form interface for logging transactions.
* Supports essential inputs: **Title**, **Amount**, **Category** (Food, Transport, Utilities, Entertainment, Other), **Date**, and optional **Notes**.
* Built-in data validation to ensure accurate financial tracking.

**2. View All Expenses**
* Clean, mobile-optimized list UI displaying all logged expenses.
* Transactions are automatically sorted chronologically (most recent first).
* High-contrast typography for quick readability of amounts and categories.

**3. Edit and Delete Actions**
* Full CRUD capabilities integrated directly into the list view.
* Accessible action buttons per item allowing users to instantly **Edit** details or **Delete** an existing expense.

**4. Financial Summary & Analytics**
* Dedicated summary dashboard providing a high-level financial overview.
* Displays the **Total Amount Spent** across all logs.
* Features an aggregated **Category-wise Breakdown** with visual indicators/progress bars to track spending limits.

##  Tech Stack

* **Framework:** React Native / Expo (SDK 55)
* **Language:** TypeScript for strict type safety and interface modeling.
* **Navigation:** Expo Router (File-based routing)
* **State Management:** Custom React State Hooks (`useExpenseStore`)
* **Architecture:** Modular, component-driven design

##  Project Structure

```text
expense-tracker/
├── app/                  # Application routing and screens
│   └── (tabs)/
│       ├── index.tsx     # Dashboard & Expense List Screen
│       └── two.tsx       # Expense Entry Form Screen
└── src/
    ├── components/       # Reusable UI (Cards, Inputs, Charts)
    ├── store/            # Global state engine
    ├── types/            # TypeScript interfaces & models
    └── utils/            # Helper functions (Currency/Date formatters)
