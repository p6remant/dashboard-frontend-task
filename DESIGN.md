# Dashboard — design and architecture

This document describes how the dashboard is structured today: two primary domains (users and products), shared table infrastructure, mock data, and UI patterns.

## Philosophy

1. **Separation of concerns** — Pages orchestrate data (TanStack Query) and UI state; hooks own table configuration; cells and modals stay focused.
2. **Type safety** — TypeScript at boundaries; Zod for runtime validation on save and on modal submit.
3. **Headless table logic** — TanStack Table for sorting, filtering, pagination, and (on users) column resize without locking layout to a specific table kit.
4. **Progressive complexity** — Users get full inline editing; products stay simpler (modal-based CRUD on a read-only grid).

## Architectural layers

```
┌─────────────────────────────────────────────┐
│  Shell: Layout, Sidebar, Header           │
│  (routing, theme, URL search `q`)         │
├─────────────────────────────────────────────┤
│  Pages: Dashboard, User, Product          │
│  (queries, mutations, modals, toolbars)   │
├─────────────────────────────────────────────┤
│  Table UI: DataTable, ProductsListTable,  │
│  EditableCell, toolbars, pagination        │
├─────────────────────────────────────────────┤
│  Hooks: useEditableTable, useProductsTable,│
│  useTableState, useDebounce                │
├─────────────────────────────────────────────┤
│  Data: TanStack Query + lib/api mock       │
├─────────────────────────────────────────────┤
│  Utils: formatters, validations, cn,      │
│  constants (filters, sidebar, search)    │
└─────────────────────────────────────────────┘
```

**App shell** (`App.tsx`): `QueryClientProvider`, `BrowserRouter`, `AppErrorBoundary`, `Suspense` (fallback: `SplashScreen`), nested routes under `Layout`, `Sonner` toaster, catch-all redirect to `/`.

**Routing** (`routes/routes.ts`): lazy-loaded page components for `/`, `/users`, `/products` to keep initial bundle small.

## Two table modes

### Users — inline editing

- **useEditableTable** composes **useReactTable** with `useTableState` and local state: `editingRowId`, `rowState`, `errors`, optional **columnSizing** / resize handlers.
- **DataTable** receives the table instance and callbacks: `onEdit`, `onSave`, `onCancel`, `onView`, `onDelete`, `onRowStateChange`, plus loading flags for save/delete per row.
- Row actions: outline **Button**s; edit mode swaps to save/cancel.
- Validation runs on **save** via `validateUser` (`userSchema`); field errors map to `EditableCell` by column id / `userField` meta.

### Products — display + modal CRUD

- **useProductsTable** only wires TanStack Table + `useTableState`; no edit row state in the hook.
- **ProductsListTable** renders read-only cells and uses **table.options.meta** (`ProductsTableMeta`) to expose `onEditProduct` from the page.
- Create and update go through **AddProductModal** + `createProduct` / `updateProduct`; Zod schemas align form fields with the `Product` type.

This split avoids stretching `EditableCell` to every entity and keeps product rules in one modal form.

## Column metadata (`TableMeta`)

Defined in `src/types/index.ts` and consumed by **EditableCell**:

| Field | Purpose |
|--------|---------|
| `editable` | Cell can show input when row is editing |
| `type` | `text` \| `number` \| `currency` \| `date` \| `select` \| `checkbox` \| `phone` \| `percentage` |
| `required` | Used with validation / UX |
| `userField` | Map column to a `User` key when id differs (e.g. status column) |
| `mutedLinkAccent` | Subtle link styling for display mode (e.g. email) |

Product columns use standard `accessorKey` / `cell` renderers and **StatusBadge** for `active`.

## Validation pipeline

```
Inline row (users)
  Input → rowState → Save → validateUser(Zod) → updateUser → invalidateQueries

Modal (users / products)
  RHF → resolver/schema → mutate → invalidateQueries → toast
```

- Row errors clear as the user edits (`setErrors` / field updates from the page hook usage).
- Add flows use dedicated schemas: `addUserSchema`, `addProductSchema` (and related types) where enums or refinements differ from full entity updates.

## Mock API (`lib/api.ts`)

- **structuredClone** of `mock/data.json` and `mock/products.json` into mutable in-memory arrays.
- Shared `delay(ms)` simulates latency on every call.
- **Users**: `fetchUsers`, `updateUser`, `deleteUser`, `createUser`.
- **Products**: `fetchProducts`, `createProduct`, `updateProduct`.

No network stack dependency: easy swap for `fetch` to a real backend keeping the same function signatures.

## Global search

- Implemented in **Header** with `useSearchParams`: debounced writes to `q`.
- Dropdown uses static copies of mock JSON (not the live store), filtered by name; category chips narrow which sections appear.
- Constants such as debounce/exit timing live in `lib/constants/search.ts`.

Trade-off: search results can diverge from table data until a refresh strategy is added; acceptable for a demo shell.

## Shared table state (`useTableState`)

Single hook for **sorting**, **columnFilters**, **globalFilter**, **pagination** updaters. **useEditableTable** and **useProductsTable** both consume it so toolbar and pagination behave consistently across pages.

## Styling

- **Tailwind CSS v4** with PostCSS (`@tailwindcss/postcss`), design tokens in `index.css`, `tailwind-merge` + `cn()` in components.
- **Dark mode**: `dark` class on `document.documentElement`; components use `dark:` variants.

## Error and loading UX

- **AppErrorBoundary**: catches render errors in the tree below the router layout.
- **Suspense** + **SplashScreen**: route-level lazy loading.
- **TableListSkeleton**: shared placeholder while user/product lists load.
- **RetryCard**: surfaces query errors with a refetch action on list pages.

## Extensibility

1. **New list page** — Add route, page with `useQuery` + `useTableState` (or a new hook), toolbar, `TablePagination`, skeleton/error card as needed.
2. **New user column** — Extend `User`, JSON seed, `userTableHeader` meta, `EditableCell`, `userSchema`, and optionally `lib/constants/tableFilters.ts`.
3. **Real API** — Replace bodies of `lib/api.ts` exports with HTTP calls; keep return types identical so pages stay unchanged.

## Design decisions

| Topic | Choice | Rationale |
|--------|--------|------------|
| User vs product editing | Inline vs modal | Rich grid editing for users; faster product screen without cell editors |
| Mock store | Module-level arrays | Simple, no DB; mirrors CRUD mental model |
| URL `q` | Synced search | Sharable/bookmarkable search state from the header |
| Lazy routes | Yes | Smaller first paint; explicit loading state |
| Column resize | Users only | Dense HR-style grid; products table stays lighter |

## Performance notes

- Column defs and meta objects should stay **memoized** on pages (`useMemo`) to avoid resetting TanStack Table state each render.
- **Debounced** table search (e.g. 300ms) reduces filter churn on large client-side rows.
- Pagination limits rows in the DOM; global filter runs on the current page’s model per TanStack configuration (see page + hook wiring).

## Testing (not yet in repo)

Suggested direction: Vitest + Testing Library for `validateUser` / product schemas, `EditableCell` view vs edit, and mutation + invalidation behavior behind mocked `lib/api`.

---

This file is the canonical place for **why** the code is shaped as it is; **README.md** covers **what** is in the repo and how to run it.
