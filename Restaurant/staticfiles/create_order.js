(function () {
    console.log("JavaScript file is successfully connected!");

    function addNewOrderItem() {
        console.log("Adding new order item");

        const orderItemsContainer = document.getElementById("order-items");
        const totalFormsElement = document.querySelector("#id_orderitem_set-TOTAL_FORMS");

        if (!orderItemsContainer || !totalFormsElement) {
            console.error("Required elements not found.");
            return;
        }

        let formCount = parseInt(totalFormsElement.value);
        let firstForm = orderItemsContainer.children[0];

        if (!firstForm) {
            console.error("No existing order item template found.");
            return;
        }

        let newForm = firstForm.cloneNode(true);
        newForm.innerHTML = newForm.innerHTML.replace(/-\d+-/g, `-${formCount}-`).replace(/_\d+_/g, `_${formCount}_`);

        orderItemsContainer.appendChild(newForm);
        totalFormsElement.value = formCount + 1;
    }

    function setupEventListeners() {
        console.log("Setting up event listeners...");

        const addItemButton = document.getElementById("add-item");

        if (addItemButton) {
            addItemButton.addEventListener("click", addNewOrderItem);
        } else {
            console.error("Add Item button not found.");
        }
    }

    // Run script when DOM is ready
    document.addEventListener("DOMContentLoaded", setupEventListeners);
})();
