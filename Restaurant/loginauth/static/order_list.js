console.log("Order list file is successfully connected!");

function confirmDelete(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`/orders/delete/${orderId}/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                loadPage(data.redirect_url);  // Reload the order list dynamically
            } else {
                alert("Error deleting order.");
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

// // Function to show a confirmation dialog before editing an order
// function confirmEdit(orderId) {
//     console.log("Editing order:", orderId);
//     if (confirm("Are you sure you want to edit this order?")) {
//         loadEditOrderForm(orderId);
//     }
// }

// // Function to load the order edit form inside #main-content
// function loadEditOrderForm(orderId) {
//     fetch(`/orders/edit/${orderId}/`, {
//         method: "GET",
//         headers: {
//             "X-Requested-With": "XMLHttpRequest"
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.text();
//     })
//     .then(html => {
//         document.getElementById("main-content").innerHTML = html;  // Replace content with form
//         attachEditFormSubmitHandler();  // Attach form submission handler
//     })
//     .catch(error => {
//         alert("Failed to load order details.");
//         console.error("Error:", error);
//     });
// }

// // Function to handle form submission via AJAX
// function attachEditFormSubmitHandler() {
//     let editForm = document.getElementById("edit-order-form");

//     if (editForm) {
//         editForm.addEventListener("submit", function(event) {
//             event.preventDefault();
//             let formData = new FormData(editForm);

//             fetch(window.location.pathname, {
//                 method: "POST",
//                 headers: {
//                     "X-CSRFToken": getCSRFToken(),
//                     "X-Requested-With": "XMLHttpRequest"
//                 },
//                 body: formData
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.message) {
//                     alert("Order updated successfully!");
//                     loadPage("/orders/list/");  // Reload order list dynamically
//                 } else {
//                     alert("Failed to update order.");
//                 }
//             })
//             .catch(error => console.error("Error:", error));
//         });
//     }
// }

// // Function to dynamically reload the order list
// // function loadPage(url) {
// //     fetch(url)
// //     .then(response => response.text())
// //     .then(html => {
// //         document.getElementById("main-content").innerHTML = html;  // Update main content
// //         attachEditOrderHandlers();  // Reattach event listeners
// //     })
// //     .catch(error => console.error("Error loading page:", error));
// // }

// document.getElementById("main-content").addEventListener("click", function(event) {
//     if (event.target.classList.contains("edit-order")) {
//         event.preventDefault();  // Prevent default anchor behavior
//         let orderId = event.target.dataset.orderId;
//         confirmEdit(orderId);
//     }
// });



function loadEditPage(orderId) {
    fetch(`/orders/edit/${orderId}/`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            
            // Attach an event listener to handle form submission via AJAX
            document.getElementById('order_form').addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent default form submission
                submitEditForm(orderId); // Call AJAX function to submit the form
            });
        })
        .catch(error => {
            console.error("Failed to load edit form:", error);
            alert("Error loading the edit page.");
        });
}

// AJAX function to submit the edit form
function submitEditForm(orderId) {
    let form = document.getElementById('order_form');
    let formData = new FormData(form);

    fetch(`/orders/edit/${orderId}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest', // Identifies this as an AJAX request
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Order updated successfully!");
            loadOrderList(); // Reload the order list after updating
        } else {
            alert("Failed to update order. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error submitting form:", error);
        alert("Error updating order.");
    });
}

function loadOrderList() {
    fetch('/orders/')
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading orders:", error);
            alert("Error loading orders.");
        });
}
