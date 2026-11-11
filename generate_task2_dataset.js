const fs = require('fs');
const path = require('path');

const targetDir = "C:\\Users\\C Srilekha\\.gemini\\antigravity\\scratch\\sales-revenue-powerbi-dashboard";

const categories = ["Technology", "Furniture", "Office Supplies", "Fashion"];
const genders = ["Male", "Female"];
const maritalStatuses = ["Single", "Married", "Divorced"];

// 4 archetypal clusters for realistic clustering
// 0: Champions / High-Value (High Income, High Spend, High Frequency, Low Recency)
// 1: Loyal Bargain Seekers (Mid-Low Income, High Frequency, High Discount Sensitivity)
// 2: Young Tech Enthusiasts (Younger Age, Mid-High Income, Technology preference, High Web Visits)
// 3: At-Risk / Low Engagement (Older/Mixed, High Recency, Low Frequency, Low Spend)

const rows = [];
rows.push([
  "CustomerID",
  "Age",
  "Gender",
  "MaritalStatus",
  "AnnualIncome_k",
  "SpendingScore",
  "RecencyDays",
  "FrequencyOrders",
  "MonetaryTotalSpend",
  "PreferredCategory",
  "DiscountSensitivity",
  "WebVisitsPerMonth",
  "ClusterID",
  "ClusterName"
].join(","));

const totalCustomers = 1200;

for (let i = 1; i <= totalCustomers; i++) {
  const customerId = `CUST-${String(2000 + i)}`;
  const gender = genders[Math.floor(Math.random() * genders.length)];
  const marital = maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)];
  
  // Decide cluster
  const rand = Math.random();
  let clusterId, clusterName, age, income, spendingScore, recency, freq, spend, category, discountSens, webVisits;

  if (rand < 0.28) {
    // Cluster 0: High-Value Champions
    clusterId = 0;
    clusterName = "Champions (High Value)";
    age = 32 + Math.floor(Math.random() * 25); // 32 - 56
    income = 75 + Math.floor(Math.random() * 65); // 75k - 140k
    spendingScore = 70 + Math.floor(Math.random() * 30); // 70 - 99
    recency = 3 + Math.floor(Math.random() * 30); // 3 - 32 days
    freq = 15 + Math.floor(Math.random() * 20); // 15 - 34 orders
    spend = Number((income * 75 + freq * 350 + Math.random() * 2000).toFixed(2));
    category = Math.random() < 0.6 ? "Technology" : "Furniture";
    discountSens = "Low";
    webVisits = 12 + Math.floor(Math.random() * 15);
  } else if (rand < 0.54) {
    // Cluster 1: Loyal Bargain Seekers
    clusterId = 1;
    clusterName = "Loyal Bargain Seekers";
    age = 26 + Math.floor(Math.random() * 35); // 26 - 60
    income = 25 + Math.floor(Math.random() * 40); // 25k - 65k
    spendingScore = 55 + Math.floor(Math.random() * 35); // 55 - 89
    recency = 10 + Math.floor(Math.random() * 50); // 10 - 60 days
    freq = 10 + Math.floor(Math.random() * 15); // 10 - 24 orders
    spend = Number((income * 35 + freq * 120 + Math.random() * 800).toFixed(2));
    category = Math.random() < 0.5 ? "Office Supplies" : "Fashion";
    discountSens = "High";
    webVisits = 15 + Math.floor(Math.random() * 20);
  } else if (rand < 0.78) {
    // Cluster 2: Young Tech Explorers
    clusterId = 2;
    clusterName = "Young Tech Explorers";
    age = 18 + Math.floor(Math.random() * 14); // 18 - 31
    income = 45 + Math.floor(Math.random() * 45); // 45k - 90k
    spendingScore = 60 + Math.floor(Math.random() * 35); // 60 - 94
    recency = 5 + Math.floor(Math.random() * 40); // 5 - 45 days
    freq = 8 + Math.floor(Math.random() * 12); // 8 - 19 orders
    spend = Number((income * 45 + freq * 250 + Math.random() * 1200).toFixed(2));
    category = "Technology";
    discountSens = "Medium";
    webVisits = 20 + Math.floor(Math.random() * 25);
  } else {
    // Cluster 3: At-Risk / Low Engagement
    clusterId = 3;
    clusterName = "At-Risk (Low Engagement)";
    age = 35 + Math.floor(Math.random() * 35); // 35 - 70
    income = 20 + Math.floor(Math.random() * 70); // 20k - 90k
    spendingScore = 10 + Math.floor(Math.random() * 30); // 10 - 39
    recency = 90 + Math.floor(Math.random() * 270); // 90 - 360 days
    freq = 1 + Math.floor(Math.random() * 4); // 1 - 4 orders
    spend = Number((income * 12 + freq * 80 + Math.random() * 300).toFixed(2));
    category = categories[Math.floor(Math.random() * categories.length)];
    discountSens = Math.random() < 0.5 ? "Medium" : "High";
    webVisits = 1 + Math.floor(Math.random() * 6);
  }

  rows.push([
    customerId,
    age,
    gender,
    marital,
    income,
    spendingScore,
    recency,
    freq,
    spend,
    category,
    discountSens,
    webVisits,
    clusterId,
    `"${clusterName}"`
  ].join(","));
}

const csvPath = path.join(targetDir, "Customer_Segmentation_Data.csv");
fs.writeFileSync(csvPath, rows.join("\r\n"), 'utf-8');
console.log(`Generated ${totalCustomers} customer records at: ${csvPath}`);
