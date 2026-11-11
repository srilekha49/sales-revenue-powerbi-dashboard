# 🧹 Task 4: Data Cleaning & Reporting Automation Guide

This guide details how to build and automate repeatable data preprocessing and reporting pipelines using **Python (Pandas)**, **Microsoft Excel**, and **Power BI (Power Query)**.

---

## 📁 Files Provided for Task 4
* **Raw Dirty Dataset:** [`raw_uncleaned_sales_data.csv`](./raw_uncleaned_sales_data.csv) (1,500 uncleaned operational records with duplicate IDs, whitespace, formatting discrepancies, and missing values).
* **Automated Python Pipeline:** [`automated_data_cleaning_pipeline.py`](./automated_data_cleaning_pipeline.py) (Production script that performs automated deduplication, sanitization, formula recalculation, and audit logging).
* **Cleaned Reporting Dataset:** [`cleaned_sales_report_data.csv`](./cleaned_sales_report_data.csv) (650 verified, clean transactional records).
* **Power Query Automation M-Code:** [`Data_Cleaning_PowerQuery.m`](./Data_Cleaning_PowerQuery.m) (Automated refresh script for Excel and Power BI).
* **Jupyter Notebook:** [`Data_Cleaning_and_Reporting_Automation.ipynb`](./Data_Cleaning_and_Reporting_Automation.ipynb) (Before vs. After data quality profiling).
* **Interactive Web Dashboard:** [`Task4_Cleaning_Automation_Preview.html`](./Task4_Cleaning_Automation_Preview.html) (Live Before vs. After comparison widget, audit logs, and automated summary reports).
* **Executive Summary Report:** [`TASK_4_FINAL_REPORT.md`](./TASK_4_FINAL_REPORT.md).

---

## 🐍 Method 1: Python Automated Preprocessing Pipeline

### 1. Automated Deduplication
```python
# Purge exact and partial duplicate transaction IDs, preserving the first valid record
df = df_raw.drop_duplicates(subset=['Order_ID'], keep='first').copy()
```

### 2. String Cleaning & Text Normalization
```python
# Trim whitespace and enforce Proper Title Case
df['Customer_Name'] = df['Customer_Name'].fillna('Valued Customer').astype(str).str.strip().str.title()

# Standardize non-canonical category codes
def standardize_category(val):
    s = str(val).strip().lower()
    if 'tech' in s: return 'Technology'
    if 'furn' in s: return 'Furniture'
    return 'Office Supplies'

df['Category'] = df['Category'].apply(standardize_category)
```

### 3. Sanitizing Currency & Percentages
```python
# Strip currency symbols and commas
df['Unit_Price'] = df['Unit_Price'].astype(str).str.replace(r'[\$,USD ]', '', regex=True).astype(float)

# Convert percentage strings to decimal floats
df['Discount'] = df['Discount'].astype(str).str.replace('%', '').str.strip().astype(float)
df['Discount'] = df['Discount'].apply(lambda d: d / 100.0 if d > 1.0 else d)
```

### 4. Recalculating Missing / Corrupted Formulas
```python
# Recompute accurate Sales Amount: UnitPrice * Quantity * (1 - Discount)
df['Sales_Amount'] = (df['Unit_Price'] * df['Quantity'] * (1 - df['Discount'])).round(2)
```

---

## 📊 Method 2: Microsoft Excel & Power Query Automation

### 1. Essential Spreadsheet Formulas (From the Tutorial)
* **Trim Trailing/Leading Spaces:** `=TRIM(A2)`
* **Standardize to Proper Case:** `=PROPER(TRIM(B2))`
* **Prevent Pipeline Formula Errors:** `=IFERROR(VLOOKUP(...), "Default Value")`
* **Remove Duplicates:** Data Tab ➔ **Remove Duplicates** (select `Order_ID`).

### 2. Full Power Query Automation (One-Click Refresh)
1. Open Excel or Power BI Desktop.
2. Go to **Data** tab ➔ **Get Data** ➔ **Blank Query**.
3. Open **Advanced Editor** and paste the code from [`Data_Cleaning_PowerQuery.m`](./Data_Cleaning_PowerQuery.m).
4. Click **Done** and **Close & Apply**.
*(Every time you drop a new raw file into the folder, clicking **Refresh** automatically applies all 8 cleaning steps in under 1 second!)*

---

## 📋 Data Quality Transformation Summary

| Feature | Raw Dirty Input Example | Automated Cleaned Output | Transformation Applied |
| :--- | :--- | :--- | :--- |
| **Order_ID** | Repeated 3 times | 1 Unique Record Kept | `drop_duplicates(subset=['Order_ID'])` |
| **Customer_Name** | `"   jane smith  "` | `"Jane Smith"` | `TRIM` + `PROPER` (Title Case) |
| **Category** | `"  TECH  "` | `"Technology"` | Substring regex mapping |
| **Unit_Price** | `"$1,250.00 USD"` | `1250.00` | Strip symbols, cast to `Float64` |
| **Quantity** | `-2` (Negative anomaly) | `1` | Anomaly floor correction |
| **Discount** | `"15%"` | `0.15` | Strip `%`, divide by 100 |
| **Sales_Amount** | `""` (Empty cell) | `$1,062.50` | `Unit_Price * Quantity * (1 - Discount)` |
| **Order_Date** | `"15/01/2024"` | `2024-01-15` | ISO-8601 normalization |
