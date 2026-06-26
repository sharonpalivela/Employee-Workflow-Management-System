# Workflow Management System

## Overview

The Workflow Management System is a backend application built using Spring Boot that enables users to create and manage workflow requests. The application implements secure authentication using JWT, role-based authorization, request management, validation, exception handling, API documentation, unit testing, and Docker containerization.

This project demonstrates industry-standard backend development practices using the Spring ecosystem.

---

## Features

* User Registration and Login
* JWT Authentication
* Role-Based Authorization (USER and MANAGER)
* Create Workflow Requests
* View All Requests
* View Personal Requests
* Approve and Reject Requests
* Filter Requests by Status
* Filter Requests by Type
* Pagination and Sorting
* Request Validation
* Global Exception Handling
* Swagger API Documentation
* Unit Testing using JUnit 5 and Mockito
* Docker Support

---

## Technology Stack

### Backend

* Java 17
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate

### Database

* MySQL

### Authentication

* JWT (JSON Web Token)

### Documentation

* Swagger / OpenAPI

### Testing

* JUnit 5
* Mockito

### DevOps

* Docker
* Git
* GitHub

---

## Project Structure

```text
src
├── controller
├── service
├── repository
├── entity
├── dto
├── security
├── config
├── exception
├── enums
└── resources
```

---

## API Endpoints

### Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |

### Requests

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | `/api/requests`              |
| GET    | `/api/requests`              |
| GET    | `/api/requests/my`           |
| PUT    | `/api/requests/{id}/approve` |
| PUT    | `/api/requests/{id}/reject`  |

### Users

| Method | Endpoint     |
| ------ | ------------ |
| GET    | `/api/users` |

---

## Authentication

The application uses JWT (JSON Web Tokens) for securing REST APIs.

### USER

* Create requests
* View personal requests

### MANAGER

* View all requests
* Approve requests
* Reject requests

---

## Running the Application

### Clone the Repository

```bash
git clone https://github.com/sharonpalivela/workflow-management-system.git
```

### Navigate to the Project

```bash
cd workflow-management-system
```

### Configure Database

Create an `application.properties` file based on the provided `application-example.properties` and configure your MySQL credentials.

### Run the Application

```bash
./mvnw spring-boot:run
```

---

## Running with Docker

Build the Docker image:

```bash
docker build -t workflow-system .
```

Run the Docker container:

```bash
docker run -p 8080:8080 workflow-system
```

---

## API Documentation

After starting the application, Swagger UI is available at:

```
http://localhost:8080/swagger-ui/index.html
```

---

## Running Tests

```bash
./mvnw test
```

---

## Future Enhancements

* Email Notifications
* File Upload Support
* Request History
* Admin Dashboard
* CI/CD Pipeline
* Cloud Deployment (AWS/Render)

---

## Author

**Palivela Pushpa Sharon**

GitHub: https://github.com/sharonpalivela
