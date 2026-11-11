"""
================================================================================
Task 2: Customer Segmentation using K-Means Clustering (scikit-learn)
================================================================================
Description:
    Performs behavioral and demographic customer segmentation using unsupervised
    machine learning (K-Means Clustering). Analyzes purchase patterns, RFM
    (Recency, Frequency, Monetary) metrics, and profiles customer groups.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt
import seaborn as sns

# 1. Load Dataset
data_path = "Customer_Segmentation_Data.csv"
print(f"Loading customer data from {data_path}...")
df = pd.read_csv(data_path)

print(f"Total customers loaded: {len(df)}")
print("\n--- First 5 Records ---")
print(df.head())

# 2. Select Features for Clustering
# Combining Demographic (Age, Income) and Behavioral/RFM (SpendingScore, Recency, Frequency, Monetary)
features = [
    'Age',
    'AnnualIncome_k',
    'SpendingScore',
    'RecencyDays',
    'FrequencyOrders',
    'MonetaryTotalSpend'
]

X = df[features]

# 3. Feature Scaling (Standardization)
# K-Means is sensitive to feature variance, so we standardize to mean=0, std=1
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 4. Finding Optimal K using the Elbow Method & Silhouette Scores
print("\nEvaluating Optimal K (Elbow Method & Silhouette Scores)...")
wcss = []
silhouette_scores = []
k_range = range(2, 9)

for k in k_range:
    kmeans_test = KMeans(n_clusters=k, init='k-means++', max_iter=300, n_init=10, random_state=42)
    kmeans_test.fit(X_scaled)
    wcss.append(kmeans_test.inertia_)
    score = silhouette_score(X_scaled, kmeans_test.labels_)
    silhouette_scores.append(score)
    print(f"  K={k}: Inertia (WCSS) = {kmeans_test.inertia_:.1f}, Silhouette Score = {score:.4f}")

# 5. Fit Final K-Means Model (Optimal K = 4)
optimal_k = 4
print(f"\nTraining Final K-Means model with K={optimal_k}...")
kmeans = KMeans(n_clusters=optimal_k, init='k-means++', max_iter=300, n_init=10, random_state=42)
df['Predicted_Cluster'] = kmeans.fit_predict(X_scaled)

# 6. Customer Personas & Segment Mapping
cluster_labels = {
    0: "Champions (High Value)",
    1: "Loyal Bargain Seekers",
    2: "Young Tech Explorers",
    3: "At-Risk (Low Engagement)"
}
df['Segment_Persona'] = df['Predicted_Cluster'].map(cluster_labels)

# 7. Cluster Profiling & Summary Statistics
print("\n" + "="*80)
print("CUSTOMER SEGMENTATION SUMMARY PROFILES (AVERAGES)")
print("="*80)

profile = df.groupby('Segment_Persona')[features].mean().round(2)
profile['Customer_Count'] = df.groupby('Segment_Persona').size()
profile['Percentage_%'] = (profile['Customer_Count'] / len(df) * 100).round(1)

print(profile)

# Save segmented output
output_file = "Customer_Segmentation_Results.csv"
df.to_csv(output_file, index=False)
print(f"\nSaved segmented results to: {output_file}")
print("Completed successfully!")
