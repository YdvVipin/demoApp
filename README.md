# QADemo App

> ⚠ **DEMO / TEST TARGET ONLY — not part of the product.** Runs locally only as a
> recording & bug-prediction sandbox. See [TEST_TARGET_ONLY.md](./TEST_TARGET_ONLY.md).

A realistic demo web application used as a **recording target** for the *QA Automation AI Enabler*
project — record clicks/actions, convert them into Playwright + Cucumber test cases, and use it
as a sandbox for bug injection / bug prediction.

It is intentionally a self-contained **frontend-only React SPA**: all state is in-memory and
**resets on reload**, so every recorded flow is deterministic and repeatable.

## Run

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 6162   # or: ./start.sh
```

App: http://localhost:6162

**Demo credentials**

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | `admin`  | `admin123` |
| QA    | `tester` | `test123`  |

The login page also has one-click **Quick fill** buttons (Admin / Tester).

## Pages / surfaces

| Route        | What it exercises (recordable interactions)                                   |
|--------------|--------------------------------------------------------------------------------|
| `/login`     | Text input, password toggle, checkbox, SSO buttons, quick-fill, submit         |
| `/dashboard` | Stats cards, quick-action nav, weekly revenue chart, system status, table      |
| `/users`     | Search, role filter, add/edit modal, radio status, delete confirm dialog       |
| `/products`  | Search, category filter, sort, cart drawer, qty steppers, add/edit modal       |
| `/orders`    | Search, status filter, inline status `<select>`, detail drawer, status buttons |
| `/analytics` | Date-range select, refresh, **CSV export**, bar chart, category bars, table    |
| `/tasks`     | Kanban board, move ←/→ between columns, add/edit modal, priority/assignee       |
| `/settings`  | Tabs (Profile / Notifications / Preferences / Security), toggles, forms         |

Global chrome (in `Layout`): collapsible sidebar, **global search** with dropdown results,
**notification bell** with unread badge + mark-all-read, user menu, breadcrumbs, and a global
**toast** notification system.

## Locator conventions

Every meaningful element carries a stable `data-testid`, named hierarchically
(`page-section-element`, e.g. `users-modal-save-btn`, `task-move-right-3`,
`analytics-revenue-chart-bar-Mon`). This is the primary, smart-locator-friendly hook for the
recorder. Dynamic rows/cards suffix the entity id (`users-row-5`, `task-card-2`,
`orders-status-select-1003`).

## Structure

```
src/
  App.jsx                 Routes + auth gate, wraps everything in <ToastProvider>
  components/
    Layout.jsx            Sidebar, topbar (search/bell/user menu), breadcrumb
    ui/
      Toast.jsx           ToastProvider + on-screen toast stack
      toast-context.js    ToastContext + useToast() hook
      BarChart.jsx        Dependency-free SVG/CSS bar chart
  pages/
    Login, Dashboard, Users, Products, Orders, Analytics, Tasks, Settings
```

## Notes for bug-injection / bug-prediction

- State is in-memory and modular per page, so a bug introduced in one page/component is isolated
  and easy for a prediction model to attribute to a changed file/area.
- Shared logic lives in small, single-purpose modules (`BarChart`, `Toast`) — good candidates for
  "blast radius" reasoning when one of them changes.
- Because flows are deterministic, the same recorded script can be re-run before/after a change to
  confirm a predicted regression.

Built with React 19 + Vite + Tailwind CSS.
