/* ==============================================================================
   TASK 4: AUTOMATED DATA CLEANING WORKFLOW SCRIPT (POWER QUERY M-CODE)
   In Microsoft Excel or Power BI Desktop:
   1. Go to Data Tab (or Home) -> "Get Data" -> "Blank Query"
   2. Click "Advanced Editor"
   3. Paste this code and click Done
   ============================================================================== */

let
    // 1. Ingest Raw CSV
    Source = Csv.Document(
        File.Contents("C:\Users\C Srilekha\.gemini\antigravity\scratch\sales-revenue-powerbi-dashboard\raw_uncleaned_sales_data.csv"),
        [Delimiter=",", Columns=9, Encoding=65001, QuoteStyle=QuoteStyle.Csv]
    ),
    PromoteHeaders = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),

    // 2. Automated Deduplication on Order_ID
    RemoveDuplicates = Table.Distinct(PromoteHeaders, {"Order_ID"}),

    // 3. Text Trimming & Normalization
    TrimNames = Table.TransformColumns(RemoveDuplicates, {
        {"Customer_Name", each Text.Proper(Text.Trim(if _ = null or _ = "" then "Valued Customer" else _)), type text},
        {"Region", each Text.Proper(Text.Trim(if _ = null or _ = "" then "Central" else _)), type text}
    }),

    // 4. Standardize Categorical Column
    StandardizeCategory = Table.TransformColumns(TrimNames, {
        {"Category", each 
            let s = Text.Lower(Text.Trim(Text.From(_))) in
            if Text.Contains(s, "tech") then "Technology"
            else if Text.Contains(s, "furn") then "Furniture"
            else "Office Supplies",
            type text
        }
    }),

    // 5. Clean Currency Symbols ($ , USD) and Percentages
    CleanCurrency = Table.TransformColumns(StandardizeCategory, {
        {"Unit_Price", each 
            let t = Text.Replace(Text.Replace(Text.Replace(Text.From(_), "$", ""), "USD", ""), ",", "")
            in Number.FromText(Text.Trim(t)), type number
        },
        {"Discount", each 
            let d = Text.Replace(Text.Trim(Text.From(_)), "%", "")
            in if d = null or d = "" then 0.0 else Number.FromText(d) / (if Text.Contains(Text.From(_), "%") then 100 else 1), type number
        }
    }),

    // 6. Clean Quantity (Replace negatives and blanks with 1)
    CleanQuantity = Table.TransformColumns(CleanCurrency, {
        {"Quantity", each let q = Number.From(_) in if q = null or q <= 0 then 1 else Int64.From(q), Int64.Type}
    }),

    // 7. Calculate Clean Sales Amount if missing
    CleanSales = Table.TransformColumns(CleanQuantity, {
        {"Sales_Amount", each 
            if _ = null or _ = "" then null 
            else Number.FromText(Text.Replace(Text.Replace(Text.From(_), "$", ""), ",", "")), type number
        }
    }),
    FillMissingSales = Table.AddColumn(CleanSales, "Final_Sales", each 
        if [Sales_Amount] = null then [Unit_Price] * [Quantity] * (1 - [Discount]) else [Sales_Amount], type number
    ),
    RemoveOldSales = Table.RemoveColumns(FillMissingSales, {"Sales_Amount"}),
    RenameSales = Table.RenameColumns(RemoveOldSales, {{"Final_Sales", "Sales_Amount"}}),

    // 8. Normalize Date Format to ISO-8601
    ChangeDates = Table.TransformColumnTypes(RenameSales, {{"Order_Date", type date}})
in
    ChangeDates
