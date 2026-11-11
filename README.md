# 📊 Sales & Revenue Analysis Dashboard

An end-to-end Business Intelligence project designed to analyze corporate sales performance, profitability trends, and customer segments using **Microsoft Power BI**, **DAX**, and interactive web visualizations.

---

## 🎯 Project Overview & Objective
The goal of this project is to provide executive-level visibility into company revenue streams, track key performance indicators (KPIs), identify seasonal fluctuations, and highlight top-performing products across regions.

### 🔑 Key Features
* **Multi-Source Data Ingestion:** Integrated transactional dataset of 2,000 orders covering 2023–2024.
* **Interactive Slicers & Filters:** Dynamic cross-filtering by **Year**, **Region**, **Product Category**, and **Customer Segment**.
* **Executive KPI Cards:** Tracking Total Revenue, Total Profit, Profit Margin (%), Total Order Volume, and Average Order Value (AOV).
* **Time-Intelligence & Trend Analysis:** Monthly sales trajectory mapping seasonal spikes and Q4 holiday surges.
* **Top-N Analysis:** Automated ranking of the top 10 best-selling products by sales volume.
* **Geographical & Category Share:** Segmented visual breakdown across Technology, Furniture, and Office Supplies.

---

## 📈 Dashboard Layout & Visuals

```
+-----------------------------------------------------------------------------------+
|                     SALES & REVENUE ANALYSIS DASHBOARD                            |
|  [ Slicer: Year ]    [ Slicer: Region ]    [ Slicer: Category ]   [ Slicer: Seg ] |
+-----------------------------------------------------------------------------------+
|  [ Total Revenue ]   [ Total Profit ]   [ Profit Margin % ]   [ Total Orders ]    |
+-----------------------------------------------------------------------------------+
|            Monthly Revenue Trend           |         Revenue by Category          |
|                 (Line Chart)               |             (Donut Chart)            |
+-----------------------------------------------------------------------------------+
|         Top 10 Best-Selling Products       |      Regional Sales Performance      |
|             (Clustered Bar Chart)          |         (Clustered Column Chart)     |
+-----------------------------------------------------------------------------------+
```

---

## 📐 Key DAX Measures Used

* **Total Sales:**
  ```dax
  Total Sales = SUM(Sales_Data[Sales])
  ```
* **Total Profit:**
  ```dax
  Total Profit = SUM(Sales_Data[Profit])
  ```
* **Profit Margin (%):**
  ```dax
  Profit Margin % = DIVIDE([Total Profit], [Total Sales], 0)
  ```
* **Total Orders:**
  ```dax
  Total Orders = DISTINCTCOUNT(Sales_Data[OrderID])
  ```
* **Average Order Value (AOV):**
  ```dax
  Average Order Value = DIVIDE([Total Sales], [Total Orders], 0)
  ```

---

## 📁 Repository Structure

```
├── Sales_Data.csv                 # Clean 2,000-row transactional sales dataset
├── Dashboard_Preview.html         # Interactive web-based prototype preview (Chart.js)
├── DAX_Measures.dax               # Complete collection of DAX measures & formulas
├── Calendar_Table.dax             # Dedicated Date Dimension DAX script
├── PowerQuery_AdvancedEditor.pq   # Power Query M-code transformation script
├── POWER_BI_DIRECT_LINK_GUIDE.md  # Step-by-step tutorial to build in Power BI Desktop
├── TASK_1_FINAL_REPORT.md         # Detailed business insights and recommendations
└── README.md                      # Project documentation
```

---

## 🚀 How to Run / Open

### 1. View the Interactive Prototype
Simply double-click `Dashboard_Preview.html` to open the fully interactive dashboard preview in any browser.

### 2. Open in Microsoft Power BI Desktop
1. Open **Power BI Desktop**.
2. Click **Get Data** ➔ **Text/CSV** ➔ Select `Sales_Data.csv`.
3. Open `DAX_Measures.dax` and add measures via **Modeling ➔ New Measure**.
4. Follow [POWER_BI_DIRECT_LINK_GUIDE.md](./POWER_BI_DIRECT_LINK_GUIDE.md) to arrange visuals.

---

## 💡 Key Business Insights
1. **Seasonal Q4 Spikes:** Sales surge by ~28% in Q4 (Oct–Dec) driven by promotional campaigns.
2. **High Ticket vs. High Margin:** Technology produces the highest ticket sizes, while Office Supplies deliver the highest net profit margins.
3. **Product Concentration:** The top 10 products drive over 35% of total revenue.
