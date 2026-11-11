# 📊 Data Analytics & Machine Learning Capstone Portfolio

This repository contains three complete, end-to-end data analytics, business intelligence, and machine learning projects featuring **Power BI**, **DAX**, **Python (scikit-learn)**, and **Interactive Web Prototypes**.

---

## 📑 Portfolio Index

1. [Task 1: Sales & Revenue Analysis Dashboard](#-task-1-sales--revenue-analysis-dashboard)
2. [Task 2: Customer Segmentation Project](#-task-2-customer-segmentation-project)
3. [Task 3: Predictive Analytics & Revenue Forecasting](#-task-3-predictive-analytics--revenue-forecasting)

---

# 🚀 Task 1: Sales & Revenue Analysis Dashboard

### 🎯 Objective
Analyze corporate sales, revenue trends, and product performance using **Power BI**, **DAX**, and **Power Query**.

### 🔑 Features
* **Dataset:** 2,000 clean transactional sales records (2023–2024).
* **KPI Metrics:** Total Sales, Total Profit, Profit Margin %, Total Orders, Average Order Value (AOV), YoY Growth.
* **Interactive Visuals:** Date range slicer, Regional bar charts, Category donut charts, and Top 10 Best-Selling Products.
* **Interactive Web Preview:** Open `Dashboard_Preview.html` to test live filters in any browser.

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

### 📁 Task 1 Deliverables
* [`Sales_Data.csv`](./Sales_Data.csv) — 2,000 records ready for Power BI.
* [`Dashboard_Preview.html`](./Dashboard_Preview.html) — Live interactive HTML dashboard prototype.
* [`DAX_Measures.dax`](./DAX_Measures.dax) — Complete DAX measures library.
* [`Calendar_Table.dax`](./Calendar_Table.dax) — Date dimension script.
* [`POWER_BI_DIRECT_LINK_GUIDE.md`](./POWER_BI_DIRECT_LINK_GUIDE.md) — Step-by-step Power BI guide.
* [`TASK_1_FINAL_REPORT.md`](./TASK_1_FINAL_REPORT.md) — Business insights & findings.

---

# 🎯 Task 2: Customer Segmentation Project

### 🎯 Objective
Segment customers based on **demographics** (Age, Gender, Income) and **purchasing behaviors** (Recency, Frequency, Monetary spend, Spending score) using **K-Means Clustering** in Python (scikit-learn) and Power BI.

### 👥 Identified Customer Personas (K=4)
1. **Champions (High Value) — 28%:** High income ($105k+), highest spend, low recency (<25 days). Low discount sensitivity.
2. **Loyal Bargain Seekers — 26%:** Moderate income, frequent purchasers, driven by discounts, coupons, and bundles.
3. **Young Tech Explorers — 24%:** Gen-Z/Millennials, mobile-first, high tech category affinity and web visits.
4. **At-Risk / Dormant Customers — 22%:** Inactive (>180 days recency), low spending score, targeted for win-back campaigns.

```
+-----------------------------------------------------------------------------------+
|                   CUSTOMER SEGMENTATION & ANALYTICS DASHBOARD                     |
|  [ Slicer: Cluster ]   [ Slicer: Gender ]   [ Slicer: Category ]   [ Slicer: Disc ] |
+-----------------------------------------------------------------------------------+
|  [ Total Customers ]   [ Avg Income ]   [ Avg Spend Score ]   [ Avg Recency ]     |
+-----------------------------------------------------------------------------------+
|       Cluster Scatter (Income vs Spend)    |       Segment Share (Donut)          |
|             (Scatter Plot)                 |             (Donut Chart)            |
+-----------------------------------------------------------------------------------+
|          Monetary Spend by Cluster         |       Category Affinity by Cluster   |
|                 (Bar Chart)                |                 (Bar Chart)          |
+-----------------------------------------------------------------------------------+
```

### 📁 Task 2 Deliverables
* [`Customer_Segmentation_Data.csv`](./Customer_Segmentation_Data.csv) — 1,200 Customer profiles with assigned clusters.
* [`Customer_Segmentation_Preview.html`](./Customer_Segmentation_Preview.html) — Interactive HTML dashboard with dynamic scatter plot and persona cards.
* [`customer_segmentation_kmeans.py`](./customer_segmentation_kmeans.py) — Complete scikit-learn K-Means model script.
* [`Customer_Segmentation_Analysis.ipynb`](./Customer_Segmentation_Analysis.ipynb) — Formatted Jupyter Notebook.
* [`TASK_2_CUSTOMER_SEGMENTATION_GUIDE.md`](./TASK_2_CUSTOMER_SEGMENTATION_GUIDE.md) — Python & Power BI guide.
* [`TASK_2_FINAL_REPORT.md`](./TASK_2_FINAL_REPORT.md) — Executive report with targeting strategies.

---

# 📈 Task 3: Predictive Analytics & Revenue Forecasting

### 🎯 Objective
Build a predictive forecasting model to forecast future revenue trends using 3 years of historical daily data (2022–2024) with **supervised machine learning (Random Forest)**, **time-series lag engineering**, and **Power BI Predictive Forecasting**.

### 🔑 Features & Model Benchmarks
* **Historical Dataset:** 1,096 daily records with Sales, Marketing Spend, Store Traffic, and Discount Rates.
* **Feature Engineering:** Autocorrelation lags ($T-1, T-7, T-14, T-30$) and rolling averages (7-day, 30-day).
* **Champion Model:** Random Forest Regressor (**$R^2 = 0.9412$**, **MAPE = $4.82\%$**, **RMSE = $\$684$**).
* **Future Forecast:** 90-Day forward projection (Q1 2025) with 95% Confidence Intervals.

```
+-----------------------------------------------------------------------------------+
|                  PREDICTIVE ANALYTICS & REVENUE FORECASTING                       |
|   [ View: Full Trajectory / 90-Day Forecast ]    [ Scenario Multiplier: Baseline ]|
+-----------------------------------------------------------------------------------+
|   [ Model R² = 94.1% ]   [ MAPE = 4.82% ]   [ 90-Day Projected = $1.42M ]        |
+-----------------------------------------------------------------------------------+
|                Revenue Trajectory & 90-Day Predictive Forecast                    |
|          (Line Chart with Upper & Lower 95% Confidence Intervals)                 |
+-----------------------------------------------------------------------------------+
```

### 📁 Task 3 Deliverables
* [`Historical_Sales_Forecasting_Data.csv`](./Historical_Sales_Forecasting_Data.csv) — 1,096 daily time-series records.
* [`Task3_Predictive_Forecasting_Preview.html`](./Task3_Predictive_Forecasting_Preview.html) — Interactive forecast dashboard with confidence bands and scenario slider.
* [`predictive_sales_forecasting.py`](./predictive_sales_forecasting.py) — Python machine learning and time-series script.
* [`Predictive_Analytics_Forecasting.ipynb`](./Predictive_Analytics_Forecasting.ipynb) — Jupyter Notebook for model training & evaluation.
* [`TASK_3_PREDICTIVE_ANALYTICS_GUIDE.md`](./TASK_3_PREDICTIVE_ANALYTICS_GUIDE.md) — Python & Power BI Analytics Pane guide.
* [`TASK_3_FINAL_REPORT.md`](./TASK_3_FINAL_REPORT.md) — Executive report on projected revenue and risk factors.

---

## 🛠️ Complete Tech Stack
* **Business Intelligence:** Microsoft Power BI Desktop, DAX, Power Query (M), Analytics Forecasting
* **Machine Learning & Data Science:** Python, Pandas, NumPy, Scikit-Learn (K-Means, Random Forest Regressor, Linear Regression)
* **Frontend Visualization:** Chart.js, HTML5, CSS3, Seaborn, Matplotlib
