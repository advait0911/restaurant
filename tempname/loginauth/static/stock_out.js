document.addEventListener('DOMContentLoaded', setCurrentLocalDateTime())

function setCurrentLocalDateTime() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const now = new Date();
        const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        dateInput.value = localISO;
    }
}

function initAddRowButton() {
    const addItemButton = document.getElementById("add-item");
    if (addItemButton) {
        addItemButton.addEventListener("click", addNewStockRow);
    }
}

function addNewStockRow() {
    const formContainer = document.getElementById("form-container");
    const totalForms = document.getElementById("id_form-TOTAL_FORMS");
    const formCount = parseInt(totalForms.value);

    const baseForm = getBaseForm(formContainer);
    if (!baseForm) {
        console.error("Base form not found. Cannot clone.");
        return;
    }

    const newForm = cloneForm(baseForm, formCount);
    formContainer.appendChild(newForm);
    totalForms.value = formCount + 1;
}

function getBaseForm(container) {
    return container.querySelector(".stock-item");
}

function cloneForm(baseForm, index) {
    const newForm = baseForm.cloneNode(true);

    newForm.querySelectorAll("input, select, textarea").forEach(input => {
        if (input.name) {
            input.name = updateIndex(input.name, index);
        }
        if (input.id) {
            input.id = updateIndex(input.id, index);
        }
        if (input.type === "date") {
            input.value = new Date().toISOString().split("T")[0];
        } else {
            input.value = "";
        }
    });

    return newForm;
}

function updateIndex(originalString, newIndex) {
    return originalString.replace(/form-(\d+)-/, `form-${newIndex}-`);
}





function initAjaxFormSubmit() {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();  // Prevent normal form submission

        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network error");
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                alert(data.message);
                // Redirect using hash only
                window.location.hash = data.redirect_hash || "#Inventory_item";
            } else if (data.errors) {
                alert("Validation error: " + JSON.stringify(data.errors));
            }
        })
        .catch(error => {
            console.error("Submission failed:", error);
            alert("Submission failed. Please try again.");
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const commonDateField = document.getElementById('date');
    if (commonDateField && !commonDateField.value) {
        const now = new Date();
        const localISOTime = now.toISOString().slice(0, 16);  // Format: yyyy-MM-ddTHH:mm
        commonDateField.value = localISOTime;
    }
});