// --- Get filter parameters from input fields
function getFilterParams() {
    return {
        from_date: $('#from_date').val(),
        to_date: $('#to_date').val(),
        stock_type: $('#stock_type').val(),
        item_id: $('#item_id_holder').val()
    };
}

// --- Load filtered stock history using AJAX
function loadFilteredStockHistory() {
    $.ajax({
        url: '/history_table/',  // Your Django URL endpoint
        data: getFilterParams(),
        success: function(data) {
            $('#history_table').html(data.html);  // Replace table contents
            console.log("Filtered stock history loaded successfully.");
            // No need to rebind print button if using delegated binding
        },
        error: function(xhr, status, error) {
            console.error("Error loading filtered stock history:", error);
        }
    });
}

// --- Initialize the Search button
function initializeStockHistoryFilter() {
    $('#search_btn').click(function () {
        loadFilteredStockHistory();
        console.log("Search button clicked");
    });
}

// --- Delegated Print button handler (this is the KEY)
function initializePrintHandler() {
    $(document).on('click', '#print_btn', function () {
        const content = document.getElementById("printable_area").innerHTML;
        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write(`
            <html>
            <head>
                <title>Print</title>
                <link rel="stylesheet" href="/static/Inventory_history.css" type="text/css" />
                <style>
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                            font-size: 12px;
                            color: #000;
                            background: #fff;
                        }
                        table {
                            width: 40%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: center;
                        }
                        h2, h3 {
                            text-align: center;
                        }
                    }
                </style>
            </head>
            <body>
                ${content}
                <script>
                    window.onload = function () {
                        window.print();
                        window.onafterprint = function () { window.close(); };
                    };
                <\/script>
            </body>
            </html>
        `);

        printWindow.document.close();
    
    });
}

// --- Initialize everything
function initializeInventoryHistoryPage() {
    initializeStockHistoryFilter();
    initializePrintHandler();  // Only once, works before and after filter
}

$(document).ready(function () {
    initializeInventoryHistoryPage();
});
