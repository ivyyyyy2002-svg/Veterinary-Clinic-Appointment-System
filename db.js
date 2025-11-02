
// Use JSON file in data folder to store data
const fs = require('fs').promises;
const path = require('path');
const dbFile = path.join(__dirname, 'data', 'db.json');

const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
// Use JSON file for storage
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { courses: [] });

// Load from data file
async function loadData(){
    try{
        await db.read();
        db.data ||= {courses: []}; 
        return db;
    } catch (error) {
        console.log('Failed to Load Data:', error);
        return {courses: []};
    }
}

// Save to data file
async function saveData(db){
    // Replace old data with new
    await db.write();
}

module.exports = {loadData, saveData};