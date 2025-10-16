console.log("JavaScript file is successfully connected!");

function openMenu(menuCategory, buttonElement) {
    console.log("Opening menu:", menuCategory);

    // Hide all menu sections
    document.querySelectorAll(".menu-section").forEach(section => {
        section.classList.remove("active");
    });

    // Remove 'active' class from all buttons
    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });

    // Show the selected menu section
    let targetSection = document.getElementById(menuCategory);
    if (targetSection) {
        targetSection.classList.add("active");
    } else {
        console.error("Menu category not found:", menuCategory);
    }

    // Highlight the clicked tab button
    buttonElement.classList.add("active");
}

// Set the first section as active by default after the page loads
document.addEventListener("DOMContentLoaded", function () {
    let firstButton = document.querySelector(".tab-button");
    if (firstButton) {
        openMenu(firstButton.getAttribute("data-category"), firstButton);
    }
});