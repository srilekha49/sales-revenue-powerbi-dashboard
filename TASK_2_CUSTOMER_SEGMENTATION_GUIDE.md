# 🎯 Task 2: Customer Segmentation Project Guide

This guide details how to perform customer segmentation using **both Python (scikit-learn)** and **Microsoft Power BI**.

---

## 📁 Files Provided for Task 2
* **Dataset:** [`Customer_Segmentation_Data.csv`](./Customer_Segmentation_Data.csv) (1,200 Customer Profiles with Demographics & RFM Behavioral metrics).
* **Python Script:** [`customer_segmentation_kmeans.py`](./customer_segmentation_kmeans.py) (Full scikit-learn K-Means pipeline).
* **Jupyter Notebook:** [`Customer_Segmentation_Analysis.ipynb`](./Customer_Segmentation_Analysis.ipynb) (Formatted notebook with visualizations & outputs).
* **Interactive Web Dashboard:** [`Customer_Segmentation_Preview.html`](./Customer_Segmentation_Preview.html) (Live scatter plot, RFM slicers, and persona cards).
* **Executive Summary & Strategy:** [`TASK_2_FINAL_REPORT.md`](./TASK_2_FINAL_REPORT.md).

---

## 🐍 Method 1: Python & Scikit-Learn Implementation

### Step 1: Feature Selection & Scaling
Clustering requires standardizing features because Euclidean distance is sensitive to scale:
```python
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

features = ['Age', 'AnnualIncome_k', 'SpendingScore', 'RecencyDays', 'FrequencyOrders', 'MonetaryTotalSpend']
X = df[features]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

### Step 2: Optimal K Selection (Elbow Method)
```python
wcss = []
for k in range(1, 10):
    km = KMeans(n_clusters=k, init='k-means++', random_state=42)
    km.fit(X_scaled)
    wcss.append(km.inertia_)

# The inflection point ("elbow") occurs at K = 4
```

### Step 3: Train Final Model (K=4)
```python
kmeans = KMeans(n_clusters=4, init='k-means++', random_state=42)
df['ClusterID'] = kmeans.fit_predict(X_scaled)
```

---

## 📊 Method 2: Microsoft Power BI Implementation

### 1. Load Data
1. In **Power BI Desktop**, click **Get Data** ➔ **Text/CSV**.
2. Select `Customer_Segmentation_Data.csv` and click **Load**.

### 2. Native Power BI Clustering (Automated)
Power BI has a built-in machine learning clustering engine:
1. Select the **Scatter Chart** visual from the Visualizations pane.
2. Drag `AnnualIncome_k` to **X-Axis**.
3. Drag `SpendingScore` to **Y-Axis**.
4. Drag `CustomerID` to **Values**.
5. Click the three dots `...` in the top-right corner of the visual ➔ select **"Automatically find clusters"**.
6. Set number of clusters to **4** (or leave auto) and click **OK**.
*(Power BI automatically calculates K-Means clusters and adds a new cluster column to your fields!)*

### 3. Alternative: Use Pre-Computed Clusters
You can also directly drag `ClusterName` into the **Legend** field of the Scatter Chart to color-code the 4 segments:
* **Green:** Champions (High Value)
* **Yellow:** Loyal Bargain Seekers
* **Blue:** Young Tech Explorers
* **Red:** At-Risk (Low Engagement)

### 4. Build Supporting Visuals
* **KPI Cards:** Average Annual Income, Average Spending Score, Average Recency (Days), Average Lifetime Spend.
* **Donut Chart:** Legend = `ClusterName`, Values = Count of `CustomerID`.
* **Bar Chart:** X-axis = `ClusterName`, Y-axis = Average of `MonetaryTotalSpend`.
* **Slicers:** Slicer 1 = `ClusterName`, Slicer 2 = `Gender`, Slicer 3 = `PreferredCategory`.

---

## 👥 Customer Persona Breakdown

| Cluster | Persona Name | Key Demographic & Behavioral Traits | Recommended Business Strategy |
| :--- | :--- | :--- | :--- |
| **0** | **Champions (High Value)** | Income $75k–$140k, Spend Score 70–99, Recency < 30 days, 15+ orders | VIP loyalty concierge, early access product drops, zero discounting. |
| **1** | **Loyal Bargain Seekers** | Income $25k–$65k, high discount sensitivity, frequent orders | Bundle discounts (BOGO), flash clearance sales, coupon promotions. |
| **2** | **Young Tech Explorers** | Age 18–31, high website visits, top category: Technology | Social ads (TikTok/Instagram), mobile push notifications, BNPL options. |
| **3** | **At-Risk (Low Engagement)** | Recency 90–360+ days, spend score < 40, low order frequency | "We Miss You" win-back automated email series with a special reactivation offer. |
