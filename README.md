# SAP UI5 Fiori Analytical Application

A comprehensive analytical dashboard application built with SAP UI5 Fiori Elements, featuring advanced data visualization, KPIs, filtering, search capabilities, and responsive design.

## Features

### 📊 Data Visualization
- **Multiple Chart Types**: Bar, Line, Pie, Area, Donut charts
- **KPI Tiles**: Key Performance Indicators with trend indicators
- **Data Tables**: Interactive tables with sorting and filtering
- **Heatmaps**: Visual representation of data intensity
- **Gauge Charts**: Performance metrics visualization

### 🔍 Analytics & Exploration
- **Advanced Filtering**: Multi-dimensional filtering
- **Search Functionality**: Global and field-specific search
- **Drill-Down Capabilities**: Navigate from summary to detail
- **Drill-Up**: Return to higher-level aggregations
- **Date Range Selection**: Time-based filtering
- **Comparative Analysis**: Compare periods and dimensions

### 📱 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **List Report View**: Summary view with quick filters
- **Analytical List Page**: Enhanced analytics view
- **Object Page**: Detailed analysis view
- **Variant Management**: Save and load custom views
- **Export Functionality**: Export data to Excel/CSV

### 🔧 Technical Features
- **OData Integration**: Seamless backend connectivity
- **State Management**: URL-based state persistence
- **Caching**: Performance optimization
- **Error Handling**: Comprehensive error management
- **Accessibility**: WCAG compliant design
- **i18n Support**: Multi-language support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- UI5 CLI installed globally

### Installation

```bash
# Clone the repository
git clone https://github.com/THARANEESHWAR/sap-ui5-analytical-app.git
cd sap-ui5-analytical-app

# Install dependencies
npm install

# Start development server
npm start
```

### Development Server
The application will be available at `http://localhost:8080`

## Project Structure

```
sap-ui5-analytical-app/
├── webapp/
│   ├── index.html
│   ├── manifest.json
│   ├── Component.js
│   ├── view/
│   ├── controller/
│   ├── model/
│   ├── css/
│   ├── i18n/
│   └── data/
├── package.json
├── ui5.yaml
└── .gitignore
```

## Key Features

- **List Report**: Summary data with quick filters and KPIs
- **Analytical List Page**: Enhanced dashboard with charts and variance analysis
- **Object Page**: Detailed entity view with nested analytics
- **Charts**: Interactive visualizations with drill-down capability
- **Filtering**: Advanced multi-dimensional filtering
- **KPI Metrics**: Real-time performance indicators
- **Search**: Full-text search across dimensions
- **Export**: Download data in various formats
- **Mobile Responsive**: Fully responsive across all devices

## Development

### Running the App
```bash
npm start
```

### Building for Production
```bash
npm run build
```

### Testing
```bash
npm run test
```

## OData Service Integration

The application is ready for OData v4 service integration. Update the service URL in:
- `webapp/manifest.json` - datasources section

## Documentation

For detailed documentation, see [Docs](./docs) folder.

## Support

For issues and questions, please open an issue on GitHub.

## License

MIT License