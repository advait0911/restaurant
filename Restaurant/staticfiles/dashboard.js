// Function to toggle submenus (Waiter, Menu)
function toggleSubMenu(id) {
    let submenu = document.getElementById(id);
    if (submenu) {
        submenu.style.display = (submenu.style.display === "block") ? "none" : "block";
    }
}

function loadPage(pageUrl, scriptPath = null) {
    console.log("Loading page:", pageUrl);

    const contentDiv = document.getElementById("content");
    if (!contentDiv) {
        console.error("Error: #content div not found!");
        return;
    }

    fetch(pageUrl, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
    })
    .then(response => response.text()) 
    .then(html => {
        contentDiv.innerHTML = html; // Load new content dynamically
        attachFormListeners(); // Attach event listener to forms after loading


        let oldScript = document.getElementById("dynamic-script");
        if (oldScript) {
            oldScript.remove();
        }
        // If a script path is provided, load it dynamically
        if (scriptPath) {
            console.log("Appending script:", scriptPath);

            let script = document.createElement("script");
            script.src = scriptPath;
            script.id = "dynamic-script";
            script.defer = true;
            document.body.appendChild(script);
            
            script.onload = function() {
                console.log("✅ Script loaded successfully:", scriptPath);
            };

            script.onerror = function() {
                console.error("❌ Error loading script:", scriptPath);
            };
        }
    })
    .catch(error => console.error("Error loading page:", error));
}


document.addEventListener("DOMContentLoaded", function() {
    attachFormListeners();
});

// Attach event listeners for both forms
function attachFormListeners() {
    const forms = document.querySelectorAll("form"); // Select all forms (Waiter & Menu)
    
    forms.forEach(form => {
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default submission

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
                    loadPage(data.redirect_url); // Redirect dynamically
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




