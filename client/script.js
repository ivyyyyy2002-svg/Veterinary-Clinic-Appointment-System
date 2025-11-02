// Ziqi Liu ECE 9014 Group 8
// Veterinary Clinic Appointment System - Frontend Script

// ----------------------
// Simple client-side validation
// ----------------------
function numberValidate(num, min, max, label = 'Number') {
    const errors = [];
    const value = Number(num);
    if (!Number.isInteger(value)) errors.push(`${label} must be an integer`);
    if (value < min || value > max) errors.push(`${label} must be between ${min} and ${max}`);
    if (max === Infinity && value < min) errors.push(`${label} must be at least ${min}`);
    return { value, errors };
}

function textValidate(text, maxLen, label = 'Text') {
    const errors = [];
    let value = String(text).trim();
    if (value.length > maxLen) {
        value = value.slice(0, maxLen);
        errors.push(`${label} exceeds maximum length of ${maxLen}, truncated.`);
    }
    return { value, errors };
}

// ----------------------
// Register User
// ----------------------
document.getElementById('clientForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const outputMsg = document.getElementById('regisUserResult');
    outputMsg.textContent = '';

    try {
        // Owner info
        const userName = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phoneNumber').value;
        const city = document.getElementById('city').value;
        const province = document.getElementById('province').value;
        const address = document.getElementById('address').value;
        const postalCode = document.getElementById('postalcode').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        // Validate
        const userNameVal = textValidate(userName, 100, 'Name');
        const addressVal = textValidate(address, 200, 'Address');
        const cityVal = textValidate(city, 100, 'City');
        const provinceVal = textValidate(province, 100, 'Province');
        const emailVal = textValidate(email, 100, 'Email');
        const phoneVal = textValidate(phone, 20, 'Phone');
        const postalCodeVal = textValidate(postalCode, 20, 'Postal Code');
        const passwordVal = textValidate(password, 100, 'Password');
        const confirmPasswordVal = textValidate(confirmPassword, 100, 'Confirm Password');

        if (passwordVal.value !== confirmPasswordVal.value) {
            outputMsg.textContent = 'Registration failed: Password and Confirm Password do not match.';
            return;
        }

        const allErrors = [
            ...userNameVal.errors, ...addressVal.errors, ...cityVal.errors,
            ...provinceVal.errors, ...emailVal.errors, ...phoneVal.errors,
            ...postalCodeVal.errors, ...passwordVal.errors, ...confirmPasswordVal.errors
        ];
        if (allErrors.length > 0) {
            outputMsg.textContent = 'Registration failed: ' + allErrors.join('; ');
            return;
        }

        // Create user info
        const userInfo = {
            name: userNameVal.value,
            phoneNumber: phoneVal.value,
            email: emailVal.value,
            address: addressVal.value,
            city: cityVal.value,
            province: provinceVal.value,
            postalCode: postalCodeVal.value,
            password: passwordVal.value
        };

        const res = await fetch('/api/owners/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInfo)
        });

        if (!res.ok) {
            const errorData = await res.json();
            outputMsg.textContent = 'Error: ' + (errorData.message || 'Unknown error');
            return;
        }

        const result = await res.json();
        //outputMsg.textContent = result.message + ' Your Owner ID is ' + result.ownerID;

        // Show pet section
        document.getElementById('petSection').style.display = 'block';
        document.getElementById('owner_id').value = result.ownerID;

    } catch (error) {
        outputMsg.textContent = 'Registration failed: ' + error.message;
        document.getElementById('petSection').style.display = 'block';
    }
});

// ----------------------
// Register Pet
// ----------------------
document.getElementById('petForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const outputMsg = document.getElementById('regisPetResult');
    outputMsg.textContent = '';

    try {
        const petName = document.getElementById('pet_name').value;
        const petType = document.getElementById('pet_type').value;
        const petBreed = document.getElementById('pet_breed').value;
        const petAge = document.getElementById('pet_age').value;
        const petColor = document.getElementById('pet_color').value;
        const petSex = document.getElementById('pet_sex').value;
        const petAllergy = document.getElementById('pet_allergy').value;
        const ownerID = document.getElementById('owner_id').value;

        // Validation
        const petNameVal = textValidate(petName, 100, 'Pet Name');
        const petBreedVal = textValidate(petBreed, 100, 'Pet Breed');
        const petAgeVal = numberValidate(petAge, 0, 100, 'Pet Age');
        const petAllergyVal = textValidate(petAllergy, 200, 'Pet Allergy');
        const ownerIdVal = numberValidate(ownerID, 1, Infinity, 'Owner ID');

        const allErrors = [
            ...petNameVal.errors, ...petBreedVal.errors,
            ...petAgeVal.errors, ...petAllergyVal.errors, ...ownerIdVal.errors
        ];
        if (allErrors.length > 0) {
            outputMsg.textContent = 'Registration failed: ' + allErrors.join('; ');
            return;
        }

        const petInfo = {
            name: petNameVal.value,
            type: petType,
            breed: petBreedVal.value,
            age: petAgeVal.value,
            color: petColor,
            gender: petSex,
            allergies: petAllergyVal.value,
            ownerID: ownerIdVal.value
        };

        const res = await fetch('/api/pets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(petInfo)
        });

        if (!res.ok) {
            const errorData = await res.json();
            outputMsg.textContent = 'Error: ' + (errorData.message || 'Unknown error');
            return;
        }

        const result = await res.json();
        //outputMsg.textContent = result.message + ' Your Pet ID is ' + result.petID + '. Registration Complete!';
        setTimeout(() => {
            window.location.href = "success.html";
        }, 500);

    } catch (error) {
        outputMsg.textContent = 'Pet Registration failed: ' + error.message;
    }
});
