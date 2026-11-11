const fs = require('fs');
const path = require('path');

const outputDir = "C:\\Users\\C Srilekha\\.gemini\\antigravity\\scratch\\sales-revenue-powerbi-dashboard";

const customers = [
  { name: "John Doe", segment: "Consumer" },
  { name: "Jane Smith", segment: "Corporate" },
  { name: "Robert Johnson", segment: "Home Office" },
  { name: "Emily Davis", segment: "Consumer" },
  { name: "Michael Brown", segment: "Corporate" },
  { name: "Sarah Wilson", segment: "Consumer" },
  { name: "David Taylor", segment: "Corporate" },
  { name: "Jessica Anderson", segment: "Home Office" },
  { name: "James Thomas", segment: "Consumer" },
  { name: "Amanda Martinez", segment: "Corporate" },
  { name: "Daniel Jackson", segment: "Consumer" },
  { name: "Laura White", segment: "Home Office" },
  { name: "Christopher Harris", segment: "Corporate" },
  { name: "Olivia Martin", segment: "Consumer" },
  { name: "Matthew Clark", segment: "Corporate" },
  { name: "Sophia Lewis", segment: "Consumer" },
  { name: "Andrew Robinson", segment: "Home Office" },
  { name: "Isabella Walker", segment: "Consumer" },
  { name: "Joshua Hall", segment: "Corporate" },
  { name: "Mia Young", segment: "Consumer" }
];

const locations = [
  { region: "West", state: "California", city: "Los Angeles" },
  { region: "West", state: "California", city: "San Francisco" },
  { region: "West", state: "Washington", city: "Seattle" },
  { region: "West", state: "Colorado", city: "Denver" },
  { region: "East", state: "New York", city: "New York City" },
  { region: "East", state: "Pennsylvania", city: "Philadelphia" },
  { region: "East", state: "Massachusetts", city: "Boston" },
  { region: "Central", state: "Illinois", city: "Chicago" },
  { region: "Central", state: "Texas", city: "Houston" },
  { region: "Central", state: "Texas", city: "Dallas" },
  { region: "Central", state: "Michigan", city: "Detroit" },
  { region: "South", state: "Florida", city: "Miami" },
  { region: "South", state: "Georgia", city: "Atlanta" },
  { region: "South", state: "North Carolina", city: "Charlotte" }
];

const catalog = [
  // Technology
  { category: "Technology", subCategory: "Phones", product: "Apple iPhone 14 Pro", unitPrice: 999.00, costPrice: 720.00 },
  { category: "Technology", subCategory: "Phones", product: "Samsung Galaxy S23", unitPrice: 799.00, costPrice: 580.00 },
  { category: "Technology", subCategory: "Phones", product: "Google Pixel 7", unitPrice: 599.00, costPrice: 420.00 },
  { category: "Technology", subCategory: "Machines", product: "Canon ImageRunner Copier", unitPrice: 1250.00, costPrice: 850.00 },
  { category: "Technology", subCategory: "Machines", product: "HP LaserJet Enterprise MFP", unitPrice: 850.00, costPrice: 590.00 },
  { category: "Technology", subCategory: "Accessories", product: "Logitech MX Master 3S Mouse", unitPrice: 99.00, costPrice: 55.00 },
  { category: "Technology", subCategory: "Accessories", product: "Anker USB-C Multiport Hub", unitPrice: 59.00, costPrice: 30.00 },
  { category: "Technology", subCategory: "Accessories", product: "Sony WH-1000XM5 Headphones", unitPrice: 349.00, costPrice: 220.00 },
  
  // Furniture
  { category: "Furniture", subCategory: "Chairs", product: "Herman Miller Aeron Ergonomic Chair", unitPrice: 1195.00, costPrice: 780.00 },
  { category: "Furniture", subCategory: "Chairs", product: "Steelcase Gesture Executive Chair", unitPrice: 950.00, costPrice: 620.00 },
  { category: "Furniture", subCategory: "Chairs", product: "Alera Elusion Mesh Swivel Chair", unitPrice: 189.00, costPrice: 110.00 },
  { category: "Furniture", subCategory: "Tables", product: "Uplift V2 Standing Desk 60x30", unitPrice: 699.00, costPrice: 440.00 },
  { category: "Furniture", subCategory: "Tables", product: "Bush Business Conference Table", unitPrice: 850.00, costPrice: 520.00 },
  { category: "Furniture", subCategory: "Bookcases", product: "Sauder 5-Shelf Wood Bookcase", unitPrice: 145.00, costPrice: 85.00 },
  { category: "Furniture", subCategory: "Furnishings", product: "Luxor LED Desk Task Lamp", unitPrice: 65.00, costPrice: 32.00 },

  // Office Supplies
  { category: "Office Supplies", subCategory: "Storage", product: "Fellowes Heavy-Duty Bankers Boxes 12-Pack", unitPrice: 45.00, costPrice: 22.00 },
  { category: "Office Supplies", subCategory: "Storage", product: "Safco Rolling Mobile File Cart", unitPrice: 110.00, costPrice: 65.00 },
  { category: "Office Supplies", subCategory: "Binders", product: "Wilson Jones Heavy Duty 3-Ring Binder", unitPrice: 12.50, costPrice: 5.50 },
  { category: "Office Supplies", subCategory: "Appliances", product: "Keurig K-Elite Commercial Coffee Maker", unitPrice: 189.00, costPrice: 115.00 },
  { category: "Office Supplies", subCategory: "Appliances", product: "Honeywell QuietSet Whole Room Tower Fan", unitPrice: 69.00, costPrice: 38.00 },
  { category: "Office Supplies", subCategory: "Paper", product: "Hammermill Copy Plus Paper 5000 Sheets", unitPrice: 42.00, costPrice: 24.00 },
  { category: "Office Supplies", subCategory: "Art", product: "Sharpie Permanent Markers 24-Count", unitPrice: 19.99, costPrice: 9.50 },
  { category: "Office Supplies", subCategory: "Envelopes", product: "Quality Park Self-Seal Envelopes 500-Pack", unitPrice: 28.50, costPrice: 14.00 }
];

