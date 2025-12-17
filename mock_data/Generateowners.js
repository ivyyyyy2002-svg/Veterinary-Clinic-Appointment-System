const mysql = require("mysql2/promise");
const { faker } = require("@faker-js/faker");

// hashed password for "123456"
const hashedPassword = "$2b$10$aPtfSJnr.uPgvMJbvHeKye8IoAfXf53aWpwVDlEoVJA/pIP8nm7vu";

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "wjy000908",  
    database: "vet_clinic",
};

async function generateOwners() {
    console.log("Connecting to database...");
    const connection = await mysql.createConnection(dbConfig);

    const total = 2000;
    let values = [];

    for (let i = 0; i < total; i++) {
        const name = faker.person.fullName();
        const email = `owner${i}_${faker.internet.email().toLowerCase()}`;
        const phone = faker.string.numeric(10);  
        const address = faker.location.streetAddress();
        const city = faker.location.city();
        const province = faker.location.state();
        const postalCode = faker.location.zipCode();

        values.push([name,email,phone,hashedPassword,address,city,province,postalCode,]);
    }

    const insertSQL = `INSERT INTO owners (name, email, phoneNumber, password, address, city, province, postalCode) VALUES ?`;

    await connection.query(insertSQL, [values]);
    await connection.end();
}

    generateOwners().catch(err => {
        console.error("Error:", err);
    });