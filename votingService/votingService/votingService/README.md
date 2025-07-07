# Voting Service Microservice – README

---

## **Table of Contents**

1. [Overview](#overview)
2. [Architecture](#architecture)

    * [Component Diagram](#component-diagram)
    * [Key Technologies](#key-technologies)
3. [How it Works](#how-it-works)

    * [Voting Token Issuance and Security](#voting-token-issuance-and-security)
    * [End-to-End Voting Flow](#end-to-end-voting-flow)
    * [Blockchain (Fabric) Integration](#blockchain-fabric-integration)
4. [API Endpoints](#api-endpoints)
5. [Project Structure](#project-structure)
6. [Configuration](#configuration)
7. [Deployment and Running Locally](#deployment-and-running-locally)
8. [Diagrams](#diagrams)
9. [Appendix: Code-level Details](#appendix-code-level-details)

---

## **Overview**

This microservice provides a **secure, blockchain-backed voting system** as part of a larger e-voting platform. It exposes REST APIs for vote casting and status checking, handles cryptographic token validation, and leverages Hyperledger Fabric (via Fablo) for tamper-evident vote recording.

---

## **Architecture**

### **Component Diagram**

```plaintext
+--------------------+          +------------------------+
|  Frontend Client   | <------> |   Voting Service API   |
|  (Web/Mobile)      |  HTTPS   | (Spring Boot, REST)    |
+--------------------+          +----------+-------------+
                                         |
                                         | Java SDK
                                         v
                                 +-------+--------+
                                 | Hyperledger    |
                                 | Fabric Network |
                                 | (Fablo setup)  |
                                 +-------+--------+
                                         |
                                 +-------+--------+
                                 | Voting Chaincode|
                                 | (Node.js)      |
                                 +----------------+
```

**Legend:**

* The client never sees blockchain directly—only talks to the backend.
* Backend handles all cryptography, Fabric integration, and business rules.

---

### **Key Technologies**

* **Spring Boot (Java):** REST API, security, service orchestration
* **Hyperledger Fabric:** Permissioned blockchain for secure, immutable vote records
* **Fablo:** Fabric network management
* **RSA Blind Signatures:** Anonymous, verifiable voting tokens
* **Maven:** Project build and dependency management

---

## **How it Works**

### **Voting Token Issuance and Security**

1. **Voter authenticates** in a separate (auth) service and receives a **one-time-use voting token** (called `evuid`).
2. This token is **blind-signed using RSA** by the authority, meaning:

    * The system signs a *blinded* version of the token.
    * Later, the voter can prove token authenticity without revealing its origin, ensuring voter privacy.
3. **At voting time:**

    * The backend verifies the signature (using RSA public key) **without learning the voter’s identity**.

**Security properties:**

* No double voting: Each token is one-time-use.
* Full privacy: Voter cannot be linked to their ballot by the backend or blockchain.

---

### **End-to-End Voting Flow**

```plaintext
[Client] --(vote request + token)--> [Voting API] --(validate token)-->
     |                                      |
     | <-------(success/error)---------------|
     |
     |--(on success: vote cast on Fabric blockchain)-->
```

**Step-by-step:**

1. **Client submits a vote** (includes chosen candidate and signed voting token).
2. **Backend verifies token** using RSA public key & blind signature logic.
3. **Backend checks for double voting** by querying the blockchain.
4. **If valid:** Backend invokes Fabric chaincode to record the vote.
5. **Response returned** to the client with status.

---

### **Blockchain (Fabric) Integration**

* The backend uses the **Fabric Java SDK** to connect as a client:

    * Loads connection profile, certificate, and key.
    * Creates a `Gateway`, opens the network and contract.

* **All votes are stored on the Fabric blockchain** by invoking chaincode functions:

    * **`CastVote(evuid, candidateId)`**: Records the vote (one per token)
    * **`HasVoted(evuid)`**: Checks if a token has already been used

* **Chaincode is implemented in Node.js** for clear separation of business logic and auditability.

---

## **API Endpoints**

| Method | Path                    | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | `/api/votes/hasVoted`   | Check if a token was used |
| POST   | `/api/votes/cast`       | Cast a vote               |
| GET    | `/api/votes/candidates` | List available candidates |
| ...    | ...                     | ...                       |

### Example: **Cast Vote**

**POST** `/api/votes/cast`

```json
{
  "evuid": "abcdef123456...",
  "candidateId": "CAND_01",
  "signature": "BASE64_SIGNATURE"
}
```

**Response**

```json
{ "status": "success", "message": "Vote recorded for CAND_01" }
```

---

## **Project Structure**

```plaintext
votingService/
  ├── chaincode/
  │    └── voting-contract/   # Fabric chaincode (Node.js)
  ├── votingService/
  │    ├── src/
  │    │    ├── main/
  │    │    │    ├── java/com/voting/votingService/
  │    │    │    │    ├── config/         # Fabric and security config
  │    │    │    │    ├── domain/         # Entities (Candidate, VoteToken, etc)
  │    │    │    │    ├── filter/         # Web filters
  │    │    │    │    ├── security/       # RSA/crypto
  │    │    │    │    ├── service/        # Business logic (VotingService, etc)
  │    │    │    │    ├── web/            # REST controllers
  │    │    │    │    ├── VotingServiceApplication.java
  │    │    │    ├── resources/
  │    │    └── test/
  │    ├── pom.xml
  ├── fablo-config.yaml                 # Fablo network definition
  └── ...
```

---

## **Configuration**

Main configuration files:

* **`.env`**: Sensitive runtime settings (not committed)
* **`application.properties`**: Spring Boot properties
* **`fablo-config.yaml`**: Fabric network topology
* **RSA key settings**:

    * `evoting.publicKeyPath`: Path to authority’s public key (for verifying tokens)
    * `rsa.modulus`, `rsa.publicExp`: Public key params (used in signature verification)
* **Fabric connection settings**:

    * `fabric.networkConfig`: Path to connection profile (YAML)
    * `fabric.certPath`: Path to X.509 cert for client identity

---

## **Deployment and Running Locally**

### **Prerequisites**

* Java 17+
* Maven
* Node.js (for chaincode)
* Docker & Docker Compose (for Fablo/Fabric)
* Fablo CLI (to bring up the network)

### **Run Fabric network (via Fablo)**

```sh
fablo up
```

### **Deploy chaincode**

```sh
fablo deploy
```

### **Run backend**

```sh
cd votingService/votingService/votingService
mvn spring-boot:run
```

**Set the correct `.env` and `application.properties` before running!**

---

## **Diagrams**

### **1. Component Diagram**

![Component Diagram](https://i.imgur.com/f8voting-component.png)
*(Replace with generated diagram if needed)*

### **2. Voting Sequence Diagram**

```plaintext
+---------+      +------------------+        +-----------------------+      +----------------+
| Voter   |      | Voting Service   |        | Fabric Network        |      | Chaincode      |
+---------+      +------------------+        +-----------------------+      +----------------+
    | POST /cast     |                            |                              |
    |---------------->|                            |                              |
    |                |-- verify token & signature |                              |
    |                |-- check chaincode: HasVoted|----------------------------->|
    |                |                            |      (evuid)                 |
    |                |                            |<-----------------------------|
    |                |-- submit CastVote -------->|                              |
    |                |                            |      (evuid, candidateId)    |
    |                |                            |----------------------------->|
    |                |                            |     store vote               |
    |                |                            |<-----------------------------|
    |<---------------|                            |                              |
   [success/fail]    |                            |                              |
```

---

## **Appendix: Code-level Details**

### **A. RSA Blind Signature Verification**

Your backend loads the authority’s RSA public key parameters from configuration:

```java
@Value("${rsa.modulus}")
private String modHex;

@Value("${rsa.publicExp}")
private int pubExp;

@PostConstruct
public void init() {
    modulus = new BigInteger(modHex, 16);
    publicExp = BigInteger.valueOf(pubExp);
}
```

**Verification Logic:**

* Uses standard RSA math:

    * Computes `m = s^e mod n` (where `s` is the signature, `e`/`n` from public key)
    * Compares to expected message hash (the token) for validation.
* Ensures only tokens signed by the authority are accepted.

### **B. Fabric/Fablo Connection Setup**

Fabric connection is created as a Spring bean (`FabricConfig.java`):

```java
@Bean
public Contract contract() throws Exception {
    Gateway gateway = Gateway.createBuilder()
        .identity(wallet, "user")
        .networkConfig(networkConfig.getFile())
        .connect();

    Network network = gateway.getNetwork("mychannel");
    return network.getContract("voting");
}
```

* Loads identity from X.509 certificate and key.
* Reads the connection profile YAML.
* Connects to Fabric gateway and retrieves the `voting` contract.
* Used by `VotingService` for all blockchain interactions.

---

## **Chaincode Logic (on Fabric)**

Node.js chaincode handles:

* **CastVote(evuid, candidateId):**

    * Prevents double-voting by checking if `evuid` already used.
    * Stores mapping: `vote::<evuid>` → `candidateId`
* **HasVoted(evuid):**

    * Returns `true` if that token was already used.

---

