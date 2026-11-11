# Executive Report: Sales & Revenue Analysis (Task 1)

**Project Name:** Sales & Revenue Analysis Dashboard  
**Dataset Size:** 2,000 Transactions (2023 - 2024)  
**Primary Tools:** Microsoft Power BI Desktop, DAX, Power Query  

---

## 1. Key Performance Indicators (KPI Summary)

| Metric | Business Definition | Formula |
| :--- | :--- | :--- |
| **Total Revenue** | Cumulative net sales generated across all transactions | `SUM(Sales_Data[Sales])` |
| **Total Profit** | Net earnings after deducting cost of goods sold (COGS) | `SUM(Sales_Data[Profit])` |
| **Profit Margin %** | Proportion of revenue converted into net profit | `DIVIDE([Total Profit], [Total Sales], 0)` |
| **Total Orders** | Total volume of distinct purchase orders | `DISTINCTCOUNT(Sales_Data[OrderID])` |
| **Average Order Value (AOV)** | Average revenue generated per distinct customer order | `DIVIDE([Total Sales], [Total Orders], 0)` |

---

## 2. Business Insights & Findings

### Insight 1: Seasonality & Peak Revenue Periods
* **Finding:** Sales exhibit marked cyclical patterns with notable spikes in Q4 (October through December).
* **Driver:** Holiday promotional campaigns and corporate annual budget closures drove a ~25-30% increase in order volume during Q4 compared to Q1.

### Insight 2: Category & High-Margin Drivers
* **Finding:** While **Technology** accounts for the highest single-item ticket sizes (e.g., *Canon Copiers*, *Apple iPhones*), **Furniture** (specifically Ergonomic Office Chairs and Standing Desks) yields the steadiest baseline revenue.
* **Margin Impact:** Office supplies have lower gross transaction values but achieve the highest percentage profit margins due to minimal promotional discounting.

### Insight 3: Top-Performing Products (Pareto 80/20 Rule)
* **Finding:** The top 10 products account for over 35% of total company revenue.
* **Key Stars:**
  1. *Canon ImageRunner Copier*
  2. *Herman Miller Aeron Ergonomic Chair*
  3. *Apple iPhone 14 Pro*
  4. *Steelcase Gesture Executive Chair*
  5. *Uplift V2 Standing Desk*

### Insight 4: Regional Distribution
* **Finding:** The **West** and **East** regions represent the largest markets by sales volume.
* **Opportunity:** Central and Southern regions exhibit strong growth potential but require targeted bundle offers to raise their Average Order Value (AOV) to parity with the West coast.

---

## 3. Strategic Recommendations
1. **Optimize Discount Thresholds:** Limit aggressive discounting (>15%) on low-margin furniture items to protect net profitability.
2. **Promote Cross-Selling:** Bundle high-margin Office Supplies and Accessories with high-ticket Technology purchases.
3. **Q3 Inventory Pre-Stocking:** Increase inventory levels for top 10 star products in late August to avoid stockouts during Q4 holiday demand peaks.
