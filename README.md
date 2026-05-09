# NexusGrid Dashboard

A scalable, type-safe headless data table dashboard built with **React**, **TanStack Table v8**, **ShadCN UI**, **Tailwind CSS**, **Zod**, and **React Hook Form**.

## 🎯 Project Overview

NexusGrid is a production-ready data table dashboard that demonstrates clean architecture, proper separation of concerns, and extensibility. It features:

- **Row-level editing** with full validation
- **Type-safe data handling** with Zod schemas
- **Smart cell rendering** based on column metadata
- **Mock API integration** with realistic network delays
- **TanStack Query** for data fetching and caching
- **Responsive design** with dark/light mode support
- **Accessible UI** built with ShadCN components

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19+ | UI framework |
| **Vite** | 5.4+ | Build tool & dev server |
| **TypeScript** | 5.7+ | Type safety |
| **TanStack Table** | 8.21+ | Headless table logic |
| **TanStack Query** | 5.100+ | Data fetching & caching |
| **ShadCN UI** | Latest | Component library |
| **Tailwind CSS** | 4.2+ | Styling |
| **Zod** | 3.24+ | Schema validation |
| **React Hook Form** | 7.54+ | Form state management |
| **Sonner** | 1.7+ | Toast notifications |
| **React Router** | 7.15+ | Navigation |
| **Axios** | 1.16+ | HTTP client |
| **Lucide React** | 0.564+ | Icons |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20+)
- pnpm (or npm/yarn)

### Installation

1. **Clone or extract the project**
   ```bash
   cd nexusgrid-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the app
pnpm build

# Preview the production build locally
pnpm preview
```

## 📁 Project Structure

```
nexusgrid-dashboard/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Layout.tsx          # Main layout shell
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   └── Header.tsx          # Top header bar (global search + avatar)
│   │   ├── table/
│   │   │   ├── DataTable.tsx       # Main table orchestrator
│   │   │   ├── EditableCell.tsx    # Smart cell renderer
│   │   │   ├── TableToolbar.tsx    # Search & filters
│   │   │   ├── TablePagination.tsx # Pagination controls
│   │   │   ├── AddUserModal.tsx    # Add user modal form
│   │   │   └── index.ts            # Barrel export
│   │   └── ui/                     # ShadCN components (auto-generated)
│   ├── hooks/
│   │   ├── useEditableTable.ts     # Custom table logic hook
│   │   └── useTableState.ts        # Reusable table UI/data state
│   ├── lib/
│   │   ├── api.ts                  # Mock API layer
│   │   ├── formatters.ts           # Display & parse utilities
│   │   ├── types.ts                # Shared User/Table types
│   │   ├── utils.ts                # Helper functions (cn)
│   │   └── validations/
│   │       └── userSchema.ts       # Zod validation schema
│   ├── mock/
│   │   └── data.json               # Static mock dataset
│   ├── pages/
│   │   ├── TablePage.tsx           # Main data table page
│   │   └── DashboardPage.tsx       # Dashboard/home page
│   ├── App.tsx                     # App component with routing
│   ├── index.css                   # Global styles & Tailwind
│   └── main.tsx                    # React entry point
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.node.json              # TypeScript config for Vite
├── package.json                    # Dependencies & scripts
├── README.md                       # This file
└── DESIGN.md                       # Architecture & design decisions

```

## ✨ Key Features

### 1. **Editable Table Component**
- Row-level editing with edit/save/cancel actions
- Smart context switching between view and edit modes
- Visual feedback with blue highlight on editing rows

### 2. **Type-Safe Validation**
- Zod schemas for compile-time and runtime type safety
- Automatic error mapping to specific cells
- Validation runs before API calls

### 3. **Smart Cell Rendering**
Map column metadata to appropriate input types:
- `text` → Text input
- `number` → Number input
- `currency` → Formatted currency input/parser
- `phone` → Phone formatting + digit normalization
- `percentage` → Percentage display + decimal normalization
- `date` → Date picker
- `select` → Dropdown menu
- `checkbox` → Toggle switch

### 4. **Custom Hook: useEditableTable**
Manages:
- TanStack Table state (sorting, filtering, pagination)
- Editing state (editingRowId, rowState)
- Error tracking and validation
- Callbacks for edit/save/cancel/delete

### 5. **Mock API Layer**
- In-memory data storage
- Realistic 500ms network delay simulation
- CRUD operations: fetch, create, update, delete
- No backend required for testing

### 6. **Responsive Design**
- Mobile-first approach
- Sidebar collapses on mobile
- Optimized table for all screen sizes

### 7. **Dark Mode Support**
- Built-in theme toggle in header
- Persists across sessions (optional enhancement)

## 🎮 Usage Example

