// Ziqi Liu ECE 9014 Group 8
// This is the main JavaScript file for the Veterinary Clinic Appointment System

// Simple client-side validation
function numberValidate (num, min, max, label='Number') {
    const errors = [];
    const value = Number(num);
    if (!Number.isInteger(value)) errors.push(`${label} Must be an integer`);
    if (value < min || value > max) errors.push(`${label} Must be between ${min} and ${max}`);
    if (max === Infinity && value < min) errors.push(`${label} Must be at least ${min}`);
    return {value: value, errors: errors};
}
function textValidate (text, maxLen, label='Text') {
    const errors = [];
    const value = String(text).trim();
    if (value.length > maxLen){
        value = value.slice(0, maxLen);
        errors.push(`${label} exceeds maximum length of ${maxLen}, truncated.`);
    }
    return {value: value, errors: errors};
}

// Register User
document.getElementById('clientForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const outputMsg = document.getElementById('regisUserResult');
    outputMsg.textContent = ''; 
    try{
        // Owner info
        const userName = document.getElementById('name').value; 
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const city = document.getElementById('city').value;
        const province = document.getElementById('province').value;
        const address = document.getElementById('address').value;
        const postalCode = document.getElementById('postalcode').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        
        // Validate inputs 
        // Assume max lengths for user name 100, address 200, city 100, province 100, email 100, phone 20
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
        if (userNameVal.errors.length || addressVal.errors.length || cityVal.errors.length || provinceVal.errors.length || emailVal.errors.length || phoneVal.errors.length || postalCodeVal.errors.length || passwordVal.errors.length || confirmPasswordVal.errors.length) {
            const allErrors = [...userNameVal.errors, ...addressVal.errors, ...cityVal.errors, ...provinceVal.errors, ...emailVal.errors, ...phoneVal.errors, ...postalCodeVal.errors, ...passwordVal.errors, ...confirmPasswordVal.errors];
            outputMsg.textContent = 'Registration failed: ' + allErrors.join('; ');
            return; 
        }
        // Create a user info
        const userInfo = {
            full_name: userNameVal.value,
            phone: phoneVal.value,
            email: emailVal.value,
            address: addressVal.value,
            city: cityVal.value,
            province: provinceVal.value,
            postalCode: postalCodeVal.value,
            password: passwordVal.value
        };
        const res = await fetch('/api/owners/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });
        if (!res.ok) {
            const errorData = await res.json();
            outputMsg.innerHTML = '';
            const safeText = document.createTextNode('Error: ' + errorData.message);
            outputMsg.appendChild(safeText);
            return;
        }
        const result = await res.json();
        outputMsg.innerHTML = '';
        const safeText = document.createTextNode(result.message + ' Your Owner ID is ' + result.ownerId);
        outputMsg.appendChild(safeText);
        // Show pet section
        document.getElementById('petSection').style.display = 'block';
        document.getElementById('owner_id').value = result.ownerId;

    }catch(error){
        outputMsg.textContent = 'Registration failed: ' + error.message;
        // document.getElementById('petSection').style.display = 'none';
        document.getElementById('petSection').style.display = 'block';
    }
    
}); 

// Register Pet
document.getElementById('petForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const outputMsg = document.getElementById('regisUserResult');
    outputMsg.textContent = '';
    try{
        // Pet info
        const petName = document.getElementById('pet_name').value;
        const petType = document.getElementById('pet_type').value;
        const petBreed = document.getElementById('pet_breed').value;
        const petColor = document.getElementById('pet_color').value;
        const petAge = document.getElementById('pet_age').value;
        const petSex = document.getElementById('pet_sex').value;
        const petAllergy = document.getElementById('pet_allergy').value;
        const ownerId = document.getElementById('owner_id').value;
        // Validate inputs
        // Assume Pet name 100, type 50, breed 100, color 50, age 0-100, allergy 200
        const petNameVal = textValidate(petName, 100, 'Pet Name');
        const petBreedVal = textValidate(petBreed, 100, 'Pet Breed');
        const petColorVal = textValidate(petColor, 50, 'Pet Color');
        const petAgeVal = numberValidate(petAge, 0, 100, 'Pet Age');
        const petAllergyVal = textValidate(petAllergy, 200, 'Pet Allergy');
        const ownerIdVal = numberValidate(ownerId, 1, Infinity, 'Owner ID');
        if (petNameVal.errors.length || petBreedVal.errors.length || petColorVal.errors.length || petAgeVal.errors.length || petAllergyVal.errors.length || ownerIdVal.errors.length) {
            const allErrors = [...petNameVal.errors, ...petBreedVal.errors, ...petColorVal.errors, ...petAgeVal.errors, ...petAllergyVal.errors, ...ownerIdVal.errors];
            outputMsg.textContent = 'Registration failed: ' + allErrors.join('; ');
            return; 
        }
        // Create a pet info
        const petInfo = {
            name: petNameVal.value,
            type: petType,
            breed: petBreedVal.value,
            color: petColorVal.value,
            age: petAgeVal.value,
            sex: petSex,
            allergy: petAllergyVal.value,
            owner_id: ownerIdVal.value
        };
        const res = await fetch('/api/pets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(petInfo)
        });
        if (!res.ok) {
            const errorData = await res.json();
            outputMsg.innerHTML = '';
            const safeText = document.createTextNode('Error: ' + errorData.message);
            outputMsg.appendChild(safeText);
            return;
        }
        const result = await res.json();
        outputMsg.innerHTML = '';
        const safeText = document.createTextNode(result.message + ' Your Pet ID is ' + result.petId + '. Registration Complete!');
        outputMsg.appendChild(safeText);


    }catch(error){
        outputMsg.textContent = 'Pet Registration failed: ' + error.message;
    }   

});


