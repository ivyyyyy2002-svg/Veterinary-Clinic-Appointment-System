// Ziqi Liu ECE 9014 Group 8
// This is the main JavaScript file for the Veterinary Clinic Appointment System

// Register
document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const outputMsg = document.getElementById('registrationResult');
    outputMsg.textContent = ''; // Clear previous output
    try{
        const userName = document.getElementById('name').value;
        const address = document.getElementById('address').value;  
        
    }
    catch(error){
        outputMsg.textContent = 'Registration failed: ' + error.message;
    }
    
}); 