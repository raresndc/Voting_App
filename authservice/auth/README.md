# Auth Microservice

This Auth Microservice provides user registration with email verification, JWT-based authentication (access and refresh tokens), and user management endpoints. It also includes basic product CRUD operations protected by user roles.

## Features

- **User Registration**: Users can register with comprehensive profile data. Upon registration, a verification code is emailed, and accounts remain unverified until code confirmation.
- **Email Verification**: Verification codes expire after a configurable duration (default: 1 hour). Verified accounts receive a registration completion email.
- **JWT Authentication**: Implements stateless authentication using JWT access and refresh tokens.
- **Role-Based Access Control**: Supports `ROLE_USER` and `ROLE_ADMIN`. Product management endpoints require admin privileges.
- **Product Management API**: Create, read, update, and delete products (admin only for write operations).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [API Endpoints](#api-endpoints)
7. [Project Structure](#project-structure)
8. [Customization](#customization)

## Prerequisites

- Java 17+
- Maven or Gradle
- PostgreSQL (or any JPA-supported database)
- SMTP server credentials for sending emails

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/auth-microservice.git
   cd auth-microservice
   ```

2. **Build**
   ```bash
   mvn clean install
   # or using Gradle
   gradle build
   ```

## Configuration

Configure application properties in `src/main/resources/application.properties` or `application.yml`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/auth_db
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update

# JWT
app.jwt.secret=BASE64_ENCODED_SECRET_KEY
app.jwt.expiration=3600000           # 1 hour in milliseconds
app.jwt.refresh-expiration=86400000   # 24 hours in milliseconds

# Email (SMTP)
spring.mail.host=smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=your_smtp_username
spring.mail.password=your_smtp_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```  

> **Note**: Replace all placeholder values with your actual configuration.

## Database Setup

- The application uses JPA/Hibernate to auto-create tables. Ensure the configured database is accessible.
- Key tables:
    - `app_users`: Stores user profiles, verification codes, and verification status.
    - `products`: Stores products with name and price.

## Running the Application

```bash
# Using Maven
tomcat7:run

# Or
java -jar target/auth-microservice.jar
```

## API Endpoints

### Authentication

| Endpoint                  | Method | Request Body                                   | Description                                                   |
|---------------------------|--------|------------------------------------------------|---------------------------------------------------------------|
| `/api/auth/register`      | POST   | `RegisterRequest` JSON                         | Registers a new user and sends a verification code by email. |
| `/api/auth/verify`        | POST   | `VerifyRequest` `{ username, verificationCode }` | Verifies the user’s account and sends registration completion email. |
| `/api/auth/login`         | POST   | `LoginRequest` `{ username, password }`         | Authenticates a verified user and returns access & refresh JWTs. |
| `/api/auth/refresh-token` | POST   | `RefreshTokenRequest` `{ refreshToken }`        | Issues a new access token if the refresh token is valid.     |

### Products

| Endpoint           | Method | Role Requirement | Request Body     | Description                  |
|--------------------|--------|------------------|------------------|------------------------------|
| `/api/products`    | GET    | `USER` or `ADMIN`| —                | Retrieves all products.      |
| `/api/products/{id}` | GET  | `USER` or `ADMIN`| —                | Retrieves a single product.  |
| `/api/products`    | POST   | `ADMIN`          | `Product` JSON   | Creates a new product.       |
| `/api/products/{id}` | PUT  | `ADMIN`          | `Product` JSON   | Updates an existing product. |
| `/api/products/{id}` | DELETE | `ADMIN`         | —                | Deletes a product.           |

## Project Structure

```
src/main/java/com/auth/
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java
│   └── ProductController.java
├── dto/
│   ├── LoginRequest.java
│   ├── RefreshTokenRequest.java
│   ├── RegisterRequest.java
│   ├── VerifyRequest.java        <-- Added
│   └── TokenPair.java
├── filter/
│   └── JwtAuthenticationFilter.java
├── model/
│   ├── User.java                <-- Updated with verification fields
│   └── Product.java
├── repository/
│   ├── UserRepository.java
│   └── ProductRepository.java
├── service/
│   ├── AuthService.java         <-- Updated for verification logic
│   ├── CustomUserDetailsService.java
│   ├── EmailService.java        <-- Updated with new methods
│   ├── JwtService.java
│   └── ProductService.java
└── Application.java
```

## Customization

- **Verification Code Lifetime**: Adjust in `AuthService.verifyUser` via `LocalDateTime.now().plusHours(x)`, or externalize to config.
- **Email Templates**: Enhance `EmailService` to use HTML templates or externalize subjects/bodies.
- **Security Policies**: Modify `SecurityConfig` to tune permitted endpoints and session management.

---

*Please feel free to contribute enhancements or report issues on the project repository.*

