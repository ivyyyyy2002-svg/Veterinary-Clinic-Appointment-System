// Ivy Li, Ziqi Liu 251532729 ECE 9014 Group 8 - Admin Dashboard Script

// Admin login check //
// function checkAdminLogin() {
//     const adminToken = localStorage.getItem("adminToken");
//     if (!adminToken) {
//         alert("Please log in as admin first.");
//         window.location.href = "login.html";
//     }
// }

// Load admin name //    
function loadAdminName() {
    const name = localStorage.getItem("adminName");
    const title = document.getElementById("welcomeTitle");
    if (name) {
        title.textContent = `Welcome, ${name}`;
    }
}

// Load all owners //
async function loadAllOwners() {
    const tableBody = document.querySelector("#ownerTable tbody");

    try {
        const res = await fetch("http://localhost:5050/api/admins/owners");
        const owners = await res.json();

        if (!Array.isArray(owners) || owners.length === 0) {
            tableBody.innerHTML = `
                <tr><td colspan="6">No owner records found.</td></tr>
            `;
            return;
        }

        tableBody.innerHTML = "";

        owners.forEach(owner => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${owner.ownerID}</td>
                <td>${owner.name}</td>
                <td>${owner.email}</td>
                <td>${owner.phoneNumber || "N/A"}</td>
                <td>${owner.city}, ${owner.province}</td>
                <td>
                    <button onclick="deleteOwner(${owner.ownerID})">
                        Delete
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error("Error loading owners:", err);
    }
}

// Delete owner //
async function deleteOwner(ownerID) {
    if (!confirm("Are you sure you want to delete this owner?")) return;

    try {
        const res = await fetch(
            `http://localhost:5050/api/admins/owners/${ownerID}`,
            { method: "DELETE" }
        );

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Delete failed");
            return;
        }

        alert("Owner deleted successfully");
        loadAllOwners(); // refresh table

    } catch (err) {
        console.error("Delete owner error:", err);
        alert("Error deleting owner");
    }
}



// Load all appointments //
async function loadAllAppointments() {
    const tableBody = document.querySelector("#appointmentTable tbody");

    try {
        const res = await fetch("http://localhost:5050/api/appointments");
        const appointments = await res.json();

        if (!Array.isArray(appointments) || appointments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">No appointment data available.</td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = "";

        appointments.forEach(app => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${app.owner_name}</td>
                <td>${app.pet_name}</td>
                <td>${app.disease_name || "General Checkup"}</td>
                <td>${app.appointmentDate}</td>
                <td>${app.appointmentTime}</td>
                <td>${app.staff_name || "N/A"}</td>
                <td class="${app.status.toLowerCase()}">${app.status}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error("Error loading appointments:", err);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7">Failed to load appointment data.</td>
            </tr>
        `;
    }
}

// Logout //
function setupLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.clear();
        alert("You have been signed out.");
        window.location.href = "home.html";
    });
}

// Initial //
document.addEventListener("DOMContentLoaded", () => {
    checkAdminLogin();
    loadAdminName();
    loadAllAppointments();
    loadAllOwners();
    setupLogout();
});
