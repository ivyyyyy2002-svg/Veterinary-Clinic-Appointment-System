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

// Register
document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const outputMsg = document.getElementById('registrationResult');
    outputMsg.textContent = ''; 
    try{
        // Owner info
        const userName = document.getElementById('name').value;
        const address = document.getElementById('address').value; 
        const city = document.getElementById('city').value;
        const province = document.getElementById('province').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        // Pet info
        const petName = document.getElementById('pet_name').value;
        const petType = document.getElementById('pet_type').value;
        const petBreed = document.getElementById('pet_breed').value;
        const petColor = document.getElementById('pet_color').value;
        const petAge = document.getElementById('pet_age').value;
        const petSex = document.getElementById('pet_sex').value;
        const petAllergy = document.getElementById('pet_allergy').value;
        // Validate inputs 
        // Assume max lengths for user name 100, address 200, city 100, province 100, email 100, phone 20
        // Pet name 100, type 50, breed 100, color 50, age 0-100, allergy 200
        const userNameVal = textValidate(userName, 100, 'Name');
        const addressVal = textValidate(address, 200, 'Address');
        const cityVal = textValidate(city, 100, 'City');
        const provinceVal = textValidate(province, 100, 'Province');
        const emailVal = textValidate(email, 100, 'Email');
        const phoneVal = textValidate(phone, 20, 'Phone');
        if (userNameVal.errors.length || addressVal.errors.length || cityVal.errors.length || provinceVal.errors.length || emailVal.errors.length || phoneVal.errors.length) {
            const allErrors = [...userNameVal.errors, ...addressVal.errors, ...cityVal.errors, ...provinceVal.errors, ...emailVal.errors, ...phoneVal.errors];
            outputMsg.textContent = 'Registration failed: ' + allErrors.join('; ');
            return; 
        }
        const petNameVal = textValidate(petName, 100, 'Pet Name');
        const petTypeVal = textValidate(petType, 50, 'Pet Type');
        const petBreedVal = textValidate(petBreed, 100, 'Pet Breed');
        const petColorVal = textValidate(petColor, 50, 'Pet Color');
        const petAgeVal = numberValidate(petAge, 0, 100, 'Pet Age');
        const petAllergyVal = textValidate(petAllergy, 200, 'Pet Allergy');
        if (petNameVal.errors.length || petTypeVal.errors.length || petBreedVal.errors.length || petColorVal.errors.length || petAgeVal.errors.length || petAllergyVal.errors.length) {
            const allErrors = [...petNameVal.errors, ...petTypeVal.errors, ...petBreedVal.errors, ...petColorVal.errors, ...petAgeVal.errors, ...petAllergyVal.errors];
            outputMsg.textContent = 'Registration failed: ' + allErrors.join('; ');
            return; 
        }
        // Create a user info
        const userInfo = {
            full_name: userNameVal.value,
            address: addressVal.value,
            city: cityVal.value,
        };

    
    }catch(error){
        outputMsg.textContent = 'Registration failed: ' + error.message;
    }
    
}); 

