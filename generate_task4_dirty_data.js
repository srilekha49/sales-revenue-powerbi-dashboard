const fs = require('fs');
const path = require('path');

const targetDir = "C:\\Users\\C Srilekha\\.gemini\\antigravity\\scratch\\sales-revenue-powerbi-dashboard";

const rawRows = [];
rawRows.push("Order_ID,Order_Date,Customer_Name,Region,Category,Unit_Price,Quantity,Discount,Sales_Amount");

const cleanCategories = ["Technology", "Furniture", "Office Supplies"];
const dirtyCategoryVariants = {
  "Technology": ["Technology", "  technology  ", "TECH", "technology", "Tech", "TECHNOLOGY "],
  "Furniture": ["Furniture", "furniture", " FURNITURE", "furn.", "Furniture "],
  "Office Supplies": ["Office Supplies", "office supplies", "OFFICE SUPPLIES", "Off. Supplies", " Office Supplies "]
};

const dirtyRegionVariants = {
  "West": ["West", "west", "WEST ", " West", null],
  "East": ["East", "east", " EAST", null],
  "Central": ["Central", "central", "CENTRAL"],
  "South": ["South", "south", " SOUTH", null]
};

const baseNames = ["John Doe", "Jane Smith", "Michael Brown", "Sarah Wilson", "David Taylor", "Emily Davis", "Robert Johnson", "Jessica Anderson"];

const totalRows = 1500;

for (let i = 1; i <= totalRows; i++) {
  const orderNum = 1000 + (i % 650); // Intentionally create duplicate order IDs
  const orderId = `ORD-2024-${orderNum}`;

  // Inconsistent date formats
  const day = 1 + (i % 28);
  const month = 1 + (i % 12);
  let dateStr;
  const dateFmtChoice = i % 4;
  if (dateFmtChoice === 0) {
    dateStr = `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`; // YYYY-MM-DD
  } else if (dateFmtChoice === 1) {
    dateStr = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/2024`; // DD/MM/YYYY
  } else if (dateFmtChoice === 2) {
    dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}-2024`; // MM-DD-YYYY
  } else {
    dateStr = `2024/${month}/${day}`;
  }

  // Dirty customer name
  let custName = baseNames[i % baseNames.length];
  if (i % 17 === 0) custName = "   " + custName.toLowerCase() + "  ";
  if (i % 29 === 0) custName = ""; // Missing value

  // Dirty category
  const baseCat = cleanCategories[i % cleanCategories.length];
  const catVariants = dirtyCategoryVariants[baseCat];
  const category = catVariants[Math.floor(Math.random() * catVariants.length)];

  // Dirty region
  const regKeys = ["West", "East", "Central", "South"];
  const baseReg = regKeys[i % regKeys.length];
  const regVariants = dirtyRegionVariants[baseReg];
  const region = regVariants[Math.floor(Math.random() * regVariants.length)] || "";

  // Dirty prices & currency formats
  const basePrice = 50 + (i % 500);
  let unitPriceStr;
  if (i % 5 === 0) {
    unitPriceStr = `"$${basePrice.toFixed(2)}"`; // with dollar sign and quotes
  } else if (i % 9 === 0) {
    unitPriceStr = `"${basePrice.toFixed(2)} USD"`;
  } else {
    unitPriceStr = basePrice.toFixed(2);
  }

  // Dirty quantities (occasional missing or negative)
  let qty = 1 + (i % 8);
  if (i % 73 === 0) qty = -2; // erroneous negative
  if (i % 51 === 0) qty = ""; // missing

  // Dirty discount rate
  let discStr;
  if (i % 4 === 0) {
    discStr = `${(10 + (i % 15))}%`; // percentage string "15%"
  } else if (i % 31 === 0) {
    discStr = ""; // missing
  } else {
    discStr = (0.05 * (i % 4)).toFixed(2);
  }

  // Sales amount (occasional missing or string with commas)
  let salesVal = (basePrice * (qty > 0 ? qty : 1) * (1 - 0.05)).toFixed(2);
  let salesStr;
  if (i % 7 === 0) {
    salesStr = `"$${Number(salesVal).toLocaleString('en-US', { minimumFractionDigits: 2 })}"`;
  } else if (i % 41 === 0) {
    salesStr = ""; // Missing to be computed
  } else {
    salesStr = salesVal;
  }

  rawRows.push([
    orderId,
    dateStr,
    `"${custName}"`,
    `"${region}"`,
    `"${category}"`,
    unitPriceStr,
    qty,
    discStr,
    salesStr
  ].join(","));
}

const rawCsvPath = path.join(targetDir, "raw_uncleaned_sales_data.csv");
fs.writeFileSync(rawCsvPath, rawRows.join("\r\n"), 'utf-8');
console.log(`Generated ${totalRows} raw dirty records at: ${rawCsvPath}`);
