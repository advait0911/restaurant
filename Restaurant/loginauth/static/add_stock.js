const quantityField = document.getElementById("id_quantity");
const unitPriceField = document.getElementById("id_unit_price");
const totalPriceField = document.getElementById("id_total_price");

        function updateTotalPrice() {
            const qty = parseFloat(quantityField.value) || 0;
            const unit = parseFloat(unitPriceField.value) || 0;
            totalPriceField.value = (qty * unit).toFixed(2);
        }

        quantityField.addEventListener("input", updateTotalPrice);
        unitPriceField.addEventListener("input", updateTotalPrice);

document.addEventListener('DOMContentLoaded', setCurrentLocalDateTime)

function setCurrentLocalDateTime() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const now = new Date();
        const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        dateInput.value = localISO;
    }
}


// document.addEventListener("DOMContentLoaded", function () {
//     const formContainer = document.getElementById("form-container");
//     const addButton = document.getElementById("add-item");
//     const totalForms = document.getElementById("id_form-TOTAL_FORMS");

//     function attachAutoCalc(row) {
//         const qty = row.querySelector("input[name$='quantity']");
//         const unit = row.querySelector("input[name$='unit_price']");
//         const total = row.querySelector("input[name$='total_price']");

//         function calculate() {
//             const q = parseFloat(qty.value) || 0;
//             const u = parseFloat(unit.value) || 0;
//             total.value = (q * u).toFixed(2);
//         }

//         qty.addEventListener('input', calculate);
//         unit.addEventListener('input', calculate);
//     }

//     document.querySelectorAll(".stock-item").forEach(attachAutoCalc);

//     addButton.addEventListener("click", function () {
//         const currentFormCount = parseInt(totalForms.value);
//         const newForm = formContainer.querySelector(".stock-item").cloneNode(true);

//         newForm.querySelectorAll("input, select").forEach((el) => {
//             if (el.name) {
//                 const name = el.name.replace(/-\d+-/, `-${currentFormCount}-`);
//                 el.name = name;
//                 el.id = `id_${name}`;
//                 if (el.tagName === 'SELECT') el.selectedIndex = 0;
//                 else el.value = '';
//             }
//         });

//         totalForms.value = currentFormCount + 1;
//         formContainer.appendChild(newForm);
//         attachAutoCalc(newForm);
//     });
// });


// function initAddRowButton() {
//     const addItemButton = document.getElementById("add-item");
//     if (addItemButton) {
//         addItemButton.addEventListener("click", addNewStockRow);
//     }
// }

// function addNewStockRow() {
//     const formContainer = document.getElementById("form-container");
//     const totalForms = document.getElementById("id_form-TOTAL_FORMS");
//     const formCount = parseInt(totalForms.value);

//     const baseForm = getBaseForm(formContainer);
//     if (!baseForm) {
//         console.error("Base form not found. Cannot clone.");
//         return;
//     }

//     const newForm = cloneForm(baseForm, formCount);
//     formContainer.appendChild(newForm);
//     totalForms.value = formCount + 1;
// }

// function getBaseForm(container) {
//     return container.querySelector(".stock-item");
// }

// function cloneForm(baseForm, index) {
//     const newForm = baseForm.cloneNode(true);

//     newForm.querySelectorAll("input, select, textarea").forEach(input => {
//         if (input.name) {
//             input.name = updateIndex(input.name, index);
//         }
//         if (input.id) {
//             input.id = updateIndex(input.id, index);
//         }
//         if (input.type === "date") {
//             input.value = new Date().toISOString().split("T")[0];
//         } else {
//             input.value = "";
//         }
//     });

//     return newForm;
// }

// function updateIndex(originalString, newIndex) {
//     return originalString.replace(/form-(\d+)-/, `form-${newIndex}-`);
// }