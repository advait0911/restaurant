
// function toggleSubMenu(id) {
//     let submenu = document.getElementById(id);
//     if (submenu) {
//         submenu.style.display = (submenu.style.display === "block") ? "none" : "block";
//     }
// }

// function loadPage(pageUrl, scriptPath = null) {
//     console.log("Loading page:", pageUrl);

//     const contentDiv = document.getElementById("content");
//     if (!contentDiv) {
//         console.error("Error: #content div not found!");
//         return;
//     }

//     fetch(pageUrl, {
//         headers: { "X-Requested-With": "XMLHttpRequest" }
//     })
//     .then(response => response.text()) 
//     .then(html => {
//         contentDiv.innerHTML = html; // Load new content dynamically
//         attachFormListeners(); // Attach event listener to forms after loading


//         let oldScript = document.getElementById("dynamic-script");
//         if (oldScript) {
//             oldScript.remove();
//         }
//         // If a script path is provided, load it dynamically
//         if (scriptPath) {
//             let script = document.createElement("script");
//             script.src = scriptPath;
//             script.defer = true;
//             document.body.appendChild(script);
//             console.log("Loaded script:", scriptPath);
//         }
//     })
//     .catch(error => console.error("Error loading page:", error));
// }


// document.addEventListener("DOMContentLoaded", function() {
//     attachFormListeners();
// });

// // Attach event listeners for both forms
// function attachFormListeners() {
//     const forms = document.querySelectorAll("form"); // Select all forms (Waiter & Menu)
    
//     forms.forEach(form => {
//         form.addEventListener("submit", function(event) {
//             event.preventDefault(); // Prevent default submission

//             let formData = new FormData(form);
//             let actionUrl = form.action;

//             fetch(actionUrl, {
//                 method: "POST",
//                 body: formData,
//                 headers: {
//                     "X-Requested-With": "XMLHttpRequest",
//                     "X-CSRFToken": getCSRFToken()
//                 }
//             })
//             .then(response => {
//                 if (!response.ok) throw new Error("Bad Request: " + response.status);
//                 return response.json();
//             })
//             .then(data => {
//                 if (data.message) {
//                     alert(data.message);
//                     loadPage(data.redirect_url); // Redirect dynamically
//                 } else if (data.error) {
//                     alert("Error: " + JSON.stringify(data.error));
//                 }
//             })
//             .catch(error => console.error("❌ Error submitting form:", error));
//         });
//     });
// }






// // Function to get CSRF token
// function getCSRFToken() {
//     let csrfToken = document.querySelector("[name=csrfmiddlewaretoken]");
//     return csrfToken ? csrfToken.value : "";
// }



// function toggleSubMenu(id) {
//     const submenu = document.getElementById(id);
//     if (submenu.style.display === "block") {
//         submenu.style.display = "none";
//     } else {
//         submenu.style.display = "block";
//     }
// }




function toggleSubMenu(id) {
    let submenu = document.getElementById(id);
    if (submenu) {
        submenu.style.display = (submenu.style.display === "block") ? "none" : "block";
    }
}

function loadPage(pageUrl, scriptPath = null, hash = null) {
    console.log("Loading page:", pageUrl);

    const contentDiv = document.getElementById("content");
    // const titleElement = document.getElementById("page-title");
    if (!contentDiv) {
        console.error("Error: #content div not found!");
        return;
    }

    

    // Update the URL with a hash fragment
    if (hash) {
        window.location.hash = hash;
    }

    fetch(pageUrl, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
    })
    .then(response => response.text()) 
    .then(html => {
        contentDiv.innerHTML = html; // Load new content dynamically

      



        
        attachFormListeners(); // Attach event listener to forms after loading

        initializeKOTSelect2();

        let oldScript = document.getElementById("dynamic-script");
        if (oldScript) {
            oldScript.remove();
        }
        
        // If a script path is provided, load it dynamically
        if (scriptPath) {
            let script = document.createElement("script");
            script.src = scriptPath;
            script.defer = true;
            document.body.appendChild(script);
            console.log("Loaded script:", scriptPath);
        }
    })
    .catch(error => console.error("Error loading page:", error));
}

