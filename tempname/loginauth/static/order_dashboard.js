// function getCookie(name) {
//     let cookieValue = null;
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//         cookie = cookie.trim();
//         if (cookie.startsWith(name + '=')) {
//             cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//             break;
//         }
//     }
//     return cookieValue;
// }

// const csrftoken = getCookie('csrftoken');

// function openModal() {
//     document.getElementById("addTableModal").style.display = "flex";
// }

// function closeModal() {
//     document.getElementById("addTableModal").style.display = "none";
// }

// function printBill(tableName) {
//     alert("🧾 Print Bill for " + tableName);
//     // Redirect to bill print if needed
// }

// function goToOrder(tableName) {
//     window.location.href = "/orders/new/?table=" + encodeURIComponent(tableName);
// }

// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("add-table-form");

//     form.addEventListener("submit", function (e) {
//         e.preventDefault();

//         const formData = new FormData(form);

//         fetch(ORDER_DASHBOARD_URL, {
//             method: "POST",
//             headers: {
//                 "X-Requested-With": "XMLHttpRequest",
//                 "X-CSRFToken": getCookie("csrftoken")
                
//             },
//             body: formData
             
//         })
//         .then(response => response.json())
        
//         .then(data => {
//             if (data.success) {
//                 const grid = document.querySelector(".table-grid");
//                 const div = document.createElement("div");
//                 div.className = "table-box";
//                 div.setAttribute("data-table", data.table_number);
//                 div.setAttribute("onclick", `goToOrder('${data.table_number}')`);
//                 div.innerHTML = `
//                     ${data.table_number}
//                     <button class="print-btn" onclick="event.stopPropagation(); printBill('${data.table_number}')">Print</button>
//                 `;
//                 grid.appendChild(div);
//                 form.reset();
//                 closeModal();
//             } else {
//                 alert("Validation error: " + JSON.stringify(data.errors));
//             }
//         })
//         .catch(err => {
//             console.error("❌ JS error:", err);
//             alert("Something went wrong!");
//         });
//     });
// });




function openModal() {
    document.getElementById('addTableModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addTableModal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('addTableModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}