const discounts = [0, 0, 0, 0.05, 0.05, 0.10, 0.15, 0.20];

function randomDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  const d = new Date(start + Math.random() * (end - start));
  
  // Add some realistic Q4 holiday weight
  if (Math.random() < 0.25) {
    const q4Month = 9 + Math.floor(Math.random() * 3); // Oct, Nov, Dec
    const day = 1 + Math.floor(Math.random() * 28);
    const year = Math.random() < 0.5 ? 2023 : 2024;
    return new Date(year, q4Month, day);
  }
  return d;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const rows = [];
rows.push([
  "OrderID",
  "OrderDate",
  "ShipDate",
  "CustomerID",
  "CustomerName",
  "Segment",
  "Country",
  "Region",
  "State",
  "City",
  "Category",
  "SubCategory",
  "ProductName",
  "CostPrice",
  "UnitPrice",
  "Quantity",
  "Discount",
  "Sales",
  "Profit"
].join(","));

const totalRows = 2000;

for (let i = 1; i <= totalRows; i++) {
  const orderId = `ORD-202${i % 2 === 0 ? '3' : '4'}-${String(1000 + i).padStart(5, '0')}`;
  const orderDate = randomDate(2023, 2024);
  const shipDate = new Date(orderDate.getTime() + (2 + Math.floor(Math.random() * 5)) * 24 * 60 * 60 * 1000);
  
  const customer = customers[Math.floor(Math.random() * customers.length)];
  const customerId = `CUST-${100 + (i % customers.length)}`;
  
  const loc = locations[Math.floor(Math.random() * locations.length)];
  const item = catalog[Math.floor(Math.random() * catalog.length)];
  
  const quantity = 1 + Math.floor(Math.random() * 8);
  const discount = discounts[Math.floor(Math.random() * discounts.length)];
  
  const grossSales = item.unitPrice * quantity;
  const sales = Number((grossSales * (1 - discount)).toFixed(2));
  const totalCost = Number((item.costPrice * quantity).toFixed(2));
  const profit = Number((sales - totalCost).toFixed(2));
  
  const cleanProductName = `"${item.product.replace(/"/g, '""')}"`;

  rows.push([
    orderId,
    formatDate(orderDate),
    formatDate(shipDate),
    customerId,
    customer.name,
    customer.segment,
    "United States",
    loc.region,
    loc.state,
    loc.city,
    item.category,
    item.subCategory,
    cleanProductName,
    item.costPrice.toFixed(2),
    item.unitPrice.toFixed(2),
    quantity,
    discount.toFixed(2),
    sales.toFixed(2),
    profit.toFixed(2)
  ].join(","));
}

const csvContent = rows.join("\r\n");
const csvPath = path.join(outputDir, "Sales_Data.csv");
fs.writeFileSync(csvPath, csvContent, 'utf-8');

console.log(`Generated ${totalRows} rows at: ${csvPath}`);
