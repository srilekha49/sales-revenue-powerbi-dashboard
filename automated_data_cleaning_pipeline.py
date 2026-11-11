"""
================================================================================
Task 4: Automated Data Cleaning & Reporting Pipeline
================================================================================
Description:
    End-to-end automated pipeline to ingest raw, messy operational data, perform
    automated deduplication, text normalization, missing value imputation, type
    casting, anomaly correction, and generate automated visual & tabular reports.
"""

import pandas as pd
import numpy as np
import json
import re

def clean_currency(val):
    """Strips currency symbols ($ , USD), whitespace, and casts to float."""
    if pd.isna(val):
        return np.nan
    val_str = str(val).replace('$', '').replace('USD', '').replace(',', '').strip()
    try:
        return float(val_str)
    except ValueError:
        return np.nan

def clean_discount(val):
    """Converts percentages (e.g., '15%') and decimals into float fractions."""
    if pd.isna(val) or str(val).strip() == '':
        return 0.0
    val_str = str(val).replace('%', '').strip()
    try:
        num = float(val_str)
        return num / 100.0 if num > 1.0 else num
    except ValueError:
        return 0.0

def standardize_category(val):
    """Normalizes erratic category strings into canonical categories."""
    if pd.isna(val):
        return 'Office Supplies'
    s = str(val).strip().lower()
    if 'tech' in s:
        return 'Technology'
    elif 'furn' in s:
        return 'Furniture'
    elif 'off' in s or 'suppl' in s:
        return 'Office Supplies'
    return 'Office Supplies'

def standardize_region(val):
    """Cleans region names and standardizes casing."""
    if pd.isna(val) or str(val).strip() == '' or str(val).lower() == 'null':
        return 'Central'  # Default imputation
    s = str(val).strip().capitalize()
    valid_regions = ['West', 'East', 'Central', 'South']
    return s if s in valid_regions else 'Central'

def run_automated_cleaning_pipeline(raw_file_path, cleaned_output_path):
    print("="*80)
    print("STEP 1: INGESTING RAW DIRTY DATASET")
    print("="*80)
    df_raw = pd.read_csv(raw_file_path)
    initial_rows = len(df_raw)
    print(f"Raw rows ingested: {initial_rows}")
    
    audit_log = {
        "raw_record_count": initial_rows,
        "initial_null_counts": df_raw.isnull().sum().to_dict(),
        "duplicates_removed": 0,
        "negative_quantities_fixed": 0,
        "missing_values_imputed": 0,
        "final_clean_record_count": 0
    }

    # 1. Deduplication
    print("\nSTEP 2: AUTOMATED DEDUPLICATION")
    df = df_raw.drop_duplicates(subset=['Order_ID'], keep='first').copy()
    duplicates_removed = initial_rows - len(df)
    audit_log["duplicates_removed"] = int(duplicates_removed)
    print(f"  --> Identified and removed {duplicates_removed} duplicate records.")

    # 2. String Standardization & Whitespace Trimming
    print("\nSTEP 3: TEXT STANDARDIZATION & TRIMMING")
    df['Customer_Name'] = df['Customer_Name'].fillna('Valued Customer').astype(str).str.strip().str.title()
    df['Category'] = df['Category'].apply(standardize_category)
    df['Region'] = df['Region'].apply(standardize_region)

    # 3. Numeric & Currency Sanitization
    print("\nSTEP 4: NUMERIC & CURRENCY SANITIZATION")
    df['Unit_Price'] = df['Unit_Price'].apply(clean_currency)
    df['Discount'] = df['Discount'].apply(clean_discount)
    
    # Impute missing unit price with category median
    cat_price_median = df.groupby('Category')['Unit_Price'].transform('median')
    df['Unit_Price'] = df['Unit_Price'].fillna(cat_price_median)

    # Clean Quantity (convert strings, negatives, and NaNs)
    df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce')
    neg_qty = (df['Quantity'] <= 0).sum()
    audit_log["negative_quantities_fixed"] = int(neg_qty)
    df['Quantity'] = df['Quantity'].apply(lambda q: 1 if pd.isna(q) or q <= 0 else int(q))

    # Clean / Recalculate Sales Amount
    df['Sales_Amount'] = df['Sales_Amount'].apply(clean_currency)
    missing_sales = df['Sales_Amount'].isnull().sum()
    audit_log["missing_values_imputed"] = int(missing_sales)
    
    # Accurate recomputation: UnitPrice * Quantity * (1 - Discount)
    calculated_sales = (df['Unit_Price'] * df['Quantity'] * (1 - df['Discount'])).round(2)
    df['Sales_Amount'] = df['Sales_Amount'].fillna(calculated_sales)

    # 4. Date Normalization
    print("\nSTEP 5: DATE NORMALIZATION TO ISO-8601 (YYYY-MM-DD)")
    df['Order_Date'] = pd.to_datetime(df['Order_Date'], errors='coerce', dayfirst=True)
    df['Order_Date'] = df['Order_Date'].dt.strftime('%Y-%m-%d')

    audit_log["final_clean_record_count"] = len(df)

    # 5. Export Clean Data
    df.to_csv(cleaned_output_path, index=False)
    print(f"\nCleaned dataset exported to: {cleaned_output_path}")

    # 6. Generate Automated Summary Report
    print("\n" + "="*80)
    print("STEP 6: AUTOMATED EXECUTIVE SUMMARY REPORT")
    print("="*80)
    
    total_sales = df['Sales_Amount'].sum()
    total_orders = len(df)
    aov = total_sales / total_orders
    
    print(f"Total Cleaned Revenue:     ${total_sales:,.2f}")
    print(f"Total Verified Orders:     {total_orders:,}")
    print(f"Average Order Value (AOV): ${aov:,.2f}")
    
    print("\n--- Revenue Breakdown by Category ---")
    cat_summary = df.groupby('Category')['Sales_Amount'].agg(['sum', 'count', 'mean']).round(2)
    cat_summary.columns = ['Total Revenue ($)', 'Order Count', 'Average Order ($)']
    print(cat_summary)
    
    print("\n--- Revenue Breakdown by Region ---")
    reg_summary = df.groupby('Region')['Sales_Amount'].agg(['sum', 'count']).round(2)
    reg_summary.columns = ['Total Revenue ($)', 'Order Count']
    print(reg_summary)

    # Save audit log
    with open("cleaning_audit_summary.json", "w") as f:
        json.dump(audit_log, f, indent=4)
    print("\nAudit log saved to: cleaning_audit_summary.json")

if __name__ == "__main__":
    run_automated_cleaning_pipeline(
        "raw_uncleaned_sales_data.csv",
        "cleaned_sales_report_data.csv"
    )
