// Ziqi Liu 251532729 ECE 9014 Group 8 Project - Client Registration Script
import {textValidate, numberValidate} from './validateTools/validate.js';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("clientForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        regisUserResult.textContent = "";
        const name = textValidate(document.getElementById("name").value.trim(), 100, "Name").value;
        const email = textValidate(document.getElementById("email").value.trim(), 100, "Email").value;
        const phoneNumber = textValidate(document.getElementById("phoneNumber").value.trim(), 20, "Phone Number").value;
        const password = textValidate(document.getElementById("password").value, 100, "Password").value;
        const confirmPassword = textValidate(document.getElementById("confirm_password").value, 100, "Confirm Password").value;
        const address = textValidate(document.getElementById("address").value.trim(), 200, "Address").value;
        const city = textValidate(document.getElementById("city").value.trim(), 100, "City").value;
        const province = textValidate(document.getElementById("province").value.trim(), 100, "Province").value;
        const postalCode = textValidate(document.getElementById("postalcode").value.trim(), 20, "Postal Code").value;
        // Ouptput all validation errors
        const allErrors = [];
        allErrors.push(...textValidate(name, 100, "Name").errors);
        allErrors.push(...textValidate(email, 100, "Email").errors);
        allErrors.push(...textValidate(phoneNumber, 20, "Phone Number").errors);
        allErrors.push(...textValidate(password, 100, "Password").errors);
        allErrors.push(...textValidate(confirmPassword, 100, "Confirm Password").errors);
        allErrors.push(...textValidate(address, 200, "Address").errors);
        allErrors.push(...textValidate(city, 100, "City").errors);
        allErrors.push(...textValidate(province, 100, "Province").errors);
        allErrors.push(...textValidate(postalCode, 20, "Postal Code").errors);
        if (allErrors.length > 0) {
            regisUserResult.textContent = "Registration failed: " + allErrors.join("; ");
            return;
        }
        // Check password match
        if (password !== confirmPassword) {
            regisUserResult.textContent = "Registration failed: Password and Confirm Password do not match.";
            return;
        }
        try {
            const res = await fetch(`/api/owners/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                phoneNumber,
                password,
                address,
                city,
                province,
                postalCode,
            })
            });
            const data = await res.json();
            if (!res.ok) return regisUserResult.textContent = data.error;
            // Success
            localStorage.setItem('ownerID', data.ownerID);
            showMessage(regisUserResult, "Account created successfully!", "green");
            // Switch to pet form
            clientSection.style.display = "none";
            petSection.style.display = "block";
            petSection.scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            console.error("Registration error:", err);
            regisUserResult.textContent = 'Server errors: ' + err.message;
        }
    });


    // Pet Registration Logic
    document.getElementById("petForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        regisPetResult.textContent = "";
        // Get owner ID from localStorage
        const ownerId = localStorage.getItem('ownerID');
        if (!ownerId) return regisPetResult.textContent = "Owner ID not found. Please register again.";
        const payload = {
            owner_id: ownerId,
            name: textValidate(document.getElementById("pet_name").trim()).value,
            pet_type: textValidate(document.getElementById("pet_type").trim()).value,
            breed: textValidate(document.getElementById("pet_breed").trim()).value,
            color: textValidate(document.getElementById("pet_color").trim()).value,
            age: numberValidate(document.getElementById("pet_age")).value,
            gender: textValidate(document.getElementById("pet_sex").trim()).value,
            allergies: textValidate(document.getElementById("pet_allergy").trim()).value,
        };

        try {
            const res = await fetch(`/api/pets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                return regisPetResult.textContent = data.error;
            }
            // Success
            const data = await res.json();
            regisPetResult.textContent = data.message;

            // Optional redirect
            // setTimeout(() => window.location.href = "login.html", 1500);
        } catch (err) {
            console.error("Pet registration error:", err);
            regisPetResult.textContent = 'Server errors: ' + err.message;
        }
    });
});
