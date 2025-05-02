# Identity Verification Microservice

A Spring Boot–based microservice for verifying user identity via face photo comparison. It provides endpoints to upload/cache a live face photo, retrieve cached photos, and compare a live photo against a stored ID photo using OpenCV’s LBPH algorithm and Redis for caching.

---

## Architecture Diagram

---

```mermaid
graph LR
  subgraph Client
    A[User Agent]
  end

  subgraph API
    B[JwtAuthenticationFilter]
    C[SecurityContext]
    D[FacePhotoController]
    E[FaceCompareController]
  end

  subgraph Services
    F[FaceExtractionService]
    G[FacePhotoCacheService]
    H[FaceComparisonService]
    I[JwtService]
  end

  subgraph Config
    J[JwtDecoderConfig]
    K[RedisConfig]
    L[OpenCvConfig]
    M[SecurityConfig]
  end

  subgraph DataStore
    N[Redis]
  end

  subgraph FaceModel
    O[haarcascade_frontalface_alt.xml]
  end

  A -->|Authorization: Bearer…| B
  B --> C
  A -->|POST /api/face-photo/{userId}| D
  A -->|GET  /api/face-photo/{userId}| D
  A -->|GET  /api/face-compare/{userId}| E

  D --> F
  D --> G
  E --> H
  H --> F
  H --> N

  G --> N
  F --> O

  B --> I
  I --> J
  M --> B
  M --> J
  M --> I
  D & E --> M
  J --> I
  K --> N
  L --> F
````
---

## Features

* **Face photo upload & caching**: Extracts the largest face region, encodes it to PNG, and stores in Redis .
* **Retrieve cached face**: Serves cached face PNG from Redis .
* **Face comparison**: Compares a stored ID photo and live photo using LBPH recognizer with configurable threshold .
* **JWT-based security**: Stateless OAuth2 resource server protecting face-photo endpoints .
* **Configurable via `.env` and `application.properties`** .

---

## Technical Components

### Environment Loader

* **DotenvLoader**: Loads `APP_JWT_SECRET` from a `.env` file into system properties before Spring Boot startup .

### Configuration

* **JwtDecoderConfig**: Decodes Base64-encoded JWT secret and exposes a `JwtDecoder` bean .
* **RedisConfig**: Configures Lettuce-based `RedisConnectionFactory` and `RedisTemplate<String, byte[]>` for key–byte\[] operations .
* **OpenCvConfig**: Loads Haar cascade XML from classpath into a `CascadeClassifier` bean .
* **SecurityConfig**: Disables CSRF, applies JWT filter to `/api/face-photo/**`, and permits other endpoints (e.g. health checks) .

### Security

* **JwtService**: Validates JWT signature, extracts username from token .
* **JwtAuthenticationFilter**: Extracts and validates Bearer token, populates Spring Security context .
* **OAuth2 Resource Server**: Enabled via `SecurityFilterChain` for JWT support.

### Core Services

* **FaceExtractionService**:

    1. Decodes uploaded image into `Mat`
    2. Detects faces with `CascadeClassifier`
    3. Crops the largest face and encodes to PNG byte\[] .
* **FacePhotoCacheService**: Saves/retrieves face PNG in Redis under key `face:{userId}` .
* **FaceComparisonService**:

    1. Retrieves ID & live bytes from Redis
    2. Crops, grayscales, equalizes histograms, resizes to 200×200
    3. Trains and predicts with LBPHFaceRecognizer using threshold
    4. Returns match boolean .

### Controllers

* **FacePhotoController**

    * `POST /api/face-photo/{userId}`: Upload & cache live face
    * `GET  /api/face-photo/{userId}`: Retrieve cached face PNG .
* **FaceCompareController**

    * `GET /api/face-compare/{userId}?threshold=…`: Compare live vs. ID with optional threshold .

### Data Store

* **Redis**: In-memory store for face photos (`face:{userId}`) and ID photos (`idPhoto:{userId}`).

### Face Detection Model

* **haarcascade\_frontalface\_alt.xml**: Intel’s pre-trained Haar cascade frontal face detector .

---

## API Endpoints

| Method | Path                         | Description                                               | Auth Required |
| ------ | ---------------------------- | --------------------------------------------------------- | ------------- |
| POST   | `/api/face-photo/{userId}`   | Upload live photo, extract face, cache PNG                | Yes           |
| GET    | `/api/face-photo/{userId}`   | Retrieve cached face PNG                                  | Yes           |
| GET    | `/api/face-compare/{userId}` | Compare stored ID vs. live face (`threshold` query param) | Yes           |

---

## Configuration

* **`application.properties`**

  ```properties
  spring.application.name=identityVerificationService
  server.port=8082
  app.jwt.secret=${APP_JWT_SECRET}
  app.jwt.expiration=3600000
  face.compare.threshold=50.0
  ```

* **Environment Variables**

    * `APP_JWT_SECRET`: Base64-encoded HMAC key for JWT validation (loaded via `DotenvLoader`) .

---

## Build & Run

1. **Clone repository**
2. **Create `.env`** with `APP_JWT_SECRET`
3. **Run Redis** (default `localhost:6379`)
4. **Build & start**

   ```bash
   ./mvnw clean package
   java -jar target/identityVerificationService-*.jar
   ```
5. **Access** on `http://localhost:8082`

---

## Dependencies

* Spring Boot
* Spring Security (OAuth2 Resource Server)
* Spring Data Redis (Lettuce)
* Bytedeco OpenCV & JavaCPP
* io.jsonwebtoken (JJWT)
* jakarta.servlet
* io.github.cdimascio\:dotenv-java

---

## License

MIT © \[Your Company]

```
```
