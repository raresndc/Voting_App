# Auth Microservice

This Auth Microservice provides:

- **User Registration & Email Verification**: 4‑digit code emailed upon signup, accounts are pending until code confirmation.
- **JWT Authentication**: Access & refresh tokens with configurable lifetimes.
- **Two‑Factor Authentication (2FA)**: Optional TOTP (Google Authenticator/Authy) flow.
- **Role‑Based Access Control**: `ROLE_USER` and `ROLE_ADMIN` guard product endpoints.
- **Product Management API**: CRUD operations for products (admin only for create/update/delete).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [API Endpoints](#api-endpoints)
7. [Authentication Flows](#authentication-flows)
8. [Project Structure](#project-structure)
9. [Customization](#customization)

---

## Prerequisites

- Java 17+
- Maven or Gradle
- PostgreSQL (or any JPA‑supported database)
- SMTP credentials for sending emails

---

## Installation

1. **Clone**
   ```bash
   git clone https://github.com/your-repo/auth-microservice.git
   cd auth-microservice
   ```
2. **Build**
   ```bash
   mvn clean install
   # or
   gradle build
   ```

---

## Configuration

Configure in `src/main/resources/application.properties` or `application.yml`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/auth_db
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update

# JWT
app.jwt.secret=BASE64_SECRET
app.jwt.expiration=3600000           # access token (ms)
app.jwt.refresh-expiration=86400000  # refresh token (ms)

# Email (SMTP)
spring.mail.host=smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=your_username
spring.mail.password=your_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

> **Tip**: Replace placeholders with your credentials.

---

## Database Setup

Tables are auto-created by Hibernate:

- **`app_users`**: Stores user profile, verification code & expiry, 2FA secret & enabled flag.
- **`products`**: Stores product `id`, `name`, `price`.

---

## Running the Application

```bash
# Maven:
mvn spring-boot:run

# Or executable JAR:
java -jar target/auth-microservice.jar
```

---

## API Endpoints

### 1. Authentication

| Endpoint                     | Method | Body                                         | Description                                                         |
|------------------------------|--------|----------------------------------------------|---------------------------------------------------------------------|
| `/api/auth/register`         | POST   | `RegisterRequest` JSON                      | Create pending user; sends 4‑digit verification code via email.     |
| `/api/auth/verify`           | POST   | `VerifyRequest` `{ username, verificationCode }` | Confirms the code; marks account verified; sends confirmation email. |
| `/api/auth/login`            | POST   | `LoginRequest` `{ username, password }`       | Verifies credentials; if 2FA off → returns tokens; if 2FA on → `{ needs2fa: true }`. |
| `/api/auth/refresh-token`    | POST   | `RefreshTokenRequest` `{ refreshToken }`      | Issues new access token (same refresh token returned).             |

### 2. Two‑Factor Authentication (TOTP)

| Endpoint                     | Method | Body                                        | Description                                                    |
|------------------------------|--------|---------------------------------------------|----------------------------------------------------------------|
| `/api/auth/2fa/setup`        | POST   | Query `{ username }`                        | Generates secret & QR‑URI for Google Authenticator provisioning. |
| `/api/auth/2fa/confirm`      | POST   | `Confirm2FARequest` `{ username, code }`    | Verifies first TOTP; enables 2FA on user record.                |
| `/api/auth/2fa/auth`         | POST   | `TwoFaLoginRequest` `{ username, password, code }` | Complete login when 2FA is enabled; returns tokens.            |

### 3. Products

| Endpoint                   | Method | Role       | Body           | Description                         |
|----------------------------|--------|------------|----------------|-------------------------------------|
| `/api/products`            | GET    | USER/ADMIN | —              | List all products.                  |
| `/api/products/{id}`       | GET    | USER/ADMIN | —              | Get product by ID.                  |
| `/api/products`            | POST   | ADMIN      | `Product` JSON | Create a new product.               |
| `/api/products/{id}`       | PUT    | ADMIN      | `Product` JSON | Update existing product.            |
| `/api/products/{id}`       | DELETE | ADMIN      | —              | Delete a product.                   |

---

## Authentication Flows

### A. Registration & Email Verification

1. **Register** (`/api/auth/register`)
    - User submits full profile + password.
    - Service saves user with `verified=false` and `verificationCode` = random 4‑digit PIN.
    - Sends email with PIN; code expires in 1 hour.
2. **Verify** (`/api/auth/verify`)
    - User posts `{ username, verificationCode }`.
    - Service checks code & expiry, sets `verified=true`, clears code, sends completion email.

### B. JWT Login & Refresh

1. **Login** (`/api/auth/login`)
    - Validates `username+password`.
    - If user not verified → HTTP 400 `Account not verified`.
    - If 2FA **off** → returns `{ accessToken, refreshToken }`.
    - If 2FA **on** → returns `{ needs2fa: true }` (no tokens).
2. **2FA Login** (`/api/auth/2fa/auth`)
    - User posts `{ username, password, code }`.
    - Service re‑authenticates and validates TOTP code.
    - Returns `{ accessToken, refreshToken }`.
3. **Refresh** (`/api/auth/refresh-token`)
    - User posts `{ refreshToken }`.
    - Service validates it and issues a new access token.

---

## Project Structure

```text
src/main/java/com/auth/
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java      # registration, login, verify, 2FA endpoints
│   └── ProductController.java   # CRUD operations
├── dto/
│   ├── LoginRequest.java
│   ├── RefreshTokenRequest.java
│   ├── RegisterRequest.java
│   ├── VerifyRequest.java
│   ├── Confirm2FARequest.java
│   ├── TwoFaLoginRequest.java
│   └── TokenPair.java
├── filter/
│   └── JwtAuthenticationFilter.java
├── model/
│   ├── User.java                # +verification, 2FA fields
│   └── Product.java
├── repository/
│   ├── UserRepository.java
│   └── ProductRepository.java
├── service/
│   ├── AuthService.java         # business logic for auth, verify, 2FA
│   ├── EmailService.java        # send verification & confirmation emails
│   ├── JwtService.java          # generate/validate tokens
│   ├── CustomUserDetailsService.java
│   └── ProductService.java
└── Application.java
```

---

## Customization

- **Verification Code**: Default 4‑digit PIN; modify generator in `AuthService.registerUser`.
- **Code Expiry**: Default 1 hour; adjust `LocalDateTime.now().plusHours(x)` or externalize.
- **2FA Settings**: TOTP via `com.warrenstrange:googleauth`; you can swap for SMS/email OTP easily.
- **Token Lifetimes**: Change `app.jwt.expiration` and `app.jwt.refresh-expiration` in config.
- **Email Templates**: Customize subjects/bodies or switch to HTML templates in `EmailService`.
- **Roles & Permissions**: Update `SecurityConfig` to tweak endpoint access rules.

---

*Contributions welcome—feel free to open issues or pull requests!*

