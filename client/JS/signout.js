document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();

        localStorage.removeItem("ownerID");
        localStorage.removeItem("ownerName");
        localStorage.removeItem("authToken");
        localStorage.removeItem("postLoginRedirect");

        alert("You have been signed out.");
        window.location.href = "home.html";
    });
});
