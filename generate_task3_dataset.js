const fs = require('fs');
const path = require('path');

const targetDir = "C:\\Users\\C Srilekha\\.gemini\\antigravity\\scratch\\sales-revenue-powerbi-dashboard";

// 3 full years: 2022, 2023, 2024 (1096 days)
const startDate = new Date(2022, 0, 1);
const totalDays = 1096;

const rows = [];
rows.push([
  "Date",
  "Year",
  "Month",
  "Day",
  "DayOfWeek",
  "IsWeekend",
  "IsHoliday",
  "MarketingSpend",
  "StoreTraffic",
  "DiscountRate",
  "UnitsSold",
  "ActualSales"
].join(","));

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Approximate US major holidays (Month 1-12, Day 1-31)
const holidays = new Set([
  "1-1",   // New Year
  "5-29",  // Memorial Day approx
  "7-4",   // Independence Day
  "9-4",   // Labor Day approx
  "11-24", "11-25", // Black Friday / Thanksgiving approx
  "12-24", "12-25", "12-31" // Christmas / New Year's Eve
]);

for (let i = 0; i < totalDays; i++) {
  const current = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
  const y = current.getFullYear();
  const m = current.getMonth() + 1;
  const d = current.getDate();
  const dow = current.getDay();
  const isWeekend = (dow === 0 || dow === 6) ? 1 : 0;
  
  const holidayKey = `${m}-${d}`;
  const isHoliday = holidays.has(holidayKey) ? 1 : 0;

  // Baseline components:
  // 1. Long-term linear upward growth: baseline starts at ~$8,000 in 2022 and grows to ~$14,000 in 2024
  const trend = 8000 + (i / totalDays) * 6000;

  // 2. Weekly seasonality: weekends have +25% boost, mid-week steady
  const weeklyFactor = isWeekend ? 1.25 : (dow === 5 ? 1.15 : 0.95);

  // 3. Yearly seasonality: Q4 holiday spike (Nov & Dec)
  let annualFactor = 1.0;
  if (m === 11) annualFactor = 1.35; // Nov
  if (m === 12) annualFactor = 1.55; // Dec peak
  if (m === 1) annualFactor = 0.85;  // Post-holiday dip in Jan
  if (m === 7) annualFactor = 1.10;  // Summer bump

  // 4. Marketing Spend (ranges from $800 to $4,500/day, higher during holidays)
  const baseMkt = isHoliday ? 3500 : (m === 11 || m === 12 ? 2400 : 1200);
  const marketingSpend = Math.round(baseMkt + Math.random() * 800);

  // 5. Discount rate (0.00 to 0.25)
  const discountRate = isHoliday ? 0.20 : (m === 11 || m === 12 ? 0.15 : (Math.random() < 0.2 ? 0.10 : 0.05));

  // 6. Store / site traffic
  const storeTraffic = Math.round((trend / 5) * weeklyFactor * annualFactor + (marketingSpend * 1.5) + (Math.random() * 400));

  // 7. Calculate Actual Sales ($) with realistic Gaussian-like noise
  const noise = (Math.random() + Math.random() + Math.random() - 1.5) * 800;
  const actualSales = Number((trend * weeklyFactor * annualFactor + (marketingSpend * 1.8) + (isHoliday ? 3500 : 0) + noise).toFixed(2));

  // 8. Units Sold
  const avgPrice = 65;
  const unitsSold = Math.round(actualSales / avgPrice);

  const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  rows.push([
    dateStr,
    y,
    m,
    d,
    dayNames[dow],
    isWeekend,
    isHoliday,
    marketingSpend,
    storeTraffic,
    discountRate.toFixed(2),
    unitsSold,
    actualSales.toFixed(2)
  ].join(","));
}

const csvPath = path.join(targetDir, "Historical_Sales_Forecasting_Data.csv");
fs.writeFileSync(csvPath, rows.join("\r\n"), 'utf-8');
console.log(`Generated ${totalDays} daily time-series records at: ${csvPath}`);
