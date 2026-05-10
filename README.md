# Dashboard

A lightweight admin dashboard built with **React 19**, **Vite**, **TanStack Table**, **TanStack Query**, **Tailwind CSS v4**, **Zod**, and **React Hook Form**.

The dashboard includes:

- Inline-editable users table
- Product management with modal-based CRUD
- Shared table infrastructure
- URL-based global search
- Dark/light theme support
- Mock API with local async data handling

---

## Demo URL

```txt
https://your-demo-url.com](https://dashboard-frontend-task-9hn9r6p59.vercel.app/
```

---

## Tech Stack

- React 19
- TypeScript
- Vite 5
- React Router 7
- TanStack Table 8
- TanStack Query 5
- Tailwind CSS 4
- Zod
- React Hook Form
- Radix UI
- Sonner
- Lucide React
- pnpm
  
---

## Prerequisites

- Node.js
- pnpm

---

## Setup

### 1. Clone Repository

#### HTTPS

```bash
git clone https://github.com/p6remant/dashboard-frontend-task.git
```

#### SSH

```bash
git@github.com:p6remant/dashboard-frontend-task.git
```

---

### 2. Install Dependencies

```bash
pnpm install
```

---

### 3. Run Development Server

```bash
pnpm dev
```

---

### 4. Build Application

```bash
pnpm build
```
---

## Project Structure

```txt
dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── dashboard/        Layout, sidebar, header
│   │   ├── errorBoundary/    App error boundary
│   │   ├── global-search/    Search dropdown and filters
│   │   ├── modals/           User and product modals
│   │   ├── skeleton/         Loading skeletons
│   │   ├── splash/           Splash screen
│   │   ├── table/            Tables, cells, pagination
│   │   └── ui/               Reusable UI components
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useEditableTable.ts
│   │   ├── useProductsTable.ts
│   │   └── useTableState.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── formatters.ts
│   │   ├── utils.ts
│   │   ├── constants/
│   │   └── validations/
│   ├── mock/
│   │   ├── data.json
│   │   └── products.json
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── UserPage.tsx
│   │   └── ProductPage.tsx
│   ├── routes/
│   │   └── routes.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── package.json
├── README.md
└── DESIGN.md
```

---

## Documentation

See `DESIGN.md` for detailed architecture, validation flow, table structure, and design decisions.

---

## License

MIT
