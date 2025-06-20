# Auth Microservice

This Auth Microservice provides:

- **User Registration & Email Verification**: 4‑digit code emailed upon signup; accounts pending until code confirmation.
- **JWT Authentication**: Access & refresh tokens with configurable lifetimes.
- **Two‑Factor Authentication (2FA)**: Optional TOTP (Google Authenticator/Authy) flow.
- **Role‑Based Access Control**: `ROLE_USER` and `ROLE_ADMIN` guard product endpoints.
- **Product Management API**: CRUD operations for products (admin only for create/update/delete).
- **Comprehensive Audit Logging**: Row-level JPA auditing plus business‑event logs in a dedicated `audit_logs` table, and security event tracing for login success/failure.

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
10. [Audit Logging](#audit-logging)
11. [Blinded Voting Process](#blinded-voting-process)

---

## Architecture Diagram

![Architecture Diagram](./architectureDiagram.png)

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

Hibernate will auto-create/update tables:

- **`app_users`**: Stores user profile data, verification code & expiry, 2FA secret & enabled flag, plus JPA audit columns (`created_by`, `created_date`, `last_modified_by`, `last_modified_date`).
- **`products`**: Stores product `id`, `name`, `price`, plus the same JPA audit columns.
- **`audit_logs`**: Custom table recording business events (REGISTER, VERIFY, LOGIN_SUCCESS, LOGIN_FAILURE, 2FA_SETUP, etc.).

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

| Endpoint                  | Method | Body                                          | Description                                                         |
|---------------------------|--------|-----------------------------------------------|---------------------------------------------------------------------|
| `/api/auth/register`      | POST   | `RegisterRequest` JSON                       | Create pending user; sends 4‑digit verification code via email.     |
| `/api/auth/verify`        | POST   | `VerifyRequest` `{ username, verificationCode }`  | Confirms code; marks account verified; sends completion email.      |
| `/api/auth/login`         | POST   | `LoginRequest` `{ username, password }`        | Validates credentials; if 2FA off → tokens; if 2FA on → `{ needs2fa:true }`. |
| `/api/auth/refresh-token` | POST   | `RefreshTokenRequest` `{ refreshToken }`       | Issues new access token (same refresh token returned).              |

### 2. Two‑Factor Authentication (TOTP)

| Endpoint               | Method | Body                                                  | Description                                                    |
|------------------------|--------|-------------------------------------------------------|----------------------------------------------------------------|
| `/api/auth/2fa/setup`  | POST   | Query `{ username }`                                  | Generates secret & QR‑URI for Google Authenticator.            |
| `/api/auth/2fa/confirm`| POST   | `Confirm2FARequest` `{ username, code }`              | Verifies first TOTP; enables 2FA on user record.               |
| `/api/auth/2fa/auth`   | POST   | `TwoFaLoginRequest` `{ username, password, code }`    | Completes login when 2FA is enabled; returns tokens.           |

### 3. Products

| Endpoint                 | Method | Role       | Body           | Description                         |
|--------------------------|--------|------------|----------------|-------------------------------------|
| `/api/products`          | GET    | USER/ADMIN | —              | List all products.                  |
| `/api/products/{id}`     | GET    | USER/ADMIN | —              | Get product by ID.                  |
| `/api/products`          | POST   | ADMIN      | `Product` JSON | Create a new product.               |
| `/api/products/{id}`     | PUT    | ADMIN      | `Product` JSON | Update existing product.            |
| `/api/products/{id}`     | DELETE | ADMIN      | —              | Delete a product.                   |

---

## Authentication Flows

### A. Registration & Email Verification

1. **Register** (`/api/auth/register`)
    - User submits profile + password.
    - Service saves user with `verified=false` and a 4‑digit PIN (expires in 1 hour).
    - Sends verification email.
2. **Verify** (`/api/auth/verify`)
    - User posts `{ username, verificationCode }`.
    - Service checks code & expiry, sets `verified=true`, clears code, sends completion email.

### B. JWT Login & Refresh

1. **Login** (`/api/auth/login`)
    - Validates `username+password`.
    - If not verified → HTTP 400 `Account not verified`.
    - If 2FA **off** → returns `{ accessToken, refreshToken }`.
    - If 2FA **on** → returns `{ needs2fa:true }`.
2. **2FA Login** (`/api/auth/2fa/auth`)
    - User posts `{ username, password, code }`.
    - Service re‑authenticates and validates TOTP.
    - Returns `{ accessToken, refreshToken }`.
3. **Refresh** (`/api/auth/refresh-token`)
    - User posts `{ refreshToken }`.
    - Service validates it and issues new access token.

---

## Project Structure

```text
src/main/java/com/auth/
├── audit/
│   ├── Auditable.java         # @interface for business events
│   ├── AuditAspect.java       # AOP interceptor for service methods
│   └── config/
│       └── AuditConfig.java   # @EnableJpaAuditing + AuditorAware
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java    # registration, login, verify, 2FA
│   ├── ProductController.java # product CRUD
│   └── AuditController.java   # (optional) GET /api/audit
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
│   ├── User.java              # +verification, 2FA fields, JPA audit
│   ├── Product.java           # JPA audit columns
│   └── AuditLog.java          # business event log entity
├── repository/
│   ├── UserRepository.java
│   ├── ProductRepository.java
│   └── AuditLogRepository.java
├── service/
│   ├── AuthService.java       # business logic: auth, verify, 2FA, audit annotations
│   ├── EmailService.java      # send verification & confirmation emails
│   ├── JwtService.java        # generate/validate tokens
│   ├── ProductService.java
│   └── CustomUserDetailsService.java
└── Application.java           # @SpringBootApplication + @EntityScan (if needed)
```

---

## Customization

- **Verification Code**: Default 4‑digit PIN; change in `AuthService.registerUser`.
- **Code Expiry**: Default 1 hour; adjust `LocalDateTime.now().plusHours(x)` or externalize.
- **2FA Settings**: Uses `com.warrenstrange:googleauth`; can swap for SMS/email OTP.
- **Token Lifetimes**: Update `app.jwt.expiration` and `app.jwt.refresh-expiration`.
- **Email Templates**: Customize in `EmailService` or switch to HTML/email templates.
- **Roles & Permissions**: Tweak `SecurityConfig` for endpoint access rules.
- **Audit Behavior**:
    - Entity auditing via JPA (`@CreatedBy`, etc.)
    - Business events logged via `@Auditable` + AOP into `audit_logs`
    - Security events captured via Spring listener.

---

## Audit Logging

This service records both data changes and business events:

1. **Entity Auditing**: Every `User` and `Product` row has `created_by`, `created_date`, `last_modified_by`, and `last_modified_date`. Powered by Spring Data JPA Auditing.
2. **Business-Event Logging**: Methods annotated with `@Auditable` are intercepted by an AOP aspect that writes to the `audit_logs` table. Events include `REGISTER`, `VERIFY`, `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `2FA_SETUP`, `2FA_CONFIRM`, and `LOGIN_2FA`.
3. **Security Events**: Listeners capture Spring Security login successes and failures and record them automatically.
4. **Reviewing Logs**: Admins can fetch logs via a secured `/api/audit` endpoint or by querying the database directly.

---

## Blinded Voting Process

To enable **privacy-preserving voting**, the microservice implements an RSA blind-signature protocol.

1. **Request Challenge**

   * **Endpoint**: `GET /api/vote/challenge`
   * **Headers**: `Authorization: Bearer <access_token>`
   * **Response**:

     ```json
     {
       "placeholderId": 123,
       "blindedValue": "BASE64_ENCODED_BLINDED_VUID"
     }
     ```
   * **Description**: Generates a fresh 32‑byte e‑VUID, blinds it with a random factor, persists a placeholder record (in `vote_tokens`), and returns the blinded value and placeholder ID.

2. **Client-side Unblinding**

   * Clients use the returned `blindedValue` and locally computed blinding factor `r` to unblind the server’s blind signature later.

3. **Obtain Signed Token**

   * **Endpoint**: `POST /api/vote/token`
   * **Headers**: `Authorization: Bearer <access_token>`
   * **Body**:

     ```json
     {
       "placeholderId": 123,
       "blindedSignature": "BASE64_ENCODED_BLINDED_SIGNATURE"
     }
     ```
   * **Response**:

     ```json
     {
       "evuid": "BASE64_ENCODED_RAW_VUID",
       "signature": "BASE64_ENCODED_SIGNED_BLINDED_VALUE"
     }
     ```
   * **Description**: Verifies the JWT, locates the placeholder, signs the blinded value, persists the signature, and returns the signature. The client then unblinds locally to obtain a valid signature over the raw e‑VUID.

4. **Vote Submission (Client-side)**

   * Use the unblinded signature (`signature_unblinded`) together with `evuid` as proof of eligibility when submitting a vote to the voting application. Each `vote_tokens` entry has a `used` flag to prevent replay.

Under the hood:

* **`RsaBlindSignatureService`** handles e‑VUID generation, blinding, signing, and unblinding using RSA parameters from configuration.
* **`VoteController`** exposes the `/vote/challenge` and `/vote/token` endpoints, uses `JwtService` to authenticate users, and persists tokens in the `vote_tokens` table.

---

*Contributions welcome—feel free to open issues or pull requests!*

