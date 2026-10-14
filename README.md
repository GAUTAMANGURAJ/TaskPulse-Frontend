# TaskPulse Enterprise

> **Unified Workflow Orchestration & Role-Based Access Control (RBAC) Administration Suite**

TaskPulse Enterprise is a production-grade React frontend application engineered to interface seamlessly with the enterprise FastAPI backend. The codebase adopts the enterprise architectural standards of **Robolab Client Frontend** and adheres to the **Pirai Frontend Skills** guidelines, featuring a tailored **Ant Design v5** design system with **Tailwind CSS**, **TanStack React Query**, and **React Router v7**.

---

## 🏛 Architecture & Standards

The application strictly aligns with modern enterprise frontend architecture and the **Pirai Frontend Skills Specifications** (`skills/frontend/`):

- **`api-client` & `api-runtime-validation`**: Strict runtime response parsing using Zod schemas (`validateApiResponse`) at the network boundary, complete `AbortSignal` cancellation support, and a singleton Axios instance with unified error mapping.
- **`data-views` & `base/tables/datatable.md`**: Reusable `CustomDataTable` wrapper with column definitions extracted into dedicated files (`TodoColumns.tsx`, `UserColumns.tsx`) rather than declared inline.
- **`feedback-states`**: Full lifecycle feedback handling distinguishing `initial loading`, `refreshing/pending`, `empty`, `filtered_empty`, `error` with retry action, and `forbidden`.
- **`permissions-session` & `declarative-rbac`**: Component-level gating via `PermissionGate` and route guards (`ProtectedRoute`, `AdminRoute`) without exposing tokens or flashing protected UI.
- **`file-size-and-modularity-standards`**: High cohesion, one-way dependency direction, and focused single-responsibility files under threshold limits.

```
src/
├── api/                   # Type-safe API fetchers & React Query hooks (auth, users, todos)
├── components/
│   ├── auth/              # Route guards: ProtectedRoute, AdminRoute
│   ├── common/            # ErrorBoundary, LoadingState, EmptyState
│   ├── custom/            # Enterprise primitives: CustomStatCard, CustomStatusBadge
│   ├── layout/            # AppLayout, Sidebar (collapsible), Header, Footer
│   ├── todos/             # TodoModal, task management widgets
│   └── users/             # UserModal, UserDetailDrawer
├── constants/             # endpoints.ts, storageKeys.ts
├── context/               # AuthContext (session & RBAC), ThemeContext (dark/light tokens)
├── pages/                 # LoginPage, DashboardPage, TodosPage, UsersPage, ProfilePage, NotFoundPage
├── routes/                # AppRoutes.tsx
├── schemas/               # Zod validation schemas matching backend Pydantic models
├── service/               # apiClient.ts (Axios singleton with JWT interceptor & 401 handling)
├── types/                 # Domain TypeScript interfaces directly mirroring SQLAlchemy/Pydantic schemas
├── utils/                 # storage.ts (typed localStorage), toast.ts (Ant Design notifications)
├── App.tsx                # App root with QueryClientProvider, ConfigProvider, AuthProvider
└── main.tsx               # Application entrypoint
```

---

## 🚀 Key Modules & Capabilities

### 1. Enterprise Authentication & Session Management
- **OAuth2 Password Authentication**: Submits credentials matching FastAPI's `OAuth2PasswordRequestForm` (`/auth/login`).
- **Cryptographic Security**: JWT Bearer tokens securely stored with automatic header injection.
- **Auto-Logout on 401**: Axios response interceptor clears sessions and redirects seamlessly when credentials expire.
- **Quick-Fill Credentials**: Embedded test logins for Super Admin (`admin@example.com`) and Standard User (`user@example.com`).

### 2. Role-Based Access Control (RBAC)
- **Super Administrator vs Standard User**: Granular UI visibility and route-level protection (`<AdminRoute>`).
- **User Provisioning**: Super Admins can provision new users via `POST /users/create`, which triggers FastAPI's background welcome email service.
- **Account Safeguards**: Super Admins are prevented from deactivating their own administrative account.
- **User Audit Drawer**: Deep audit inspection displaying registration timestamps, last update, role, and activation status.

### 3. Task Governance & Workflow Management
- **Full CRUD Lifecycle**: Add (`POST /createtodos`), Read (`GET /todos`), Edit (`PUT /todo/{id}`), Delete (`DELETE /todo/{id}` with confirmation).
- **Inline Status Toggle**: Quick-toggle completion switch using the specialized `PUT /todo/{id}/status` endpoint.
- **Dual Presentation Views**: Instant switching between an **Enterprise Data Table** and an interactive **Card Grid**.
- **Search & Filtering**: Real-time keyword search and segmented tabs (`All`, `In Progress`, `Completed`).

### 4. Operations Dashboard & Analytics
- **Executive KPI Cards**: Real-time metrics for total tasks, completed tasks, pending items, completion percentages, and user counts.
- **Circular Progress Gauge**: Visual workflow completion tracking.
- **Recent Activity Table**: Instant status changes directly from the dashboard.

### 5. Curated Design System (Ant Design + Tailwind CSS)
- **Brand Tokens**: Primary Indigo `#4f46e5` with Plus Jakarta Sans and Inter typography.
- **Dual Theme Support**: Comprehensive dark mode and light mode switching via Ant Design's `ConfigProvider` algorithms.
- **Feedback & Resilience**: Unified toasts, notification cards, skeleton loaders, and global `ErrorBoundary` protection.

---

## ⚙️ Development & Quickstart

### Prerequisites
- Node.js `v20+`
- Python FastAPI Backend running on `http://localhost:8000`

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```env
# Backend server URL for Vite development proxy
VITE_BACKEND_URL=http://localhost:8000

# Base API path
VITE_API_URL=/api
```

### 3. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`.

### 4. Production Build & Validation
```bash
npm run build
npm run preview
```

---

## 🔗 Backend Contract Reference

| Method | Endpoint | Description | Access Level |
|---|---|---|---|
| `POST` | `/auth/login` | Issues JWT access token | Public |
| `GET` | `/auth/me` | Retrieves authenticated user profile | Authenticated |
| `POST` | `/users/create` | Provisions user & triggers welcome email | Super Admin |
| `POST` | `/users/list` | Returns list of all system users | Super Admin |
| `GET` | `/users/{id}` | Retrieves user account by ID | Super Admin / Self |
| `PUT` | `/users/update/{id}` | Updates user credentials and roles | Super Admin |
| `PUT` | `/users/{id}/status` | Toggles account active status | Super Admin |
| `GET` | `/todos` | Lists all tasks | Authenticated |
| `POST` | `/createtodos` | Creates a new task | Authenticated |
| `GET` | `/todo/{id}` | Gets single task details | Authenticated |
| `PUT` | `/todo/{id}` | Updates task title/description | Authenticated |
| `DELETE` | `/todo/{id}` | Permanently deletes a task | Authenticated |
| `PUT` | `/todo/{id}/status` | Toggles task completion boolean | Authenticated |
