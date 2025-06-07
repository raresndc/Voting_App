# E-Voting Platform — Blockchain-Based Microservices

A highly secure, scalable, and modular **electronic voting platform** using **microservices, biometric verification, and blockchain** for maximum integrity and transparency.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Microservices](#microservices)

   * [Authentication Service](#1-authentication-service)
   * [Document Upload Service](#2-document-upload-service)
   * [Identity Verification Service](#3-identity-verification-service)
   * [Voting Service](#4-voting-service)
4. [Inter-Service Communication](#inter-service-communication)
5. [Database Design & Migrations](#database-design--migrations)
6. [Security Model](#security-model)
7. [API Examples](#api-examples)
8. [Running Locally](#running-locally)
9. [Audit & Compliance](#audit--compliance)
10. [Appendix: Example Configurations](#appendix-example-configurations)

---

## Architecture Overview

![](./docs/integrated_microservice_communication_diagram.png)
*(Replace with your actual diagram image)*

* **Spring Boot**: Auth, Document Upload, and Identity Verification services
* **Node.js**: Voting service
* **PostgreSQL & Redis**: Data stores (per-service, as described below)
* **OpenCV**: Face detection and verification
* **Hyperledger Fabric**: Blockchain for secure, immutable vote storage
* **JWT & 2FA**: Secure authentication across all services
* **RESTful APIs**: Microservice communication

---

## Technology Stack

| Service                 | Tech Stack                               | Main Responsibilities                                  |
| ----------------------- | ---------------------------------------- | ------------------------------------------------------ |
| Authentication Service  | Spring Boot, PostgreSQL, JWT, 2FA, Audit | User auth, registration, RBAC, token mgmt, audit logs  |
| Document Upload Service | Spring Boot, PostgreSQL, Redis, OpenCV   | ID upload, face extraction, metadata storage, audit    |
| Identity Verification   | Spring Boot, Redis, PostgreSQL, OpenCV   | Selfie upload, face matching, status updates, audit    |
| Voting Service          | Node.js, Hyperledger Fabric, JWT, Audit  | Vote casting, blockchain ledger, candidate mgmt, audit |

---

## Microservices

### 1. Authentication Service

#### **Purpose**

* User registration and authentication (JWT-based)
* Two-factor authentication (2FA)
* Password reset
* Role-Based Access Control (RBAC)
* Audit logging

#### **Controller/Service Structure**

```
com.example.authservice
├── controller
│   ├── AuthController.java
│   ├── UserController.java
│   └── RoleController.java
├── service
│   ├── AuthService.java
│   ├── UserService.java
│   └── AuditService.java
├── repository
│   ├── UserRepository.java
│   ├── RoleRepository.java
│   └── PasswordResetTokenRepository.java
├── config
│   ├── SecurityConfig.java
│   └── JwtConfig.java
├── model
│   ├── User.java
│   ├── Role.java
│   ├── PasswordResetToken.java
│   └── AuditLog.java
└── ...
```

#### **Example `SecurityConfig.java`**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired private JwtTokenProvider jwtTokenProvider;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/auth/**", "/api/password/**").permitAll()
            .antMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
            .and()
            .apply(new JwtConfigurer(jwtTokenProvider));
    }
}
```

#### **Database Schema & Example Migration**

`src/main/resources/db/migration/V1__init.sql`

```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    dob DATE,
    contact_info VARCHAR(100),
    role_id INT REFERENCES roles(id),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    token VARCHAR(255) NOT NULL,
    expiry TIMESTAMP NOT NULL
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidates (
    user_id INT PRIMARY KEY REFERENCES users(id),
    party_id INT,
    party_name VARCHAR(100),
    vote_count INT DEFAULT 0
);
```

#### **API Endpoints**

| Endpoint                | Method | Description                     | Auth Needed |
| ----------------------- | ------ | ------------------------------- | ----------- |
| `/api/auth/register`    | POST   | Register new user               | No          |
| `/api/auth/login`       | POST   | Authenticate user (returns JWT) | No          |
| `/api/auth/2fa/enable`  | POST   | Enable/verify 2FA for user      | Yes         |
| `/api/auth/2fa/verify`  | POST   | Verify 2FA token                | Yes         |
| `/api/users/me`         | GET    | Get current user profile        | Yes         |
| `/api/admin/roles`      | GET    | List roles                      | Admin       |
| `/api/password/request` | POST   | Request password reset link     | No          |
| `/api/password/reset`   | POST   | Reset password with token       | No          |

**Example Request**

```http
POST /api/auth/login
{
    "username": "john",
    "password": "MySecretPassw0rd!"
}
```

**Example Response**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": { "id": 1, "role": "user", ... },
  "2fa_required": true
}
```

---

### 2. Document Upload Service

#### **Purpose**

* Secure ID document upload and storage
* Face extraction using OpenCV
* Metadata storage in PostgreSQL, images in Redis
* Audit logging

#### **Controller/Service Structure**

```
com.example.documentservice
├── controller
│   └── DocumentController.java
├── service
│   ├── DocumentService.java
│   ├── FaceExtractionService.java
│   └── AuditService.java
├── repository
│   └── DocumentRepository.java
├── config
│   ├── SecurityConfig.java
│   └── RedisConfig.java
├── model
│   └── Document.java
└── ...
```

#### **Example `RedisConfig.java`**

```java
@Configuration
public class RedisConfig {
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory("localhost", 6379);
    }
}
```

#### **Database Schema & Example Migration**

`src/main/resources/db/migration/V1__init.sql`

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(100),
    content_type VARCHAR(50),
    upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_size INT,
    extracted_name VARCHAR(100),
    extracted_dob DATE,
    extracted_birthplace VARCHAR(100),
    face_bounding_box VARCHAR(100)
);
```

#### **API Endpoints**

| Endpoint                    | Method | Description                        | Auth Needed |
| --------------------------- | ------ | ---------------------------------- | ----------- |
| `/api/documents/upload`     | POST   | Upload document (image + metadata) | Yes         |
| `/api/documents/{id}`       | GET    | Get document metadata              | Yes         |
| `/api/documents/image/{id}` | GET    | Get document image from Redis      | Yes         |

**Example Request**

```http
POST /api/documents/upload
Content-Type: multipart/form-data
Authorization: Bearer <JWT>
- file: id_card.jpg
- extracted_name: John Doe
- extracted_dob: 1990-05-01
- extracted_birthplace: CityName
```

---

### 3. Identity Verification Service

#### **Purpose**

* Selfie upload and biometric matching (OpenCV)
* Stores selfies in Redis for fast access
* Verifies against document faces
* Updates verification status in PostgreSQL
* Audit logging

#### **Controller/Service Structure**

```
com.example.identityverificationservice
├── controller
│   └── VerificationController.java
├── service
│   ├── FaceVerificationService.java
│   ├── CacheService.java
│   └── AuditService.java
├── config
│   ├── SecurityConfig.java
│   └── RedisConfig.java
├── model
│   └── VerificationResult.java
└── ...
```

#### **API Endpoints**

| Endpoint                   | Method | Description                       | Auth Needed |
| -------------------------- | ------ | --------------------------------- | ----------- |
| `/api/verification/selfie` | POST   | Upload selfie for verification    | Yes         |
| `/api/verification/result` | GET    | Get result of latest verification | Yes         |

**Example Request**

```http
POST /api/verification/selfie
Content-Type: multipart/form-data
Authorization: Bearer <JWT>
- file: selfie.jpg
```

**Response**

```json
{
  "verified": true,
  "similarity": 0.89
}
```

---

### 4. Voting Service

#### **Purpose**

* Secure vote casting and storage on Hyperledger Fabric blockchain
* Vote audit and candidate/party tracking
* JWT authentication and audit logs

#### **Project Structure (Node.js)**

```
voting-service/
├── app.js
├── routes/
│   └── voting.js
├── services/
│   ├── blockchainService.js
│   └── auditService.js
├── middlewares/
│   └── auth.js
├── config/
│   └── fabricConfig.js
└── ...
```

#### **Example `auth.js` Middleware**

```js
const jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
```

#### **API Endpoints**

| Endpoint            | Method | Description                 | Auth Needed |
| ------------------- | ------ | --------------------------- | ----------- |
| `/api/vote`         | POST   | Cast a vote for a candidate | Yes         |
| `/api/candidates`   | GET    | List all candidates         | Yes         |
| `/api/vote/history` | GET    | Get user’s voting history   | Yes         |

**Example Vote Request**

```http
POST /api/vote
Authorization: Bearer <JWT>
{
  "candidate_id": 42
}
```

**Example Vote Blockchain Record**

```json
{
  "transactionId": "0xabc123...",
  "voterId": "anonymizedUserHash",
  "candidateId": 42,
  "timestamp": "2025-06-01T10:21:00Z"
}
```

---

## Inter-Service Communication

* All requests are authenticated with JWT tokens.
* Voting service checks user verification status via identity service before allowing a vote.
* Document service and identity service share face data via Redis for real-time matching.
* Audit logs are written per microservice for every key user action.

---

## Database Design & Migrations

Each microservice manages its own database schema. See migration files under `src/main/resources/db/migration` for Java services and any ORM migration scripts for Node.js (e.g., Sequelize, Knex).

---

## Security Model

* **JWT Authentication:** Every API is protected. Tokens are signed with strong secrets.
* **2FA:** Optional for users, enforced via TOTP (compatible with Google Authenticator, etc.).
* **Role-Based Access Control:** Actions restricted by user roles (user/candidate/admin).
* **Audit Logging:** All actions—login, upload, verification, voting—are logged with timestamp, user, action, and IP.
* **Password Security:** Passwords are hashed (bcrypt) and never stored in plain text.
* **Sensitive File Storage:** Photos are kept in Redis (memory), not persisted to disk, reducing long-term exposure.
* **Blockchain:** All votes are immutable and traceable, preventing double voting and tampering.

---

## API Examples

**Register:**

```http
POST /api/auth/register
{
  "username": "alice",
  "email": "alice@mail.com",
  "password": "SuperSecret123"
}
```

**Login:**

```http
POST /api/auth/login
{
  "username": "alice",
  "password": "SuperSecret123"
}
```

**Enable 2FA:**

```http
POST /api/auth/2fa/enable
Authorization: Bearer <JWT>
{
  "secret": "JBSWY3DPEHPK3PXP"
}
```

**Upload Document:**

```http
POST /api/documents/upload
Authorization: Bearer <JWT>
Form-data:
  file: id.jpg
  extracted_name: Alice Smith
  extracted_dob: 1987-07-12
```

**Upload Selfie:**

```http
POST /api/verification/selfie
Authorization: Bearer <JWT>
Form-data:
  file: selfie.jpg
```

**Cast Vote:**

```http
POST /api/vote
Authorization: Bearer <JWT>
{
  "candidate_id": 5
}
```

---

## Running Locally

Each service can be started independently. Ensure dependencies (Postgres, Redis, Hyperledger Fabric) are running.

**Example:**

```bash
cd authservice
./mvnw spring-boot:run

cd ../documentservice
./mvnw spring-boot:run

cd ../identityVerificationService
./mvnw spring-boot:run

cd ../voting
npm install
node app.js
```

Configure database and Redis URLs in each service’s `.env` or `application.properties`.

---

## Audit & Compliance

Every service writes an audit log of critical actions.
Audit logs can be centralized or queried for compliance and post-election review.

---

## Appendix: Example Configurations

**Spring Boot `application.properties`:**

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/authdb
spring.datasource.username=postgres
spring.datasource.password=changeme

spring.redis.host=localhost
spring.redis.port=6379

jwt.secret=SuperSecretJWTKey123456
jwt.expiration=86400000
```

**Node.js `.env`:**

```
PORT=3000
JWT_SECRET=SuperSecretJWTKey123456
FABRIC_NETWORK_CONFIG=./network.yaml
```

---

## Contributors

* \[Name] — System Architecture & Security

---
