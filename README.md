# Veterinary Clinic Appointment System

A web-based veterinary clinic appointment system for managing pet owners, pets, appointments, and clinic-related records. This project was developed as a course project and uses a separate frontend and backend structure.

## Overview

The system allows pet owners and clinic administrators to manage appointment-related information through a web interface. The frontend contains pages for user registration, login, appointment booking, pet management, user profiles, and admin dashboards. The backend provides REST-style API routes for handling owners, pets, appointments, diseases, admin authentication, and admin-side owner management.

## Features

- Client registration and login
- Admin login
- Pet owner profile management
- Pet record management
- Appointment booking with multi-step appointment form
- Appointment viewing and cancellation
- Admin dashboard for managing clinic information
- Backend API structure for owners, pets, appointments, diseases, and admin users
- MySQL database connection using environment variables
- Mock data scripts for testing and development

## Technologies Used

- JavaScript
- HTML
- CSS
- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- bcrypt
- JSON Web Token
- Git and GitHub

## Project Structure

```text
Veterinary-Clinic-Appointment-System/
├── client/          # Frontend HTML, CSS, and JavaScript files
├── server/          # Backend Express server, routes, controllers, and database config
├── mock_data/       # Mock data and test data scripts
├── db.js            # Earlier/local database utility file
├── .gitignore
└── ai-prompt.txt
