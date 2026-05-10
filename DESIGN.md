# Dashboard Design & Architecture

This dashboard is built around two main sections: **Users** and **Products**.  
The structure focuses on clean architecture, reusable components, and scalable state management.

---

# Core Principles

- Separate business logic from UI
- Reuse shared table infrastructure
- Keep TypeScript types strict and predictable
- Isolate complex features when necessary
- Make backend replacement easy in the future

---

# Project Structure

```txt
App Shell
  └── Layout, Sidebar, Header, Routing

Pages
  └── Dashboard, Users, Products
      └── UserDetailPage
      └── ProductDetailPage

Shared Components
  └── DataTable, EditableCell, Pagination, Modals

Hooks
  └── useEditableTable, useProductsTable, useTableState

Data Layer
  └── TanStack Query + Mock API

Utilities
  └── Validation, Constants, Helpers
```

Each layer has a single responsibility, making the app easier to maintain and extend.

---

# App Shell

The root application handles:

- routing
- lazy loading
- global providers
- error boundaries
- toast notifications

### Includes

- `QueryClientProvider`
- `BrowserRouter`
- `Suspense`
- `AppErrorBoundary`
- `Sonner`

Routes are lazy-loaded to improve initial load performance.

---

# Users Table — Inline Editing

The users table supports direct inline editing inside the grid.

## Features

- row editing
- save/cancel actions
- field validation
- row-level loading states
- optional column resizing

## Editing Flow

```txt
Edit Row
 → Update local state
 → Validate with Zod
 → Save through API
 → Refresh table data
```

## Architecture

### `useEditableTable`

Manages:

- TanStack Table setup
- editing state
- validation errors
- row state
- column sizing

### `DataTable`

Responsible for rendering the table UI and actions.

### `EditableCell`

Switches between:

- display mode
- input mode

Validation errors are mapped directly to related fields.

---

# Products Table — Modal CRUD

The products table keeps the grid simple and handles editing through modals.

## Features

- read-only table
- modal-based create/update
- lightweight UI

## Architecture

### `useProductsTable`

Handles:

- sorting
- filtering
- pagination
- table state

### `ProductsListTable`

Renders rows and triggers edit actions through table metadata.

### `AddProductModal`

Handles form validation and product mutations using:

- React Hook Form
- Zod

---

# Shared Table State

`useTableState` provides shared table behavior across pages.

## Shared Features

- sorting
- filtering
- pagination
- global search

This keeps all table interactions consistent.

---

# Column Metadata

Column metadata controls table behavior dynamically.

| Property | Purpose |
|---|---|
| `editable` | Enables editing |
| `type` | Input type |
| `required` | Required field indicator |
| `userField` | Maps column to user property |
| `mutedLinkAccent` | Subtle link styling |

This helps keep table cells reusable and generic.

---

# Validation

Validation is handled with Zod schemas.

## Inline Editing

```txt
Input
 → Local row state
 → Validate
 → Save
 → Refresh data
```

## Modal Forms

Forms use:

- React Hook Form
- Zod resolver
- mutation handlers

Used for:

- create user
- create product
- update product

---

# Mock API Layer

The project currently uses an in-memory mock API.

## Data Sources

- `mock/data.json`
- `mock/products.json`

## Available APIs

### Users

- `fetchUsers`
- `createUser`
- `updateUser`
- `deleteUser`
- `fetchUserById`

### Products

- `fetchProducts`
- `createProduct`
- `updateProduct`
- `fetchProductById`

All APIs simulate network latency and can later be replaced with real HTTP requests without changing the UI layer.

---

# Global Search

The header includes a debounced global search synced with the URL using the `q` query parameter.

## Features

- debounced search
- URL sync
- category filtering
- dropdown suggestions
- redirection to detail page

The dropdown currently uses static mock data, which is acceptable for the demo setup.

---

# Styling

The project uses:

- Tailwind CSS v4
- Tailwind Merge
- reusable `cn()` helper
- CSS design tokens

## Dark Mode

Dark mode is controlled using the `dark` class on the document root.

---

# Loading & Error Handling

## Loading States

- `SplashScreen`
- `TableListSkeleton`

## Error Handling

- `AppErrorBoundary`
- `RetryCard`

These components provide smoother loading and recovery experiences.

---

# Performance Optimizations

- memoized column definitions
- debounced search
- paginated rendering

These reduce unnecessary renders and improve table performance on larger datasets.

---

# Extending the Dashboard

## Add a New Page

1. Create route
2. Add query + table hook
3. Reuse shared UI components

## Add a New User Field

Update:

- types
- mock data
- table columns
- validation schema
- editable cell mapping

## Replace Mock API

Only `lib/api.ts` needs to change.  
The UI layer can remain unchanged.

---

# Key Design Decisions

| Decision | Reason |
|---|---|
| Inline editing for users | Better for data-heavy workflows |
| Modal editing for products | Simpler user experience |
| Shared table state | Consistent behavior |
| Lazy-loaded routes | Faster initial load |
| URL-based search | Shareable search state |
| In-memory mock store | Easier development |

---

# Summary

The dashboard architecture focuses on:

- clean separation of concerns
- reusable table infrastructure
- scalable state management
- predictable TypeScript patterns
- easy future backend integration

The result is a maintainable and extensible dashboard structure suitable for scaling over time.
