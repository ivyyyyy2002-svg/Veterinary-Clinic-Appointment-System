// Ivy Li, Ziqi Liu 251532729 ECE 9014 Group 8 Project - Admin Login Script

document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("admin-login")
        .querySelector("form")
        .addEventListener("submit", async (event) => {

            event.preventDefault();

            const emailInput = document.getElementById("username");
            const passwordInput = document.getElementById("password");

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // basic validation
            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            try {
                const res = await fetch("http://localhost:5050/api/admins/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                console.log("Admin login response:", data);

                if (!res.ok) {
                    alert(data.message || "Login failed. Please check your credentials.");
                    return;
                }

                // store admin info
                localStorage.setItem("adminID", data.adminID);
                localStorage.setItem("adminName", data.name);
                localStorage.setItem("adminToken", data.token);

                alert("Admin login successful.");

                // redirect to admin dashboard
                window.location.href = "admin_dashboard.html";

            } catch (err) {
                console.error("Admin login error:", err);
                alert("An error occurred during login. Please try again.");
            }
        });
});
