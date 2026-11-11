let
    // Update path if you move the CSV file
    Source = Csv.Document(
        File.Contents("C:\Users\C Srilekha\.gemini\antigravity\scratch\sales-revenue-powerbi-dashboard\Sales_Data.csv"),
        [Delimiter=",", Columns=19, Encoding=65001, QuoteStyle=QuoteStyle.Csv]
    ),
    PromoteHeaders = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    ChangeTypes = Table.TransformColumnTypes(
        PromoteHeaders,
        {
            {"OrderID", type text},
            {"OrderDate", type date},
            {"ShipDate", type date},
            {"CustomerID", type text},
            {"CustomerName", type text},
            {"Segment", type text},
            {"Country", type text},
            {"Region", type text},
            {"State", type text},
            {"City", type text},
            {"Category", type text},
            {"SubCategory", type text},
            {"ProductName", type text},
            {"CostPrice", type number},
            {"UnitPrice", type number},
            {"Quantity", Int64.Type},
            {"Discount", type number},
            {"Sales", type number},
            {"Profit", type number}
        }
    )
in
    ChangeTypes
