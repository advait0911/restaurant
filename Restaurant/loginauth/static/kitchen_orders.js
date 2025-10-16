// // Function to open the modal and set the KOT ID
// function openModal(kotId) {
//     const modal = document.getElementById("updateKotModal");
//     document.getElementById("kotId").value = kotId;
//     modal.style.display = "block";
// }

// // Function to close the modal
// function closeModal() {
//     const modal = document.getElementById("updateKotModal");
//     modal.style.display = "none";
// }

// // Function to update KOT status via AJAX
// function updateKotStatus(kotId, newStatus) {
//     const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

//     fetch(`/update-kot-status/${kotId}/`, {
//         method: "POST",
//         headers: {
//             "X-CSRFToken": csrfToken,
//             "Content-Type": "application/x-www-form-urlencoded"
//         },
//         body: `status=${newStatus}`
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             location.reload();
//         } else {
//             alert("Error updating status!");
//         }
//     });
// }

// // Function to set up event listeners for opening the modal
// function setUpModalTriggers() {
//     document.querySelectorAll(".update-kot-btn").forEach(button => {
//         button.addEventListener("click", function () {
//             const kotId = this.getAttribute("data-kot-id");
//             openModal(kotId);
//         });
//     });

//     const closeBtn = document.querySelector(".close");
//     closeBtn.onclick = closeModal;
// }

// // Function to set up the event listener for the save button
// function setUpSaveButton() {
//     document.getElementById("saveKotStatus").addEventListener("click", function () {
//         const kotId = document.getElementById("kotId").value;
//         const newStatus = document.getElementById("kotStatus").value;
//         updateKotStatus(kotId, newStatus);
//     });
// }

// // Initialize everything
// function initialize() {
//     setUpModalTriggers();
//     setUpSaveButton();
// }

// // Call the initialize function when the page is ready
// initialize();






// Function to open the modal and set the KOT ID
function openModal(kotId) {
    console.log("Received KOT ID:", kotId);
    const modal = document.getElementById("updateKotModal");
    document.getElementById("kotId").value = kotId; // Correctly assign kotId as value
    document.getElementById("kotStatus").value = ""; // Reset selection
    document.querySelectorAll(".status-option").forEach(option => option.classList.remove("selected"));
    modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
    document.getElementById("updateKotModal").style.display = "none";
}

// Function to update KOT status via AJAX
function updateKotStatus() {
    const kotId = document.getElementById("kotId").value; // Ensure we get the value, not the element
    const newStatus = document.getElementById("kotStatus").value;

    if (!kotId) {
        alert("Error: Missing KOT ID!");
        return;
    }

    if (!newStatus) {
        alert("Please select a status!");
        return;
    }

    const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

    fetch(`/update-kot-status/${kotId}/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `status=${newStatus}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            alert("Error updating status!");
        }
    });
}

// Function to set up status selection
function setupStatusSelection() {
    document.querySelectorAll(".status-option").forEach(option => {
        option.addEventListener("click", function () {
            document.querySelectorAll(".status-option").forEach(opt => opt.classList.remove("selected"));
            this.classList.add("selected");
            document.getElementById("kotStatus").value = this.getAttribute("data-value");
        });
    });
}

// Function to set up event listener for the save button
function setupSaveButton() {
    document.getElementById("saveKotStatus").addEventListener("click", updateKotStatus);
}

// Initialize everything
function initialize() {
    setupStatusSelection();
    setupSaveButton();
}

// Close modal on clicking close button
document.querySelector(".close").onclick = closeModal;

// Call the initialize function when the page is ready
initialize();
