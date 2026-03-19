# Custom Dashboard Builder

A full-stack modular dashboard builder with drag-and-drop widgets, dynamic data, and persistent configuration.

---

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 18, Vite, Tailwind CSS |
| Charts    | Recharts |
| Grid      | React Grid Layout |
| HTTP      | Axios |
| Backend   | Node.js, Express.js |
| Database  | MongoDB (Mongoose) |

---

## Project Structure

```
dashboard-builder/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── orderController.js   # Orders CRUD
│   │   ├── dashboardController.js  # Dashboard save/load
│   │   └── widgetController.js  # Widget data aggregation
│   ├── models/
│   │   ├── Order.js             # Order schema
│   │   └── Dashboard.js         # Dashboard + widget config schema
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── widgetRoutes.js
│   ├── .env
│   ├── server.js                # Express entry point
│   └── package.json
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Dashboard/
        │   │   ├── GridCanvas.jsx        # React Grid Layout canvas
        │   │   └── WidgetSidebar.jsx     # Widget palette
        │   ├── Layout/
        │   │   └── AppLayout.jsx         # Sidebar + main shell
        │   ├── Orders/
        │   │   ├── OrderForm.jsx         # Create/Edit modal
        │   │   └── DeleteConfirm.jsx     # Delete dialog
        │   └── Widgets/
        │       ├── Charts/
        │       │   ├── BarChartWidget.jsx
        │       │   ├── LineChartWidget.jsx
        │       │   ├── AreaChartWidget.jsx
        │       │   ├── PieChartWidget.jsx
        │       │   └── ScatterWidget.jsx
        │       ├── KPI/
        │       │   └── KPIWidget.jsx
        │       ├── Table/
        │       │   └── TableWidget.jsx
        │       ├── WidgetRenderer.jsx    # Type → component dispatcher
        │       └── WidgetConfigPanel.jsx # Settings side panel
        ├── hooks/
        │   ├── useOrders.js
        │   └── useDashboard.js
        ├── pages/
        │   ├── OrdersPage.jsx
        │   ├── DashboardPage.jsx
        │   └── DashboardBuilderPage.jsx
        ├── services/
        │   └── api.js                   # Axios API layer
        └── utils/
            └── helpers.js               # Formatters, constants
```

---

## Setup & Running

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dashboard_builder
NODE_ENV=development
```

### 3. Start the servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

---

## API Reference

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/orders` | List all orders (supports `?dateFilter=last7`) |
| POST   | `/api/orders` | Create order |
| PUT    | `/api/orders/:id` | Update order |
| DELETE | `/api/orders/:id` | Delete order |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/dashboard` | Load saved dashboard config |
| POST   | `/api/dashboard` | Save dashboard config |

### Widget Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/widgets/kpi` | KPI aggregation (`?metric=&aggregation=&dateFilter=`) |
| GET    | `/api/widgets/chart` | Chart data (`?xAxis=&yAxis=&dateFilter=`) |
| GET    | `/api/widgets/pie` | Pie data (`?field=&dateFilter=`) |
| GET    | `/api/widgets/table` | Table rows (`?columns=&sortField=&page=&limit=`) |

---

## Features

### Customer Orders Module
- Create, edit, delete orders via modal form
- Full validation with inline error messages
- Status badges (Pending / In Progress / Completed)
- Search filtering and revenue totals

### Dashboard Builder
- Widget sidebar with click-to-add
- 12-column responsive grid (8 on tablet, 4 on mobile)
- Drag to reposition, drag edges to resize
- Hover widgets to access Settings or Delete

### Widget Types
| Widget | Config Options |
|--------|---------------|
| KPI | Metric, Aggregation, Format, Precision |
| Bar/Line/Area/Scatter Chart | X Axis, Y Axis, Color, Data Labels |
| Pie Chart | Data Field, Legend toggle |
| Table | Columns, Sort, Pagination, Filters, Font size, Header color |

### Save & Load
- Dashboard layout and all widget configs persist to MongoDB
- Auto-loads saved configuration on page refresh
- Save Configuration button available on both dashboard and builder pages

---

## Date Filter
All widgets respect the global date filter:
- All Time
- Today
- Last 7 Days
- Last 30 Days
- Last 90 Days
