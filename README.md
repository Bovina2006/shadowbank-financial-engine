# **ShadowBank – Financial Risk & Wealth Erosion Modeling System**

ShadowBank is a web-based financial simulation system that models long-term wealth erosion using deterministic financial projections. The platform evaluates inflation impact, opportunity cost, recurring liabilities, and behavioral spending patterns to generate a Financial Health Score and risk classification.

## **Core Functionality**

* Multi-factor financial modeling (inflation at 6%, opportunity cost at 8%)
* Debt-to-income and credit-score–based risk scoring algorithm
* Long-term projection of subscriptions, EMI, loan liabilities, and micro-transaction leakage
* Persistent monthly financial logs using Firestore
* Email-verified authentication with Firebase Auth
* Interactive wealth breakdown visualization (Chart.js)

## **Tech Stack**

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
* **Backend:** Firebase Authentication + Firestore (NoSQL)
* **Visualization:** Chart.js

## **System Design**

User authentication is handled via Firebase Auth with enforced email verification.
Financial data is processed client-side through structured projection formulas and stored securely in Firestore under user-specific collections for longitudinal tracking.
