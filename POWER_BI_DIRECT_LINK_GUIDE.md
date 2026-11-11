# Step-by-Step Guide: Direct Linking with Power BI Desktop

All files for this project are located in:
`C:\Users\C Srilekha\.gemini\antigravity\scratch\sales-revenue-powerbi-dashboard\`

---

## 🚀 Quick Start (Connect in 3 Clicks)

### 1. Open Power BI Desktop
* Launch **Power BI Desktop** on your computer.

### 2. Link the Dataset (`Sales_Data.csv`)
1. On the **Home** tab ribbon, click **Get Data** ➔ select **Text/CSV**.
2. Navigate to:
   `C:\Users\C Srilekha\.gemini\antigravity\scratch\sales-revenue-powerbi-dashboard\Sales_Data.csv`
3. A preview dialog will appear. Click **Load** (or click **Transform Data** to inspect the 2,000 clean records).

---

## 📊 Step 3: Create the Date / Calendar Table (Best Practice)

1. In Power BI Desktop, click on the **Modeling** tab in the top ribbon.
2. Click **New Table**.
3. Open [`Calendar_Table.dax`](file:///C:/Users/C%20Srilekha/.gemini/antigravity/scratch/sales-revenue-powerbi-dashboard/Calendar_Table.dax), copy all lines, and paste into the formula bar:
   ```dax
   Calendar = 
   VAR MinDate = MIN(Sales_Data[OrderDate])
   VAR MaxDate = MAX(Sales_Data[OrderDate])
   RETURN
       ADDCOLUMNS(
           CALENDAR(MinDate, MaxDate),
           "Year", YEAR([Date]),
           "Year Quarter", "Q" & FORMAT([Date], "Q") & " " & YEAR([Date]),
           "Quarter", "Q" & FORMAT([Date], "Q"),
           "Month Number", MONTH([Date]),
           "Month Name", FORMAT([Date], "MMMM"),
           "Month Short", FORMAT([Date], "MMM"),
           "Month Year", FORMAT([Date], "MMM yyyy"),
           "Week Number", WEEKNUM([Date]),
           "Day of Week", FORMAT([Date], "dddd")
       )
   ```
4. Switch to the **Model View** (icon on the far left pane) and drag `Calendar[Date]` onto `Sales_Data[OrderDate]` to create a 1-to-many relationship.

---

## 📐 Step 4: Add the Key DAX Measures

Go to the **Home** or **Modeling** tab ➔ Click **New Measure** for each:

1. **Total Sales:**
   ```dax
   Total Sales = SUM(Sales_Data[Sales])
   ```
   *(Select currency format `$ / ₹` in the ribbon)*

2. **Total Profit:**
   ```dax
   Total Profit = SUM(Sales_Data[Profit])
   ```
   *(Select currency format)*

3. **Total Orders:**
   ```dax
   Total Orders = DISTINCTCOUNT(Sales_Data[OrderID])
   ```

4. **Profit Margin %:**
   ```dax
   Profit Margin % = DIVIDE([Total Profit], [Total Sales], 0)
   ```
   *(Click `%` format icon in the ribbon)*

5. **Average Order Value (AOV):**
   ```dax
   Average Order Value = DIVIDE([Total Sales], [Total Orders], 0)
   ```

*(All remaining advanced measures like YoY Growth and Ranking are available in [`DAX_Measures.dax`](file:///C:/Users/C%20Srilekha/.gemini/antigravity/scratch/sales-revenue-powerbi-dashboard/DAX_Measures.dax))*

---

## 🎨 Step 5: Build Visuals Matching the Interactive Prototype

*(You can open [`Dashboard_Preview.html`](file:///C:/Users/C%20Srilekha/.gemini/antigravity/scratch/sales-revenue-powerbi-dashboard/Dashboard_Preview.html) in your browser to see the live layout)*

1. **Interactive Slicers (Top Filter Bar):**
   * Visual: **Slicer** ➔ Field: `'Calendar'[Year]` (Dropdown or Tile)
   * Visual: **Slicer** ➔ Field: `'Sales_Data'[Region]` (Dropdown or Horizontal Tile)
   * Visual: **Slicer** ➔ Field: `'Sales_Data'[Category]` (Dropdown)
   * Visual: **Slicer** ➔ Field: `'Sales_Data'[Segment]` (Dropdown)

2. **Top KPI Cards:**
   * Visual: **Card** (or New Card) ➔ Values: `[Total Sales]`, `[Total Profit]`, `[Profit Margin %]`, `[Total Orders]`, `[Average Order Value]`.

3. **Revenue Trend Chart:**
   * Visual: **Line Chart**
   * X-axis: `'Calendar'[Month Year]` (Sorted by `Month Number`)
   * Y-axis: `[Total Sales]`

4. **Category Breakdown:**
   * Visual: **Donut Chart**
   * Legend: `'Sales_Data'[Category]`
   * Values: `[Total Sales]`

5. **Top 10 Performing Products:**
   * Visual: **Clustered Bar Chart**
   * Y-axis: `'Sales_Data'[ProductName]`
   * X-axis: `[Total Sales]`
   * Filter Pane: Under `ProductName` ➔ Filter Type: **Top N** ➔ Show items: **Top 10** ➔ By value: `[Total Sales]` ➔ Click **Apply filter**.

6. **Regional Revenue:**
   * Visual: **Clustered Column Chart**
   * X-axis: `'Sales_Data'[Region]`
   * Y-axis: `[Total Sales]`
   * Tooltip: `[Profit Margin %]`

---

## 💾 Step 6: Save & Export
* Save project as: `Sales_Revenue_Dashboard.pbix`
* Export for submission: **File** ➔ **Export** ➔ **Export to PDF**
