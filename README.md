# Talha E-Commerce Analytics Dashboard

A polished React + TypeScript analytics dashboard built as a portfolio project. It simulates a realistic e-commerce operation entirely in the browser with generated mock data — no backend, database, API, authentication, or external image server is required.

## Features

- Dashboard KPI cards calculated from generated order/customer data
- Revenue analytics with daily, weekly and monthly views
- Functional date-range filtering
- 60+ generated products with search, category filtering and sorting
- 150 generated customers with acquisition and geography visualizations
- 260 generated orders with search, status filtering, sorting and 10-row pagination
- Functional CSV export
- Dark/light theme persisted in localStorage
- Live clock and subtle simulated live updates
- Loading and empty states
- Responsive desktop, tablet and mobile layout
- Accessible controls and visible focus states
- Recharts visualizations
- No external data/API dependency

## Important: simulated random data

The data generator intentionally uses `Math.random()`. **A fresh scenario is generated on every page refresh**, so values can move up or down between refreshes. The relationships remain realistic: order amounts are derived from selected product prices, customer/order relationships are connected, and aggregate metrics are calculated from the generated records.

The app also performs a small, subtle simulated live update every few seconds. This is only a UI simulation and is not connected to a real store.

## Technology Stack

- React
- TypeScript
- Vite
- Recharts
- Lucide React
- Custom CSS
- Browser localStorage for theme preference

## Project Structure

```text
Talha_Ecommerce_Analytics_Dashboard/
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── UI.tsx
│   ├── data/
│   │   └── mockData.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Revenue.tsx
│   │   ├── Products.tsx
│   │   ├── Customers.tsx
│   │   └── Orders.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## Installation

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Deployment

### GitHub Pages

This project is configured with Vite's relative `base: './'`, so it works when hosted under a GitHub Pages repository path.

1. Create a GitHub repository.
2. Copy the complete project root into it.
3. Run `npm install`.
4. Run `npm run build`.
5. Publish the generated `dist/` folder with GitHub Pages (for example through GitHub Actions or your preferred Pages deployment workflow).

### Vercel

Import the repository into Vercel. The default Vite build settings work:

- Build command: `npm run build`
- Output directory: `dist`

## Mock Data

Every browser load generates:

- 67 products
- 150 customers
- 260 orders
- 45 revenue records

The dataset is generated locally and is not intended to represent real business data.

## Screenshots

Add portfolio screenshots here after deployment.

## Portfolio Purpose

This project demonstrates frontend architecture, TypeScript modeling, stateful UI, data visualization, filtering, sorting, pagination, CSV generation, responsive design, theme persistence, loading states and polished product-focused UI without requiring a backend.
