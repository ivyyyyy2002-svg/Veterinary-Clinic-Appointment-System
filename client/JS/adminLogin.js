// Ivy Li, Ziqi Liu
// ECE 9014 Group 8 Project - Admin Login Script

document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById("admin-login");
    const form = loginContainer.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5050/api/admins/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            console.log("Admin login response:", data);

            if (!res.ok) {
                alert(data.message || "Admin login failed.");
                return;
            }

            if (data.adminID) {
                localStorage.setItem("adminID", data.adminID);
            }
            if (data.name) {
                localStorage.setItem("adminName", data.name);
            }
            localStorage.setItem("adminToken", data.token);

            alert("Admin login successful.");

            // Redirect to admin dashboard
            window.location.href = "admin_dashboard.html";

        } catch (err) {
            console.error("Admin login error:", err);
            alert("An error occurred during admin login. Please try again.");
        }
    });
});
