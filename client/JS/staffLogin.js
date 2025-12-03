// Ziqi Liu 251532729 ECE 9014 Group 8 Project - Staff Login Script
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("admin-login-form");
    const messageEl = document.getElementById("login-message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        messageEl.textContent = "";
        messageEl.style.color = "";

        if (!username || !password) {
        messageEl.textContent = "Please enter both username and password.";
        messageEl.style.color = "red";
        return;
        }

        try {
            const response = await fetch(`http://localhost:5050/api/staff/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                messageEl.textContent = data.message || "Login failed.";
                messageEl.style.color = "red";
                // throw new Error(data.message || "Login failed.");
            }

            // Login success, store token
            const token = data.token;
            if (token) {
                localStorage.setItem("authToken", token);
            }

            messageEl.textContent = "Login successful. Redirecting...";
            messageEl.style.color = "green";

            // Redirect to admin/staff dashboard page
            // Change this to your real dashboard page
            setTimeout(() => {window.location.href = "admin-dashboard.html";}, 1000);
        } catch (error) {
            console.error("Error during login:", error);
            messageEl.textContent = "Network error. Please try again later.";
            messageEl.style.color = "red";
            // throw new Error("Login error: " + error.message);
        }
  });
});
