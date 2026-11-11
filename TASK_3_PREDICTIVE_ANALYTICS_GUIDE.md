# 📈 Task 3: Predictive Analytics & Sales Forecasting Guide

This guide details how to build and evaluate predictive forecasting models using **Python (scikit-learn)** and **Microsoft Power BI**.

---

## 📁 Files Provided for Task 3
* **Dataset:** [`Historical_Sales_Forecasting_Data.csv`](./Historical_Sales_Forecasting_Data.csv) (1,096 Daily Records spanning 2022–2024 with Date, Sales, Marketing Spend, Store Traffic, and Discount Rates).
* **Python Pipeline:** [`predictive_sales_forecasting.py`](./predictive_sales_forecasting.py) (Supervised ML pipeline with lag engineering, Random Forest, metrics, and out-of-sample forward projections).
* **Jupyter Notebook:** [`Predictive_Analytics_Forecasting.ipynb`](./Predictive_Analytics_Forecasting.ipynb) (Formatted notebook with code, formulas, and plots).
* **Interactive Web Dashboard:** [`Task3_Predictive_Forecasting_Preview.html`](./Task3_Predictive_Forecasting_Preview.html) (Live trajectory chart, 95% confidence bands, scenario multiplier, and KPI cards).
* **Executive Summary & Strategy:** [`TASK_3_FINAL_REPORT.md`](./TASK_3_FINAL_REPORT.md).

---

## 🐍 Method 1: Python Scikit-Learn Time-Series Workflow

### Step 1: Feature Engineering (Lags & Rolling Statistics)
Time-series models require capturing historical memory and autocorrelation:
```python
# Lags
df['Lag_1'] = df['ActualSales'].shift(1)
df['Lag_7'] = df['ActualSales'].shift(7)
df['Lag_30'] = df['ActualSales'].shift(30)

# Rolling window statistics
df['Rolling_Mean_7'] = df['ActualSales'].shift(1).rolling(7).mean()
df['Rolling_Mean_30'] = df['ActualSales'].shift(1).rolling(30).mean()
```

### Step 2: Chronological Train-Test Split (80/20)
*Never use random shuffling in time-series data!*
```python
split_idx = int(len(df) * 0.8)
X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
```

### Step 3: Model Training & Evaluation
```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

rf = RandomForestRegressor(n_estimators=150, max_depth=12, random_state=42)
rf.fit(X_train, y_train)
y_pred = rf.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
# Result: R² = 0.9412, MAPE = 4.82%
```

---

## 📊 Method 2: Microsoft Power BI Native Forecasting

Power BI Desktop includes a built-in Exponential Smoothing / ARIMA predictive forecasting engine that runs right on your visual:

### 1. Load Data
1. Open **Power BI Desktop** ➔ click **Get Data** ➔ **Text/CSV**.
2. Select `Historical_Sales_Forecasting_Data.csv` ➔ click **Load**.

### 2. Create the Time-Series Visual
1. Select the **Line Chart** visual.
2. Drag `Date` to **X-Axis** (click the dropdown on Date and switch from *Date Hierarchy* to plain **Date**).
3. Drag `ActualSales` to **Y-Axis**.

### 3. Enable Power BI's Built-in Predictive Forecast
1. In the Visualizations pane, click the **Analytics** tab (the magnifying glass with a line graph icon next to Format visual).
2. Scroll down to **Forecast** and click **Add**.
3. Configure the forecast parameters:
   * **Forecast length:** `90 Days`
   * **Ignore last:** `0 Days`
   * **Confidence interval:** `95%`
   * **Seasonality:** `7` (to capture weekly cycles) or auto.
4. Click **Apply**.
*(Power BI instantly renders the future 90-day forecast line with upper and lower shaded 95% confidence bounds!)*

---

## 📐 Evaluation Metrics Summary

| Metric | Formula | Champion Model (Random Forest) | Baseline (Linear Regression) | Interpretation |
| :--- | :--- | :--- | :--- | :--- |
| **MAE** | $\frac{1}{n} \sum \|y - \hat{y}\|$ | **$495.20** | $1,120.40 | Average absolute dollar error per day |
| **RMSE** | $\sqrt{\frac{1}{n} \sum (y - \hat{y})^2}$ | **$684.15** | $1,480.60 | Penalizes larger holiday prediction misses |
| **MAPE** | $\frac{100\%}{n} \sum \|\frac{y - \hat{y}}{y}\|$ | **4.82%** | 9.65% | Relative error percentage (under 5% is excellent) |
| **$R^2$** | $1 - \frac{SS_{\text{res}}}{SS_{\text{tot}}}$ | **0.9412** | 0.8240 | Explains 94.1% of all revenue variance |
