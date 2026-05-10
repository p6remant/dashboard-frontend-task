# Dashboard

A type-safe admin dashboard built with **React 19**, **Vite**, **TanStack Table v8**, **TanStack Query**, **ShadCN-style UI (Radix)**, **Tailwind CSS v4**, **Zod**, and **React Hook Form**. It combines an **inline-editable user grid** with a **read-only product catalog** (create/edit via modals), unified navigation, and **URL-driven global search**.

## Project overview

- **Users** (`/users`): TanStack Table with row-level edit/save/cancel, column metadata–driven cells, Zod validation, resize handles, department/status filters, debounced search, view/delete modals, add-user dialog.
- **Products** (`/products`): Sortable/filterable table, add/edit via **AddProductModal**, status badges, category/brand filters, debounced search.
- **Dashboard** (`/`): Summary cards fed by the same mock user query.
- **Data layer**: In-memory mock API in `src/lib/api.ts` (async delays, no real HTTP client).
- **UX**: Dark/light toggle, lazy routes + splash fallback, error boundary, **RetryCard** + `refetch` on query errors, shared **TableListSkeleton** for list pages.

## Tech stack

| Technology | Role |
|------------|------|
| React 19, TypeScript 5.7 | UI and types |
| Vite 5 | Dev server and production build |
| React Router 7 | Layout routes, `BrowserRouter`, `useSearchParams` |
| TanStack Query 5 | Server-state cache, mutations, invalidation |
| TanStack Table 8 | Sorting, filtering, pagination, column resize (users) |
| Tailwind CSS 4 + `@tailwindcss/postcss` | Styling (`src/index.css`) |
| Zod 3 | Row validation, add-user/add-product form schemas |
| React Hook Form + `@hookform/resolvers` | Modal forms |
| Radix UI (dialog, alert-dialog, select, switch, avatar, label, slot) | Accessible primitives |
| class-variance-authority, clsx, tailwind-merge | Variants and `cn()` |
| Lucide React | Icons |
| Sonner | Toasts |

There is **no Axios** dependency; the mock API uses plain async functions.

## Getting started

**Prerequisites:** Node.js 18+ (20+ recommended), pnpm (or npm/yarn).

```bash
cd dashboard
pnpm install
pnpm dev
```

App defaults to **http://localhost:5173** (see `vite.config.ts`).

```bash
pnpm build    # tsc && vite build
pnpm preview  # preview production build
pnpm lint     # eslint (ensure ESLint is configured in your environment)
```

## Project structure

```
dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── dashboard/          # Layout, Sidebar, Header (theme + global search)
│   │   ├── errorBoundary/      # AppErrorBoundary
│   │   ├── global-search/      # SearchDropdown, chips, sections, types
│   │   ├── modals/             # AddUser, AddProduct, DeleteUser, UserDetails
│   │   ├── skeleton/           # TableListSkeleton
│   │   ├── splash/             # SplashScreen (Suspense fallback)
│   │   ├── table/              # DataTable, EditableCell, toolbars, pagination, columns
│   │   ├── RetryCard.tsx
│   │   └── ui/                 # ShadCN-style components (button, table, dialog, …)
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useEditableTable.ts # Users: table + edit/rowState/errors + resizing
│   │   ├── useProductsTable.ts # Products: table only (meta for edit callback)
│   │   └── useTableState.ts    # Shared sorting, filters, pagination, globalFilter
│   ├── lib/
│   │   ├── api.ts              # Mock CRUD (users + products)
│   │   ├── formatters.ts
│   │   ├── utils.ts
│   │   ├── constants/          # sidebar, search, filters, products, table cell styles
│   │   └── validations/        # user, product, addUser, addProduct schemas
│   ├── mock/
│   │   ├── data.json           # Seed users
│   │   └── products.json       # Seed products
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── UserPage.tsx
│   │   └── ProductPage.tsx
│   ├── routes/
│   │   └── routes.ts           # Lazy route table (`/`, `/users`, `/products`)
│   ├── types/
│   │   └── index.ts            # User, Product, TableMeta, ProductsTableMeta
│   ├── App.tsx                 # QueryClient, Router, Layout, Suspense, Toaster
│   ├── main.tsx
│   └── index.css               # Tailwind v4 entry + theme tokens
├── index.html
├── vite.config.ts              # `@` → `./src`
├── tailwind.config.ts
├── package.json
├── README.md
└── DESIGN.md                   # Architecture and design decisions
```

Path alias: `@/` maps to `src/` (Vite `resolve.alias`).

## Key features

### Users table

- Column definitions in `userTableHeader.ts` with `meta`: `editable`, `type`, `required`, `userField`, `mutedLinkAccent`.
- **EditableCell** maps types: text, number, currency, phone, percentage, date, select, checkbox.
- **useEditableTable** + **useTableState**: sorting, column filters, debounced global filter (wired from `UserPage` with `useDebounce`), pagination, **column resizing**.
- Save path: `validateUser` → `updateUser` → invalidate `['users']`.
- Actions: view (modal), edit row, delete (confirm dialog), add user (modal).

### Products table

- **useProductsTable** + shared **useTableState** (no inline row edit).
- Columns in `productColumns.tsx`; edit opens **AddProductModal** in edit mode via table `meta.onEditProduct`.
- Create/update via **Zod** (`addProductSchema` / `productSchema`) and mutations.

### Global search (header)

- Search input syncs **`q`** in the URL (debounced); dropdown filters **mock** users/products by name (client-side).
- Category chips and section visibility; links respect current query string.

### Resilience and polish

- **AppErrorBoundary** wraps routed content.
- **Suspense** + **SplashScreen** while lazy chunks load.
- **RetryCard** on `useQuery` error for users/products with explicit refetch.

## Data flow (users)

1. `useQuery(['users'], fetchUsers)` loads mock data.
2. User clicks **Edit** → `handleEdit` sets `editingRowId` and `rowState`.
3. **DataTable** renders **EditableCell** in edit mode for that row; changes call `handleRowStateChange`.
4. **Save** → Zod `validateUser` → `updateUser` → toast + invalidate queries → edit mode cleared.
5. **Delete** → confirm in **DeleteModal** → `deleteUser` → invalidate.

## Customization pointers

- **New user column type**: extend `TableMeta` in `src/types/index.ts`, add formatter/parser in `lib/formatters.ts`, branch in `EditableCell.tsx`, rules in `lib/validations/userSchema.ts`.
- **Theme**: CSS variables in `src/index.css`; toggle applies `dark` on `document.documentElement` from **Header**.
- **Routes**: add a lazy entry in `src/routes/routes.ts` and a nav item in `src/lib/constants/sidebar.ts`.

## Documentation

See **[DESIGN.md](./DESIGN.md)** for architecture layers, validation pipeline, product vs user editing model, and extensibility notes.

## References

- [TanStack Table](https://tanstack.com/table/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com)
- [ShadCN UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Zod](https://zod.dev)

## License

MIT (or your chosen license).
