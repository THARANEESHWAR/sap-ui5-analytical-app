# SAP UI5 Fiori Analytical Application

A comprehensive analytical dashboard built with SAP UI5 Fiori, featuring 200 sample sales records, interactive charts, KPIs, filtering, search, and navigation.

## Features

### 📊 Data
- **200 Sample Records**: Sales data spanning 2024 covering 5 regions, 6 products, 5 categories, 8 sales reps, and 10 customers
- **Mock Data File**: `webapp/data/mockData.json`

### 🖥 Views
| View | Route | Description |
|------|-------|-------------|
| **List Report** | `/` | Sales table with live KPIs, multi-filter, search, CSV export, and row navigation |
| **Analytical List Page** | `#/analytics` | 4 × sap.viz charts (line, donut, bar, column) + variance analysis table |
| **Charts** | `#/charts` | Additional pie, donut and bar charts (category, status, sales rep breakdowns) |
| **Object Page** | `#/object/{id}` | Detailed order view using sap.uxap.ObjectPageLayout |
| **Not Found** | — | Fallback 404 message page |

### 📈 Charts (sap.viz VizFrame)
- Monthly Sales Trend (line)
- Sales by Region (donut)
- Top Products by Sales (bar)
- Region Performance – Sales + Orders (column)
- Sales by Category (pie)
- Orders by Status (donut)
- Performance by Sales Rep (bar)

### 🔍 Filtering & Search
- Multi-select region and product filters
- Live search across region, product, customer, sales rep, status
- KPI tiles update dynamically as filters change

### 📤 Export
- CSV export of currently filtered data

## Getting Started

### Prerequisites
- Node.js v14+
- `http-server` (or any static file server)

### Run Locally

```bash
npm install -g http-server
cd webapp
http-server -p 8080 -c-1
```

Open `http://localhost:8080`

## Project Structure

```
sap-ui5-analytical-app/
├── webapp/
│   ├── index.html              # Bootstrap via ComponentSupport
│   ├── manifest.json           # App descriptor (routes, models, libs)
│   ├── Component.js            # UIComponent with router init
│   ├── view/
│   │   ├── App.view.xml
│   │   ├── ListReport.view.xml         # Main list + KPIs + filters
│   │   ├── AnalyticalListPage.view.xml # Charts + variance table
│   │   ├── Charts.view.xml             # Additional chart page
│   │   ├── ObjectPage.view.xml         # Order detail (sap.uxap)
│   │   └── NotFound.view.xml
│   ├── controller/
│   │   ├── App.controller.js
│   │   ├── ListReport.controller.js
│   │   ├── AnalyticalListPage.controller.js
│   │   ├── Charts.controller.js
│   │   └── ObjectPage.controller.js
│   ├── model/
│   │   ├── formatter.js
│   │   └── models.js
│   ├── css/style.css
│   ├── i18n/i18n.properties
│   └── data/mockData.json      # 200 sample sales records
├── package.json
├── ui5.yaml
└── .gitignore
```

## License

MIT