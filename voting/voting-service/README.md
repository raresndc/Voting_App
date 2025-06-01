# Voting Service (Blockchain-based)

This project is a **blockchain-integrated voting service** that enables users to cast votes for candidates securely, with each vote recorded both on a Hyperledger Fabric blockchain and in a PostgreSQL database for querying results. It is designed to ensure authenticity, confidentiality, and integrity of voting processes in a microservices context.

---

## Table of Contents

* [Features](#features)
* [Architecture](#architecture)
* [Endpoints](#endpoints)
* [How it Works](#how-it-works)
* [Setup & Installation](#setup--installation)
* [Environment Variables](#environment-variables)
* [Project Structure](#project-structure)
* [Development](#development)
* [License](#license)

---

## Features

* **Blockchain Recording:** Every vote is written to Hyperledger Fabric, ensuring immutability and auditability.
* **Database Tracking:** Votes are also recorded in PostgreSQL for fast results aggregation.
* **JWT Authentication:** Only authenticated users (with valid JWTs) can vote or see results.
* **External Identity Verification:** Integration with an identity service to ensure only verified users can vote.
* **Simple REST API:** `/vote` to cast a vote, `/results` to see voting results.

---

## Architecture

* **Express.js**: HTTP server.
* **Hyperledger Fabric**: Blockchain backend for vote recording.
* **PostgreSQL**: Stores votes for easy results aggregation.
* **JWT (jsonwebtoken)**: Secures API endpoints.
* **Axios**: Communicates with the external identity verification service.

A typical voting request follows these steps:

1. User sends a POST `/vote` with their candidate choice and a JWT.
2. Server verifies the JWT, then checks user’s identity with the identity service.
3. Vote is written to the blockchain (Fabric).
4. Vote is also stored in PostgreSQL.
5. Results can be viewed via GET `/results`.

---

## Endpoints

### `POST /vote`

Cast a vote for a candidate.

* **Headers**:
  `Authorization: Bearer <JWT>`
* **Body**:

  ```json
  { "candidate": "CANDIDATE_NAME" }
  ```
* **Response**:
  `{ "success": true }`
* **Requirements**:

  * Valid JWT
  * User identity must be verified by the identity service

### `GET /results`

Fetch the number of votes per candidate.

* **Headers**:
  `Authorization: Bearer <JWT>`
* **Response**:

  ```json
  [
    { "candidate": "Alice", "count": 10 },
    { "candidate": "Bob", "count": 7 }
  ]
  ```
* **Requirements**:

  * Valid JWT

---

## How it Works

### 1. **JWT Authentication**

Every request must include a JWT in the `Authorization` header. The JWT is verified using the secret in your `.env` file.

### 2. **Identity Verification**

Before a vote is cast, the server contacts an external identity service (`ID_SERVICE_URL`) to check that the user’s identity has been verified.

### 3. **Blockchain Integration**

Votes are submitted to a Hyperledger Fabric smart contract (`voting-contract`) using the `fabric-network` library, ensuring the vote is immutable and tamper-resistant.

### 4. **Database Storage**

Every vote is also recorded in a PostgreSQL table (`votes`) for easy querying and results aggregation.

### 5. **Results Aggregation**

Votes are grouped by candidate in a simple SQL query for the `/results` endpoint.

---

## Setup & Installation

### Prerequisites

* Node.js (v18+ recommended)
* npm
* PostgreSQL database (with accessible credentials)
* Hyperledger Fabric network setup
* Fabric wallet with an enrolled identity (`appUser`)
* External identity verification service running

### 1. Clone the Repository

```bash
git clone <repo-url>
cd voting-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy and adjust the `.env` file with your actual values. Example:

```env
PORT=4000

FABRIC_WALLET=./wallet
FABRIC_CONNECTION_PROFILE=./connection.json

PG_CONN=postgresql://postgres:password@localhost:5432/auth_db

AUTH_SERVICE_URL=http://localhost:8080
ID_SERVICE_URL=http://localhost:8082

JWT_SECRET=your_secret_here
```

> **Note:** The `FABRIC_WALLET` folder and `FABRIC_CONNECTION_PROFILE` should point to your Fabric wallet directory and connection profile file, respectively.

### 4. Build the Project

```bash
npm run build
```

### 5. Start the Service

```bash
npm start
```

The service should now be running at `http://localhost:4000` (or your chosen port).

---

## Project Structure

```
src/
  fabric.ts     # Handles Hyperledger Fabric connection and contract
  index.ts      # Express app entrypoint, endpoints, middleware, business logic

dist/
  ...           # Compiled JavaScript files (after `npm run build`)

.env            # Environment variables
package.json    # Dependencies and scripts
```

---

## Development

* **TypeScript:** The codebase is TypeScript. Compile with `npm run build`.
* **Run in Dev Mode:** You may use `ts-node` for development, or add nodemon for hot reloading.
* **Testing:** (You may wish to add integration tests for endpoints.)


---

## Notes

* This service **requires** a running Hyperledger Fabric network and pre-enrolled `appUser` identity.
* The database table for votes is created automatically if it does not exist.
* The service relies on an external identity verification service for extra security.
* Make sure all services (database, identity, blockchain) are running before starting the voting service.

---