document.addEventListener("DOMContentLoaded", function() {
    attachFormListeners();
    handleHashChange(); // Handle initial page load based on URL hash
});

function attachFormListeners() {
    const forms = document.querySelectorAll("form");
    
    forms.forEach(form => {
        form.addEventListener("submit", function(event) {
            event.preventDefault(); 

            let formData = new FormData(form);
            let actionUrl = form.action;

            fetch(actionUrl, {
                method: "POST",
                body: formData,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": getCSRFToken()
                }
            })
            .then(response => {
                if (!response.ok) throw new Error("Bad Request: " + response.status);
                return response.json();
            })
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    if (data.redirect_hash) {
                        window.location.hash = data.redirect_hash;
                    } else if (data.redirect_url) {
                        // fallback if no hash provided
                        loadPage(data.redirect_url);
                    }
                } else if (data.error) {
                    alert("Error: " + JSON.stringify(data.error));
                }
            })
            .catch(error => console.error("❌ Error submitting form:", error));
        });
    });
}

// Function to get CSRF token
function getCSRFToken() {
    let csrfToken = document.querySelector("[name=csrfmiddlewaretoken]");
    return csrfToken ? csrfToken.value : "";
}

// Handle page load based on hash change
window.addEventListener("hashchange", handleHashChange);

function handleHashChange() {
    let hash = window.location.hash.substring(1); // Remove '#' from hash
    if (hash) {
        let pageUrl;
        let scriptPath = null;

        switch (hash) {
            case "New_order":
                pageUrl = "/orders/new";
                scriptPath = "/static/create_order.js";
                break;
            case "Order_list":
                pageUrl = "/orders";
                scriptPath = "/static/order_list.js";
                break;
            case "Waiter_list":
                pageUrl = "/waiter_list";
                break;
            case "Add_waiter":
                pageUrl = "/add_waiter";
                break;
            case "Add_menu":
                pageUrl = "/add_menu";
                break;
            case "Show_menu":
                pageUrl = "/menu_show";
                scriptPath = "/static/show_menu.js";
                break;
            case "KOT_orders":
                pageUrl = "/kitchen_orders";
                scriptPath = "/static/kitchen_orders.js";
                break;
            case "Generate_bill":
                pageUrl = "/generate_bill";
                scriptPath = "/static/generate_bill.js";
                break;
            case "Inventory_item":
                pageUrl = "/inventory_item";
                break;
            case "Supplier":
                pageUrl = "/supplier";
                break;
            case "Supplier_list":
                pageUrl = "/supplier_staff_list";
                break;
            case "Add_stock_in":
                pageUrl = "/add_stock";
                scriptPath = "/static/add_stock.js";
                break;
            case "Add_stock_out":
                pageUrl = "/stock_out";  
                scriptPath = "/static/stock_out.js";             
                break;
            case "Inventory_stockitem":
                pageUrl = "/inventory_stockitem";
                break;
            case "Order_dashboard":
                pageUrl = "/orders/dashboard";
                scriptPath = "/static/order_dashboard.js";
                break;
            default:
                if (hash.startsWith("Inventory_History_")) {
                    const itemId = hash.split("_").pop(); // get the item ID
                    pageUrl = `/inventory_history/${itemId}/`;
                    scriptPath = "/static/inventory_history.js";
                } else {
                    // Default fallback
                    pageUrl = "home.html";
                }
                break;
        }

        loadPage(pageUrl, scriptPath, hash);
    }
}



function initializeKOTSelect2() {
    console.log("Initializing KOT Select2...");
    const kotSelect = document.getElementById('id_kot');
    if (kotSelect) {
        $(kotSelect).select2({
            placeholder: "Select KOTs",
            width: '100%',
            allowClear: true
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeKOTSelect2();
});












