"""
================================================================================
Task 3: Predictive Analytics & Sales Forecasting (Regression & Time-Series)
================================================================================
Description:
    Builds supervised machine learning and time-series models to predict future
    revenue trends based on historical data (2022–2024). Features lag engineering,
    rolling statistics, model evaluation (MAE, RMSE, MAPE, R2), and a 90-day
    forward projection.
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt

# 1. Ingest Historical Data
data_path = "Historical_Sales_Forecasting_Data.csv"
print(f"Loading historical time-series data from {data_path}...")
df = pd.read_csv(data_path)
df['Date'] = pd.to_datetime(df['Date'])
df = df.sort_values('Date').reset_index(drop=True)

print(f"Loaded {len(df)} daily records from {df['Date'].min().date()} to {df['Date'].max().date()}")

# 2. Time-Series Feature Engineering
print("\nCreating Lag and Rolling Statistics Features...")
df['Lag_1'] = df['ActualSales'].shift(1)
df['Lag_7'] = df['ActualSales'].shift(7)
df['Lag_14'] = df['ActualSales'].shift(14)
df['Lag_30'] = df['ActualSales'].shift(30)

df['Rolling_Mean_7'] = df['ActualSales'].shift(1).rolling(window=7).mean()
df['Rolling_Mean_30'] = df['ActualSales'].shift(1).rolling(window=30).mean()
df['Rolling_Std_7'] = df['ActualSales'].shift(1).rolling(window=7).std()

# Day of week integer (0=Mon, 6=Sun)
df['DayOfWeek_Num'] = df['Date'].dt.dayofweek

# Drop rows where lag creation produced NaNs (first 30 days)
model_df = df.dropna().copy().reset_index(drop=True)

feature_cols = [
    'MarketingSpend',
    'StoreTraffic',
    'DiscountRate',
    'IsWeekend',
    'IsHoliday',
    'DayOfWeek_Num',
    'Month',
    'Lag_1',
    'Lag_7',
    'Lag_14',
    'Lag_30',
    'Rolling_Mean_7',
    'Rolling_Mean_30',
    'Rolling_Std_7'
]

X = model_df[feature_cols]
y = model_df['ActualSales']

# 3. Train-Test Split (Chronological Split: 80% Train, 20% Test)
split_idx = int(len(model_df) * 0.8)
X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
test_dates = model_df['Date'].iloc[split_idx:]

print(f"Training samples: {len(X_train)} | Testing samples: {len(X_test)}")

# 4. Train Models
# Model A: Linear Regression
lr_model = LinearRegression()
lr_model.fit(X_train, y_train)
lr_preds = lr_model.predict(X_test)

# Model B: Random Forest Regressor
rf_model = RandomForestRegressor(n_estimators=150, max_depth=12, random_state=42)
rf_model.fit(X_train, y_train)
rf_preds = rf_model.predict(X_test)

# 5. Model Evaluation Functions
def evaluate_model(name, y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    r2 = r2_score(y_true, y_pred)
    print(f"\n--- {name} Performance ---")
    print(f"  MAE  (Mean Absolute Error):          ${mae:,.2f}")
    print(f"  RMSE (Root Mean Squared Error):      ${rmse:,.2f}")
    print(f"  MAPE (Mean Absolute % Error):         {mape:.2f}%")
    print(f"  R² Score (Variance Explained):        {r2:.4f}")
    return {"MAE": mae, "RMSE": rmse, "MAPE": mape, "R2": r2}

metrics_lr = evaluate_model("Linear Regression", y_test, lr_preds)
metrics_rf = evaluate_model("Random Forest Regressor (Champion)", y_test, rf_preds)

# 6. Future 90-Day Forecast Generation (Q1 2025)
print("\nGenerating 90-Day Forward Forecast (Q1 2025)...")
last_date = df['Date'].max()
future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=90)

# Simulate realistic forward features with baseline growth
future_records = []
current_history = list(df['ActualSales'].values)

for i, f_date in enumerate(future_dates):
    dow = f_date.dayofweek
    is_wknd = 1 if dow in [5, 6] else 0
    month = f_date.month
    
    # Lag retrieval
    lag1 = current_history[-1]
    lag7 = current_history[-7]
    lag14 = current_history[-14]
    lag30 = current_history[-30]
    roll7 = np.mean(current_history[-7:])
    roll30 = np.mean(current_history[-30:])
    roll7_std = np.std(current_history[-7:])
    
    # Expected baseline inputs
    mkt = 1400 if is_wknd else 1100
    traffic = int(roll7 / 6 + mkt * 1.4)
    disc = 0.05
    is_holiday = 1 if (f_date.month == 1 and f_date.day in [1, 15]) else 0
    
    row_features = pd.DataFrame([{
        'MarketingSpend': mkt,
        'StoreTraffic': traffic,
        'DiscountRate': disc,
        'IsWeekend': is_wknd,
        'IsHoliday': is_holiday,
        'DayOfWeek_Num': dow,
        'Month': month,
        'Lag_1': lag1,
        'Lag_7': lag7,
        'Lag_14': lag14,
        'Lag_30': lag30,
        'Rolling_Mean_7': roll7,
        'Rolling_Mean_30': roll30,
        'Rolling_Std_7': roll7_std
    }])
    
    pred_val = float(rf_model.predict(row_features)[0])
    current_history.append(pred_val)
    
    # 95% Confidence Intervals (+/- 1.96 * RMSE)
    margin = 1.96 * metrics_rf['RMSE']
    
    future_records.append({
        'Date': f_date.strftime('%Y-%m-%d'),
        'ForecastedSales': round(pred_val, 2),
        'LowerBound_95': round(max(0, pred_val - margin), 2),
        'UpperBound_95': round(pred_val + margin, 2)
    })

forecast_df = pd.DataFrame(future_records)
forecast_df.to_csv("Future_90Day_Sales_Forecast.csv", index=False)
print("Saved 90-day forward forecast to: Future_90Day_Sales_Forecast.csv")
print("\nPredictive analytics workflow completed successfully!")
