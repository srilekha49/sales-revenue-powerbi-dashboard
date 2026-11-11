const fs = require('fs');
const path = require('path');

const csvPath = "C:\\Users\\C Srilekha\\.gemini\\antigravity\\scratch\\sales-revenue-powerbi-dashboard\\Sales_Data.csv";
const lines = fs.readFileSync(csvPath, 'utf-8').trim().split(/\r?\n/);
const headers = lines[0].split(',');

const rawData = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line) continue;
  
  // Regex to handle quoted CSV fields
  const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  // Alternative robust CSV line parser:
  const row = [];
  let current = '';
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"' && (j === 0 || line[j-1] !== '\\')) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  row.push(current.trim().replace(/^"|"$/g, ''));

  if (row.length >= 19) {
    rawData.push({
      orderId: row[0],
      orderDate: row[1],
      shipDate: row[2],
      customerId: row[3],
      customerName: row[4],
      segment: row[5],
      country: row[6],
      region: row[7],
      state: row[8],
      city: row[9],
      category: row[10],
      subCategory: row[11],
      productName: row[12],
      costPrice: parseFloat(row[13]) || 0,
      unitPrice: parseFloat(row[14]) || 0,
      quantity: parseInt(row[15]) || 0,
      discount: parseFloat(row[16]) || 0,
      sales: parseFloat(row[17]) || 0,
      profit: parseFloat(row[18]) || 0
    });
  }
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales & Revenue Analysis Dashboard (Interactive Preview)</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #3b82f6;
      --accent-glow: rgba(59, 130, 246, 0.2);
      --success: #10b981;
      --warning: #f59e0b;
      --purple: #8b5cf6;
      --border: #334155;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    body {
      background-color: var(--bg);
      color: var(--text-main);
      padding: 24px;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .title-area h1 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .title-area p {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .badge {
      display: inline-block;
      background: #1e3a8a;
      color: #93c5fd;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 9999px;
      border: 1px solid #3b82f6;
    }

    /* Filters Bar */
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      background: var(--card-bg);
      padding: 16px;
      border-radius: 12px;
      border: 1px solid var(--border);
      margin-bottom: 24px;
      align-items: center;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-group label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.5px;
    }

    .filter-group select {
      background: #0f172a;
      color: var(--text-main);
      border: 1px solid var(--border);
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      min-width: 150px;
      outline: none;
      cursor: pointer;
    }

    .filter-group select:focus {
      border-color: var(--accent);
    }

    .reset-btn {
      margin-left: auto;
      align-self: flex-end;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .reset-btn:hover {
      background: #334155;
      color: #fff;
    }

    /* KPI Cards Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .kpi-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .kpi-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }

    .kpi-card.sales::before { background: var(--accent); }
    .kpi-card.profit::before { background: var(--success); }
    .kpi-card.margin::before { background: var(--purple); }
    .kpi-card.orders::before { background: var(--warning); }
    .kpi-card.aov::before { background: #06b6d4; }

    .kpi-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted);
      letter-spacing: 0.5px;
    }

    .kpi-value {
      font-size: 28px;
      font-weight: 700;
      margin: 8px 0 4px 0;
    }

    .kpi-subtitle {
      font-size: 12px;
      color: var(--text-muted);
    }

    /* Charts Grid */
    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .chart-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .chart-title {
      font-size: 15px;
      font-weight: 600;
    }

    .chart-container {
      position: relative;
      height: 290px;
      width: 100%;
    }

    @media (max-width: 1024px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="title-area">
      <h1>Sales & Revenue Analysis Dashboard</h1>
      <p>Interactive Business Intelligence Prototype &bull; Power BI Direct-Link Model</p>
    </div>
    <div>
      <span class="badge">&#x2714; Connected to Sales_Data.csv (2,000 Records)</span>
    </div>
  </div>

  <!-- Slicers / Interactive Filters -->
  <div class="filter-bar">
    <div class="filter-group">
      <label>Filter by Year</label>
      <select id="filterYear" onchange="updateDashboard()">
        <option value="ALL">All Years (2023 - 2024)</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Filter by Region</label>
      <select id="filterRegion" onchange="updateDashboard()">
        <option value="ALL">All Regions</option>
        <option value="West">West</option>
        <option value="East">East</option>
        <option value="Central">Central</option>
        <option value="South">South</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Filter by Category</label>
      <select id="filterCategory" onchange="updateDashboard()">
        <option value="ALL">All Categories</option>
        <option value="Technology">Technology</option>
        <option value="Furniture">Furniture</option>
        <option value="Office Supplies">Office Supplies</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Customer Segment</label>
      <select id="filterSegment" onchange="updateDashboard()">
        <option value="ALL">All Segments</option>
        <option value="Consumer">Consumer</option>
        <option value="Corporate">Corporate</option>
        <option value="Home Office">Home Office</option>
      </select>
    </div>

    <button class="reset-btn" onclick="resetFilters()">Reset All Filters</button>
  </div>

  <!-- KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card sales">
      <div class="kpi-title">Total Revenue</div>
      <div class="kpi-value" id="kpiSales">$0.00</div>
      <div class="kpi-subtitle">Sum of net sales</div>
    </div>
    <div class="kpi-card profit">
      <div class="kpi-title">Total Profit</div>
      <div class="kpi-value" id="kpiProfit">$0.00</div>
      <div class="kpi-subtitle">Net earnings after cost</div>
    </div>
    <div class="kpi-card margin">
      <div class="kpi-title">Profit Margin</div>
      <div class="kpi-value" id="kpiMargin">0.0%</div>
      <div class="kpi-subtitle">Total Profit / Total Sales</div>
    </div>
    <div class="kpi-card orders">
      <div class="kpi-title">Total Orders</div>
      <div class="kpi-value" id="kpiOrders">0</div>
      <div class="kpi-subtitle">Distinct order volume</div>
    </div>
    <div class="kpi-card aov">
      <div class="kpi-title">Avg Order Value (AOV)</div>
      <div class="kpi-value" id="kpiAOV">$0.00</div>
      <div class="kpi-subtitle">Sales per distinct order</div>
    </div>
  </div>

  <!-- Charts Row 1 -->
  <div class="charts-grid">
    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">&#x1F4C8; Monthly Revenue Trend</div>
      </div>
      <div class="chart-container">
        <canvas id="trendChart"></canvas>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">&#x1F967; Revenue by Category</div>
      </div>
      <div class="chart-container">
        <canvas id="categoryChart"></canvas>
      </div>
    </div>
  </div>

  <!-- Charts Row 2 -->
  <div class="charts-grid">
    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">&#x1F3C6; Top 10 Best-Selling Products</div>
      </div>
      <div class="chart-container">
        <canvas id="productsChart"></canvas>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">&#x1F30D; Regional Sales Performance</div>
      </div>
      <div class="chart-container">
        <canvas id="regionChart"></canvas>
      </div>
    </div>
  </div>

  <script>
    const dataset = ${JSON.stringify(rawData)};

    let chartInstances = {};

    function formatCurrency(val) {
      return "$" + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function getFilteredData() {
      const year = document.getElementById('filterYear').value;
      const region = document.getElementById('filterRegion').value;
      const category = document.getElementById('filterCategory').value;
      const segment = document.getElementById('filterSegment').value;

      return dataset.filter(d => {
        const dYear = d.orderDate.substring(0, 4);
        if (year !== 'ALL' && dYear !== year) return false;
        if (region !== 'ALL' && d.region !== region) return false;
        if (category !== 'ALL' && d.category !== category) return false;
        if (segment !== 'ALL' && d.segment !== segment) return false;
        return true;
      });
    }

    function resetFilters() {
      document.getElementById('filterYear').value = 'ALL';
      document.getElementById('filterRegion').value = 'ALL';
      document.getElementById('filterCategory').value = 'ALL';
      document.getElementById('filterSegment').value = 'ALL';
      updateDashboard();
    }

    function updateDashboard() {
      const data = getFilteredData();

      // Compute KPIs
      let totalSales = 0;
      let totalProfit = 0;
      const orders = new Set();

      data.forEach(d => {
        totalSales += d.sales;
        totalProfit += d.profit;
        orders.add(d.orderId);
      });

      const totalOrdersCount = orders.size;
      const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
      const aov = totalOrdersCount > 0 ? totalSales / totalOrdersCount : 0;

      // Update UI Cards
      document.getElementById('kpiSales').textContent = formatCurrency(totalSales);
      document.getElementById('kpiProfit').textContent = formatCurrency(totalProfit);
      document.getElementById('kpiMargin').textContent = profitMargin.toFixed(1) + "%";
      document.getElementById('kpiOrders').textContent = totalOrdersCount.toLocaleString();
      document.getElementById('kpiAOV').textContent = formatCurrency(aov);

      // 1. Monthly Trend
      const monthMap = {};
      data.forEach(d => {
        const ym = d.orderDate.substring(0, 7); // YYYY-MM
        monthMap[ym] = (monthMap[ym] || 0) + d.sales;
      });
      const sortedMonths = Object.keys(monthMap).sort();
      const monthValues = sortedMonths.map(m => Math.round(monthMap[m]));

      renderTrendChart(sortedMonths, monthValues);

      // 2. Category Share
      const catMap = {};
      data.forEach(d => {
        catMap[d.category] = (catMap[d.category] || 0) + d.sales;
      });
      renderCategoryChart(Object.keys(catMap), Object.values(catMap).map(Math.round));

      // 3. Top 10 Products
      const prodMap = {};
      data.forEach(d => {
        prodMap[d.productName] = (prodMap[d.productName] || 0) + d.sales;
      });
      const sortedProds = Object.entries(prodMap).sort((a,b) => b[1] - a[1]).slice(0, 10);
      renderProductsChart(sortedProds.map(p => p[0]), sortedProds.map(p => Math.round(p[1])));

      // 4. Regional Breakdown
      const regMap = {};
      data.forEach(d => {
        regMap[d.region] = (regMap[d.region] || 0) + d.sales;
      });
      renderRegionChart(Object.keys(regMap), Object.values(regMap).map(Math.round));
    }

    function renderTrendChart(labels, values) {
      if (chartInstances.trend) chartInstances.trend.destroy();
      const ctx = document.getElementById('trendChart').getContext('2d');
      chartInstances.trend = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Revenue ($)',
            data: values,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#60a5fa'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    function renderCategoryChart(labels, values) {
      if (chartInstances.category) chartInstances.category.destroy();
      const ctx = document.getElementById('categoryChart').getContext('2d');
      chartInstances.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#f8fafc', padding: 12 } }
          }
        }
      });
    }

    function renderProductsChart(labels, values) {
      if (chartInstances.products) chartInstances.products.destroy();
      const ctx = document.getElementById('productsChart').getContext('2d');
      chartInstances.products = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels.map(l => l.length > 25 ? l.substring(0, 22) + '...' : l),
          datasets: [{
            label: 'Sales ($)',
            data: values,
            backgroundColor: '#8b5cf6',
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'transparent' }, ticks: { color: '#f8fafc', font: { size: 11 } } }
          }
        }
      });
    }

    function renderRegionChart(labels, values) {
      if (chartInstances.region) chartInstances.region.destroy();
      const ctx = document.getElementById('regionChart').getContext('2d');
      chartInstances.region = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Sales ($)',
            data: values,
            backgroundColor: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'transparent' }, ticks: { color: '#f8fafc' } },
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    // Initial render
    window.onload = updateDashboard;
  </script>
</body>
</html>
`;

const previewPath = "C:\\Users\\C Srilekha\\.gemini\\antigravity\\scratch\\sales-revenue-powerbi-dashboard\\Dashboard_Preview.html";
fs.writeFileSync(previewPath, htmlContent, 'utf-8');
console.log(`Created interactive preview at: ${previewPath}`);
