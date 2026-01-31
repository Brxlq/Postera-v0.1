# Assignment 4 — Secure MVC API with RBAC

This project extends Assignment 3 by refactoring the backend into a modular MVC
architecture and adding professional security features such as authentication,
authorization, and Role-Based Access Control (RBAC).

---

## Project Overview

The application is a RESTful API built with Node.js, Express, and MongoDB.
It follows the MVC (Model–View–Controller) pattern and implements secure access
control using JWT and bcrypt.

---

## Objects Explanation

### 1. Post (Primary Object)

The **Post** represents the main entity of the application.

Fields:
- title – title of the post
- content – body text
- author – reference to the User who created the post
- createdAt – creation timestamp

Purpose:
- Stores the main content of the application
- Used to demonstrate full CRUD operations
- Managed only by admin users

---

### 2. Comment (Secondary Object)

The **Comment** is a secondary object related to a Post.

Fields:
- text – comment content
- post – reference to the related Post
- author – reference to the User who created the comment
- createdAt – creation timestamp

Purpose:
- Demonstrates a relationship between two objects
- Allows authenticated users to interact with posts
- Shows access control on related data

---

## Architecture (MVC)

The project is structured using the MVC pattern:

models/       → MongoDB schemas (User, Post, Comment)
controllers/  → Business logic and CRUD operations
routes/       → API endpoints
middleware/   → Authentication, authorization, error handling

This separation improves scalability, readability, and maintainability.

---

## Authentication

- Users register and log in using email and password
- Passwords are hashed using bcrypt
- On successful login, a JWT token is issued
- The token must be sent in the Authorization header:

Authorization: Bearer <JWT_TOKEN>

---

## Role-Based Access Control (RBAC)

Two roles are implemented:
- user
- admin

Access Rules:

- Public access:
  - GET routes (reading posts and comments)

- Authenticated users:
  - Can create comments

- Admin-only access:
  - Create posts (POST)
  - Update posts (PUT)
  - Delete posts (DELETE)
  - Delete comments

RBAC is enforced using middleware that checks the user role decoded from the JWT.

---

## Setup Instructions

### 1. Install dependencies
npm install

### 2. Environment variables

Create a .env file in the root directory:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

### 3. Run the server
npm run dev

The API will be available at:
http://localhost:3000

---

## API Testing

A Postman collection is provided to demonstrate:
- Successful admin requests
- Failed user requests (403 Forbidden)
- Public access to GET endpoints

This confirms correct implementation of authentication and RBAC.