### Adding a User
```typescript
// In TablePage.tsx
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// Edit a row
handleEdit(user); // Sets editingRowId and copies row to rowState

// Save with validation
await handleSave(rowState); // Validates via Zod schema
```

### Column Definition with Metadata
```typescript
{
  accessorKey: 'salary',
  header: 'Salary',
  meta: {
    editable: true,
    type: 'currency',  // Enables currency formatting
    required: true,
  },
}
```

### Validation with Zod
```typescript
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  salary: z.number().positive(),
});

const validation = validateUser(userData);
if ('fieldErrors' in validation) {
  // Show errors mapped to specific cells
}
```

## 🔍 Component Breakdown

### DataTable.tsx
- Orchestrates TanStack Table with ShadCN UI
- Handles row rendering in view/edit modes
- Integrates EditableCell component
- Manages action buttons (edit/save/delete)

### EditableCell.tsx
- Smart renderer that switches between display and edit modes
- Maps `column.meta.type` to appropriate input component
- Applies formatters for display (e.g., currency)
- Handles onChange events

### TableToolbar.tsx
- Global search input
- Column-specific filters (department + active status)
- Connected to TanStack's globalFilter state
- Search across visible columns

### TablePagination.tsx
- Previous/Next navigation buttons
- Current page indicator
- Integrated with TanStack pagination state

### useEditableTable.ts
- Core logic for table state management
- Sorting, filtering, pagination via TanStack Table
- Row editing state (editingRowId, rowState, errors)
- Methods: handleEdit, handleCancel, handleRowStateChange

## 📊 Data Flow

```
User Click "Edit"
    ↓
handleEdit(row) → Sets editingRowId
    ↓
DataTable detects editingRowId → EditableCell renders inputs
    ↓
User types in inputs → handleRowStateChange updates rowState
    ↓
User clicks "Save"
    ↓
Validate rowState with Zod schema
    ↓
If valid → API call → Toast success → Reset editing state
If invalid → Show errors in cells → Continue editing
```

## 🛡️ Validation Strategy

1. **Schema Definition** (userSchema.ts)
   - Define Zod schema with all validation rules
   - Export validator function

2. **Pre-save Validation** (TablePage.tsx)
   - Call validateUser(rowState) before API call
   - Map errors to fields via fieldErrors object

3. **Error Display** (DataTable.tsx)
   - Pass errors to EditableCell
   - Display red borders on invalid fields

4. **Clear Errors** (useEditableTable.ts)
   - Clear field errors as user starts typing

## 🎨 Customization

### Adding a New Column Type
1. Update `TableMeta` type in `types/index.ts`
2. Add formatter/parser in `lib/formatters.ts`
3. Add condition in `EditableCell.tsx` to render the input
4. Add validation rule in `userSchema.ts`

### Changing Color Scheme
1. Edit CSS variables in `src/index.css` (`:root` section)
2. Update `tailwind.config.ts` if needed
3. All components automatically use new theme

### Adding Dark Mode Persistence
1. Use localStorage in Header.tsx to save theme preference
2. Load theme on app initialization in App.tsx

## 🚀 Performance Optimizations

- **TanStack Query** handles caching and automatic refetching
- **useMemo** in TablePage prevents unnecessary re-renders
- **Pagination** limits rendered rows (10 per page by default)
- **Debounced search** reduces processing on every keystroke
- **Lazy loading** of formatters and validators

## 🧪 Testing Considerations

- Mock API stores data in memory (suitable for unit tests)
- Zod validation is independent and testable
- Components accept data and callbacks as props (easy to mock)
- No external API calls—all operations are local

## 📝 Future Enhancements

1. **Server-side pagination** for large datasets
2. **Multi-select editing** for bulk operations
3. **Column visibility toggle** in toolbar
4. **Export to CSV/Excel** functionality
5. **Undo/redo** for edit operations
6. **Role-based access control** for sensitive fields
7. **Real backend integration** (replace mock API)
8. **Unit & integration tests** with Vitest

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Vite will automatically use the next available port
# Or explicitly specify:
pnpm dev -- --port 3000
```

### TypeScript Errors
```bash
# Ensure types are generated
pnpm build
```

### Styling Issues
```bash
# Rebuild Tailwind
pnpm dev --force
```

### Data Not Loading
- Check browser console for errors
- Ensure `fetchUsers` API is working
- Verify mock data in `lib/api.ts`

## 📚 Additional Resources

- **TanStack Table**: https://tanstack.com/table/v8
- **ShadCN UI**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com
- **Zod**: https://zod.dev
- **React Router**: https://reactrouter.com
- **TanStack Query**: https://tanstack.com/query/latest

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for clean, scalable, type-safe frontend development.**
