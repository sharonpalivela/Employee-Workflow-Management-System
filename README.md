# Workflow Management System

A full-stack workflow and approval management system built with **Spring Boot, React, MySQL, JWT authentication, and role-based access control**.

The application allows employees to submit workflow requests and enables managers to review, approve, or reject them through a responsive web interface. Administrators can view registered users and system-wide workflow activity.

---

## Overview

The Workflow Management System is designed to streamline common organizational workflows such as:

* Leave requests
* Expense requests
* Document-related requests

The system provides secure authentication, role-based authorization, REST APIs, request validation, database persistence, and a React-based dashboard.

---

## Key Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Password hashing using BCrypt
* Role-based access control
* Employee, Manager, and Admin roles
* Protected REST APIs

### Workflow Management

* Create workflow requests
* View personal requests
* Managers can view all workflow requests
* Approve or reject pending requests
* Track request status
* Request types: Leave, Expense, and Document
* Request metadata and timestamps

### Dashboards

#### Employee

* View personal workflow requests
* Create new requests
* View request status
* Request statistics

#### Manager

* View workflow activity
* Review pending requests
* Approve or reject requests
* View request statistics

#### Admin

* View registered users
* View system-wide workflow requests
* Monitor workflow activity

### Backend

* RESTful API architecture
* DTO-based request handling
* Input validation
* JPA entity relationships
* MySQL persistence
* JWT security filter
* Global exception handling
* Swagger / OpenAPI documentation
* Unit testing with JUnit 5 and Mockito

---

## Technology Stack

| Layer          | Technologies                       |
| -------------- | ---------------------------------- |
| Frontend       | React, JavaScript, Axios, CSS      |
| Backend        | Java, Spring Boot, Spring Security |
| Database       | MySQL                              |
| ORM            | Spring Data JPA, Hibernate         |
| Authentication | JWT                                |
| API            | REST                               |
| Documentation  | Swagger / OpenAPI                  |
| Testing        | JUnit 5, Mockito                   |
| DevOps         | Docker, Git, GitHub                |

---

## Architecture

```text
                    ┌──────────────────────┐
                    │     React Frontend   │
                    │   React + Axios      │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               │ JWT
                               ▼
                    ┌──────────────────────┐
                    │   Spring Boot API    │
                    │                      │
                    │ Controllers          │
                    │ Services             │
                    │ Security / JWT       │
                    │ Validation           │
                    └──────────┬───────────┘
                               │
                               │ JPA / Hibernate
                               ▼
                    ┌──────────────────────┐
                    │        MySQL         │
                    │                      │
                    │ Users                │
                    │ Requests             │
                    │ Audit Logs            │
                    └──────────────────────┘
```

---

## Project Structure

```text
workflow-system/
│
├── src/
│   ├── main/
│   │   ├── java/com/sharon/workflow_system/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   ├── dto/
│   │   │   ├── security/
│   │   │   ├── config/
│   │   │   ├── exception/
│   │   │   └── enums/
│   │   │
│   │   └── resources/
│   │
│   └── test/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── Dockerfile
├── pom.xml
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new employee        |
| POST   | `/api/auth/login`    | Authenticate and receive a JWT |

### Workflow Requests

| Method | Endpoint                     | Description                            |
| ------ | ---------------------------- | -------------------------------------- |
| POST   | `/api/requests`              | Create a workflow request              |
| GET    | `/api/requests`              | View workflow requests                 |
| GET    | `/api/requests/my`           | View the authenticated user's requests |
| PUT    | `/api/requests/{id}/approve` | Approve a request                      |
| PUT    | `/api/requests/{id}/reject`  | Reject a request                       |

### Users

| Method | Endpoint     | Description           |
| ------ | ------------ | --------------------- |
| GET    | `/api/users` | View registered users |

---

## Role-Based Access

### Employee

Employees can:

* Authenticate using JWT
* Create workflow requests
* View their own requests
* Track request status

### Manager

Managers can:

* Authenticate using JWT
* View workflow requests
* Review requests
* Approve requests
* Reject requests

### Admin

Administrators can:

* Authenticate using JWT
* View registered users
* View system-wide workflow activity

---

## Authentication Flow

```text
User Login
    │
    ▼
POST /api/auth/login
    │
    ▼
Spring Security validates credentials
    │
    ▼
JWT generated
    │
    ▼
React stores JWT
    │
    ▼
JWT sent with protected API requests
    │
    ▼
JwtAuthFilter validates token
    │
    ▼
User role loaded
    │
    ▼
Request authorized
```

JWT configuration is stored outside the tracked source code so that application secrets are not committed to Git.

---

## Running the Application

### Prerequisites

Make sure the following are installed:

* Java 17+
* Maven Wrapper included with the project
* MySQL
* Node.js and npm

### 1. Clone the Repository

```bash
git clone https://github.com/sharonpalivela/Employee-Workflow-Management-System.git
cd Employee-Workflow-Management-System
```

### 2. Configure MySQL

Create a MySQL database named:

```text
workflow_db
```

Configure your local database credentials in:

```text
src/main/resources/application.properties
```

This file is intentionally excluded from Git because it contains local configuration and secrets.

The JWT secret should also be configured locally using:

```properties
jwt.secret=YOUR_LOCAL_SECRET
```

### 3. Start the Backend

From the project root:

```bash
./mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### 4. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The React development server runs on the Vite-provided local URL, typically:

```text
http://localhost:5173
```

---

## API Documentation

Swagger UI is available after starting the backend:

```text
http://localhost:8080/swagger-ui/index.html
```

---

## Running Tests

From the project root:

```bash
./mvnw test
```

The project includes automated backend tests using JUnit 5 and Mockito.

---

## Docker

A Dockerfile is included for containerized backend deployment.

Build the image:

```bash
docker build -t workflow-system .
```

Run the container:

```bash
docker run -p 8080:8080 workflow-system
```

---

## Security

The application implements:

* JWT authentication
* BCrypt password hashing
* Role-based authorization
* Protected REST endpoints
* Local-only application secrets
* Password exclusion from serialized user responses

Application secrets such as database credentials and JWT signing keys are not committed to the repository.

---

## Future Enhancements

Potential future improvements include:

* Email notifications
* File upload support
* Advanced request history and audit views
* CI/CD pipeline
* Cloud deployment
* Additional workflow types
* More granular administrative permissions

---

## Author

**Palivela Pushpa Sharon**

GitHub: https://github.com/sharonpalivela
