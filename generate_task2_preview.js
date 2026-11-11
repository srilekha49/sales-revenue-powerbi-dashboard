const fs = require('fs');
const path = require('path');

const csvPath = "C:\\Users\\C Srilekha\\.gemini\\antigravity\\scratch\\sales-revenue-powerbi-dashboard\\Customer_Segmentation_Data.csv";
const lines = fs.readFileSync(csvPath, 'utf-8').trim().split(/\r?\n/);
const headers = lines[0].split(',');

const rawData = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line) continue;
  
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

  if (row.length >= 14) {
    rawData.push({
      customerId: row[0],
      age: parseInt(row[1]) || 0,
      gender: row[2],
      maritalStatus: row[3],
      annualIncome: parseFloat(row[4]) || 0,
      spendingScore: parseFloat(row[5]) || 0,
      recencyDays: parseInt(row[6]) || 0,
      frequencyOrders: parseInt(row[7]) || 0,
      monetarySpend: parseFloat(row[8]) || 0,
      preferredCategory: row[9],
      discountSensitivity: row[10],
      webVisits: parseInt(row[11]) || 0,
      clusterId: parseInt(row[12]) || 0,
      clusterName: row[13]
    });
  }
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Customer Segmentation & Analytics Dashboard (Task 2)</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    :root {
      --bg: #0b1329;
      --card-bg: #16223f;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --success: #10b981;
      --warning: #fbbf24;
      --danger: #f43f5e;
      --purple: #a855f7;
      --border: #23355d;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
      background: #1e293b;
      color: #38bdf8;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 9999px;
      border: 1px solid #0284c7;
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
      background: #0b1329;
      color: var(--text-main);
      border: 1px solid var(--border);
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      min-width: 170px;
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
      background: #23355d;
      color: #fff;
    }

    /* KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

    .kpi-card.c1::before { background: var(--accent); }
    .kpi-card.c2::before { background: var(--success); }
    .kpi-card.c3::before { background: var(--purple); }
    .kpi-card.c4::before { background: var(--warning); }
    .kpi-card.c5::before { background: var(--danger); }

    .kpi-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      letter-spacing: 0.5px;
    }

    .kpi-value {
      font-size: 26px;
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
      margin-bottom: 24px;
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
      height: 300px;
      width: 100%;
    }

    /* Personas Row */
    .persona-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }

    .persona-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px;
    }

    .persona-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 10px;
    }

    .persona-champions { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .persona-bargain { background: rgba(251, 191, 36, 0.2); color: #fde047; }
    .persona-tech { background: rgba(56, 189, 248, 0.2); color: #7dd3fc; }
    .persona-atrisk { background: rgba(244, 63, 94, 0.2); color: #fda4af; }

    .persona-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .persona-traits {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .persona-action {
      background: rgba(255, 255, 255, 0.04);
      padding: 10px;
      border-radius: 8px;
      font-size: 12px;
      border-left: 3px solid var(--accent);
    }

    @media (max-width: 1024px) {
      .charts-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="title-area">
      <h1>Customer Segmentation & Behavioral Analytics Dashboard</h1>
      <p>Task 2: Demographic & RFM Clustering Analysis &bull; K-Means ML Model</p>
    </div>
    <div>
      <span class="badge">&#x1F916; K-Means (K=4) | 1,200 Customer Profiles</span>
    </div>
  </div>

  <!-- Filters / Slicers -->
  <div class="filter-bar">
    <div class="filter-group">
      <label>Customer Segment (Cluster)</label>
      <select id="filterCluster" onchange="updateDashboard()">
        <option value="ALL">All Clusters (4 Segments)</option>
        <option value="0">Champions (High Value)</option>
        <option value="1">Loyal Bargain Seekers</option>
        <option value="2">Young Tech Explorers</option>
        <option value="3">At-Risk (Low Engagement)</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Gender</label>
      <select id="filterGender" onchange="updateDashboard()">
        <option value="ALL">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Preferred Category</label>
      <select id="filterCategory" onchange="updateDashboard()">
        <option value="ALL">All Categories</option>
        <option value="Technology">Technology</option>
        <option value="Furniture">Furniture</option>
        <option value="Office Supplies">Office Supplies</option>
        <option value="Fashion">Fashion</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Discount Sensitivity</label>
      <select id="filterDiscount" onchange="updateDashboard()">
        <option value="ALL">All Levels</option>
        <option value="Low">Low (Full Price Buyers)</option>
        <option value="Medium">Medium</option>
        <option value="High">High (Discount Driven)</option>
      </select>
    </div>

    <button class="reset-btn" onclick="resetFilters()">Reset All Filters</button>
  </div>

  <!-- KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card c1">
      <div class="kpi-title">Total Customers</div>
      <div class="kpi-value" id="kpiCount">0</div>
      <div class="kpi-subtitle">Filtered segment size</div>
    </div>
    <div class="kpi-card c2">
      <div class="kpi-title">Avg Annual Income</div>
      <div class="kpi-value" id="kpiIncome">$0k</div>
      <div class="kpi-subtitle">Median earning power</div>
    </div>
    <div class="kpi-card c3">
      <div class="kpi-title">Avg Spending Score</div>
      <div class="kpi-value" id="kpiScore">0 / 100</div>
      <div class="kpi-subtitle">Customer propensity to buy</div>
    </div>
    <div class="kpi-card c4">
      <div class="kpi-title">Avg Recency</div>
      <div class="kpi-value" id="kpiRecency">0 days</div>
      <div class="kpi-subtitle">Days since last transaction</div>
    </div>
    <div class="kpi-card c5">
      <div class="kpi-title">Avg Customer Lifetime Spend</div>
      <div class="kpi-value" id="kpiSpend">$0</div>
      <div class="kpi-subtitle">Cumulative monetary value</div>
    </div>
  </div>

  <!-- Charts Row 1 -->
  <div class="charts-grid">
    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">&#x1F3AF; Cluster Scatter Plot (Income vs. Spending Score)</div>
      </div>
      <div class="chart-container">
        <canvas id="scatterChart"></canvas>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">&#x1F967; Segment Population Share</div>
      </div>
      <div class="chart-container">
        <canvas id="shareChart"></canvas>
      </div>
    </div>
  </div>

  <!-- Charts Row 2 -->
  <div class="charts-grid">
    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">&#x1F4B0; Average Monetary Spend by Segment</div>
      </div>
      <div class="chart-container">
        <canvas id="spendChart"></canvas>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">&#x1F6D2; Category Affinity by Segment</div>
      </div>
      <div class="chart-container">
        <canvas id="categoryChart"></canvas>
      </div>
    </div>
  </div>

  <!-- Persona Profiles Grid -->
  <h2 style="font-size: 18px; margin: 30px 0 16px 0; font-weight: 700;">&#x1F465; Actionable Customer Personas & Marketing Strategies</h2>
  <div class="persona-grid">
    <div class="persona-card">
      <span class="persona-badge persona-champions">CLUSTER 0 &bull; 28%</span>
      <div class="persona-title">Champions (High Value)</div>
      <div class="persona-traits">
        &bull; <strong>Income:</strong> $75k–$140k | <strong>Spend Score:</strong> 70–99<br>
        &bull; <strong>Recency:</strong> Under 30 days | <strong>Freq:</strong> 15–34 orders<br>
        &bull; Low discount sensitivity, high loyalty.
      </div>
      <div class="persona-action">
        <strong>Action Strategy:</strong> VIP concierge, early access to new flagship products, loyalty tiers. Do NOT discount.
      </div>
    </div>

    <div class="persona-card">
      <span class="persona-badge persona-bargain">CLUSTER 1 &bull; 26%</span>
      <div class="persona-title">Loyal Bargain Seekers</div>
      <div class="persona-traits">
        &bull; <strong>Income:</strong> $25k–$65k | <strong>Spend Score:</strong> 55–89<br>
        &bull; <strong>Recency:</strong> 10–60 days | <strong>Freq:</strong> 10–24 orders<br>
        &bull; Highly motivated by sales, coupons, and bundles.
      </div>
      <div class="persona-action">
        <strong>Action Strategy:</strong> Send promotional blast emails, Buy-One-Get-One (BOGO), and clearance sale notifications.
      </div>
    </div>

    <div class="persona-card">
      <span class="persona-badge persona-tech">CLUSTER 2 &bull; 24%</span>
      <div class="persona-title">Young Tech Explorers</div>
      <div class="persona-traits">
        &bull; <strong>Age:</strong> 18–31 | <strong>Web Visits:</strong> 20–45/month<br>
        &bull; <strong>Top Category:</strong> Technology & Gadgets<br>
        &bull; Mobile-first shoppers with fast conversion cycles.
      </div>
      <div class="persona-action">
        <strong>Action Strategy:</strong> Instagram/TikTok ad targeting, mobile app push notifications, financing options (BNPL).
      </div>
    </div>

    <div class="persona-card">
      <span class="persona-badge persona-atrisk">CLUSTER 3 &bull; 22%</span>
      <div class="persona-title">At-Risk (Low Engagement)</div>
      <div class="persona-traits">
        &bull; <strong>Recency:</strong> 90–360+ days since last purchase<br>
        &bull; <strong>Spend Score:</strong> 10–39 | <strong>Orders:</strong> 1–4<br>
        &bull; High probability of customer churn.
      </div>
      <div class="persona-action">
        <strong>Action Strategy:</strong> Automated "We miss you" re-engagement email sequence with a win-back discount code.
      </div>
    </div>
  </div>

  <script>
    const dataset = ${JSON.stringify(rawData)};
    let chartInstances = {};

    const clusterColors = {
      0: '#10b981', // Champions (Green)
      1: '#fbbf24', // Bargain (Yellow)
      2: '#38bdf8', // Young Tech (Sky Blue)
      3: '#f43f5e'  // At-Risk (Rose/Red)
    };

    function getFilteredData() {
      const cluster = document.getElementById('filterCluster').value;
      const gender = document.getElementById('filterGender').value;
      const category = document.getElementById('filterCategory').value;
      const discount = document.getElementById('filterDiscount').value;

      return dataset.filter(d => {
        if (cluster !== 'ALL' && d.clusterId !== parseInt(cluster)) return false;
        if (gender !== 'ALL' && d.gender !== gender) return false;
        if (category !== 'ALL' && d.preferredCategory !== category) return false;
        if (discount !== 'ALL' && d.discountSensitivity !== discount) return false;
        return true;
      });
    }

    function resetFilters() {
      document.getElementById('filterCluster').value = 'ALL';
      document.getElementById('filterGender').value = 'ALL';
      document.getElementById('filterCategory').value = 'ALL';
      document.getElementById('filterDiscount').value = 'ALL';
      updateDashboard();
    }

    function updateDashboard() {
      const data = getFilteredData();

      // Compute KPIs
      const count = data.length;
      let totalIncome = 0;
      let totalScore = 0;
      let totalRecency = 0;
      let totalSpend = 0;

      data.forEach(d => {
        totalIncome += d.annualIncome;
        totalScore += d.spendingScore;
        totalRecency += d.recencyDays;
        totalSpend += d.monetarySpend;
      });

      document.getElementById('kpiCount').textContent = count.toLocaleString();
      document.getElementById('kpiIncome').textContent = count > 0 ? "$" + Math.round(totalIncome / count) + "k" : "$0k";
      document.getElementById('kpiScore').textContent = count > 0 ? (totalScore / count).toFixed(1) + " / 100" : "0";
      document.getElementById('kpiRecency').textContent = count > 0 ? Math.round(totalRecency / count) + " days" : "0";
      document.getElementById('kpiSpend').textContent = count > 0 ? "$" + Math.round(totalSpend / count).toLocaleString() : "$0";

      renderScatterChart(data);
      renderShareChart(data);
      renderSpendChart(data);
      renderCategoryChart(data);
    }

    function renderScatterChart(data) {
      if (chartInstances.scatter) chartInstances.scatter.destroy();
      const ctx = document.getElementById('scatterChart').getContext('2d');

      const datasets = [0, 1, 2, 3].map(cid => {
        const clusterPoints = data.filter(d => d.clusterId === cid).map(d => ({ x: d.annualIncome, y: d.spendingScore }));
        const names = ["Champions", "Bargain Seekers", "Young Tech", "At-Risk"];
        return {
          label: names[cid],
          data: clusterPoints,
          backgroundColor: clusterColors[cid],
          pointRadius: 5,
          pointHoverRadius: 7
        };
      });

      chartInstances.scatter = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#f8fafc' } }
          },
          scales: {
            x: {
              title: { display: true, text: 'Annual Income ($k)', color: '#94a3b8' },
              grid: { color: '#23355d' },
              ticks: { color: '#94a3b8' }
            },
            y: {
              title: { display: true, text: 'Spending Score (1-100)', color: '#94a3b8' },
              grid: { color: '#23355d' },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      });
    }

    function renderShareChart(data) {
      if (chartInstances.share) chartInstances.share.destroy();
      const ctx = document.getElementById('shareChart').getContext('2d');

      const counts = [0, 1, 2, 3].map(cid => data.filter(d => d.clusterId === cid).length);
      const labels = ["Champions", "Bargain Seekers", "Young Tech", "At-Risk"];

      chartInstances.share = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: counts,
            backgroundColor: ['#10b981', '#fbbf24', '#38bdf8', '#f43f5e'],
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

    function renderSpendChart(data) {
      if (chartInstances.spend) chartInstances.spend.destroy();
      const ctx = document.getElementById('spendChart').getContext('2d');

      const labels = ["Champions", "Bargain Seekers", "Young Tech", "At-Risk"];
      const avgs = [0, 1, 2, 3].map(cid => {
        const cData = data.filter(d => d.clusterId === cid);
        if (cData.length === 0) return 0;
        return Math.round(cData.reduce((acc, d) => acc + d.monetarySpend, 0) / cData.length);
      });

      chartInstances.spend = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Avg Lifetime Spend ($)',
            data: avgs,
            backgroundColor: ['#10b981', '#fbbf24', '#38bdf8', '#f43f5e'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'transparent' }, ticks: { color: '#f8fafc' } },
            y: { grid: { color: '#23355d' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    function renderCategoryChart(data) {
      if (chartInstances.category) chartInstances.category.destroy();
      const ctx = document.getElementById('categoryChart').getContext('2d');

      const catMap = {};
      data.forEach(d => {
        catMap[d.preferredCategory] = (catMap[d.preferredCategory] || 0) + 1;
      });

      chartInstances.category = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(catMap),
          datasets: [{
            label: 'Customers',
            data: Object.values(catMap),
            backgroundColor: '#a855f7',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'transparent' }, ticks: { color: '#f8fafc' } },
            y: { grid: { color: '#23355d' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    window.onload = updateDashboard;
  </script>
</body>
</html>
`;

const previewPath = "C:\\Users\\C Srilekha\\.gemini\\antigravity\\scratch\\sales-revenue-powerbi-dashboard\\Customer_Segmentation_Preview.html";
fs.writeFileSync(previewPath, html, 'utf-8');
console.log(`Created Task 2 interactive preview at: ${previewPath}`);
