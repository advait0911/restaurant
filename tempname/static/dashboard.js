console.log("dashboard.js loaded!");


function toggleSubMenu() {
    let submenu = document.querySelector(".submenu");
    submenu.style.display = submenu.style.display === "block" ? "none" : "block";
}

// function loadPage(page) {
//     document.getElementById("content-frame").src = page;
// }

function loadPage(page) {
    console.log("Loading page:", page);
    
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error("Error: #content div not found!");
        return;
    }
    
    fetch(page, {
        credentials: 'include',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
        contentDiv.innerHTML = html;
        console.log("Page loaded successfully!");
    })
    .catch(error => console.error('Error loading page:', error));
}
