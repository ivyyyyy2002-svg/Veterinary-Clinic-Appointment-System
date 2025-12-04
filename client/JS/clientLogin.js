// Ivy Li, Ziqi Liu 251532729 ECE 9014 Group 8 Project - Client Login Script
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("client-login").querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5050/api/owners/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            console.log("Login response:", data);

            if (!res.ok) {
                alert(data.message || "Login failed. Please check your email and password.");
                return;
            }

            // Store owner info
            localStorage.setItem("ownerID", data.ownerID);
            localStorage.setItem("ownerName", data.name);
            localStorage.setItem("authToken", data.token);

            alert("Login successful.");

            // If user clicked Book Appointment before login → redirect back
            const redirectFlag = localStorage.getItem("postLoginRedirect");

            if (redirectFlag === "appointment") {
                localStorage.removeItem("postLoginRedirect"); // clear flag
                window.location.href = "appointment.html";
            } else {
                // Normal login → go to dashboard
                window.location.href = "client_dashboard.html";
            }

        } catch (err) {
            console.error("Login error:", err);
            throw new Error("Login error: " + err.message);
        }
    });
});
