
console.log("👋 create_order.js loaded - version 3");

function calculateTotalPrice(quantity, unitPrice, gstRate) {
    return quantity * unitPrice * (1 + gstRate / 100);
}

function getFormValues(form) {
    const itemSelect = form.querySelector('select[name$="item"]');
    const quantityInput = form.querySelector('input[name$="quantity"]');
    const gstRateInput = form.querySelector('input[name$="gst_rate"]');
    const unitPriceInput = form.querySelector('input[name$="unit_price"]');
    const totalPriceInput = form.querySelector('input[name$="total_price"]');

    return { itemSelect, quantityInput, gstRateInput, unitPriceInput, totalPriceInput };
}

function updatePriceFields(form) {
    const { itemSelect, quantityInput, gstRateInput, unitPriceInput, totalPriceInput } = getFormValues(form);

    if (!itemSelect || !quantityInput || !gstRateInput || !unitPriceInput || !totalPriceInput) return;

    const selectedItemId = itemSelect.value;
    const price = window.ITEM_PRICE_MAP?.[selectedItemId];

    if (price !== undefined) {
        unitPriceInput.value = parseFloat(price).toFixed(2);
    }

    const quantity = parseFloat(quantityInput.value) || 0;
    const gstRate = parseFloat(gstRateInput.value) || 0;
    const unitPrice = parseFloat(unitPriceInput.value) || 0;

    const totalPrice = calculateTotalPrice(quantity, unitPrice, gstRate);
    totalPriceInput.value = totalPrice.toFixed(2);
}
window.ITEM_PRICE_MAP = JSON.parse(document.getElementById('item-price-map').textContent);
console.log("✅ ITEM_PRICE_MAP loaded:", window.ITEM_PRICE_MAP);

function setupFormEventListeners(form) {
    const { itemSelect, quantityInput, gstRateInput } = getFormValues(form);

    if (itemSelect) {

        itemSelect.addEventListener('change', () => updatePriceFields(form));
    }
    if (quantityInput) {
        quantityInput.addEventListener('input', () => updatePriceFields(form));
    }
    if (gstRateInput) {
        gstRateInput.addEventListener('input', () => updatePriceFields(form));
    }

    // Initial update
    updatePriceFields(form);
}

function setupAllItemForms() {
    console.log("🔄 Setting up all item forms...");
    const allForms = document.querySelectorAll('.order-item');
    allForms.forEach(form => setupFormEventListeners(form));
}

function addNewOrderItem() {
    const orderItemsContainer = document.getElementById("order-items-a");
    const totalFormsElement = document.querySelector("#id_items-TOTAL_FORMS");

    let formCount = parseInt(totalFormsElement.value);
    let firstForm = orderItemsContainer.querySelector(".order-item");
    let newForm = firstForm.cloneNode(true);

    // Update form index in newForm HTML
    newForm.innerHTML = newForm.innerHTML.replace(/-\d+-/g, `-${formCount}-`).replace(/_\d+_/g, `_${formCount}_`);

    // Reset values in new form
    newForm.querySelectorAll("input, select, textarea").forEach(input => {
        if (input.type !== "hidden") {
            input.value = "";
        }
    });

    orderItemsContainer.appendChild(newForm);
    totalFormsElement.value = formCount + 1;

    setupFormEventListeners(newForm);
}

function onReady(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

onReady(function() {
    console.log("✅ DOM is fully loaded - version 3");

    // No need for injectDataPrice anymore
    setupAllItemForms();

    const addItemButton = document.getElementById("add-item");
    if (addItemButton) {
        addItemButton.addEventListener("click", addNewOrderItem);
    }
});
