# Identity Verification Microservice

A Spring Boot–based microservice for verifying user identity via face photo comparison. It provides endpoints to upload/cache a live face photo, retrieve cached photos, and compare a live photo against a stored ID photo using OpenCV’s LBPH algorithm and Redis for caching.

---

## Architecture Diagram

```mermaid
graph LR
  Client[User Agent]
  JwtAuth[JwtAuthenticationFilter]
  SecCtx[SecurityContext]
  FacePhotoCtrl[FacePhotoController]
  FaceCompareCtrl[FaceCompareController]
  FaceExtractSvc[FaceExtractionService]
  FaceCacheSvc[FacePhotoCacheService]
  FaceCompareSvc[FaceComparisonService]
  JwtSvc[JwtService]
  JwtConfig[JwtDecoderConfig]
  RedisCfg[RedisConfig]
  OpenCvCfg[OpenCvConfig]
  SecConfig[SecurityConfig]
  Redis[Redis]
  Cascade[haarcascade_frontalface_alt.xml]

  Client -->|Authorization: Bearer…| JwtAuth
  JwtAuth --> SecCtx

  Client -->|POST /api/face-photo/{userId}| FacePhotoCtrl
  Client -->|GET  /api/face-photo/{userId}| FacePhotoCtrl
  Client -->|GET  /api/face-compare/{userId}| FaceCompareCtrl

  FacePhotoCtrl --> FaceExtractSvc
  FacePhotoCtrl --> FaceCacheSvc
  FaceCompareCtrl --> FaceCompareSvc

  FaceCompareSvc --> FaceExtractSvc
  FaceCompareSvc --> Redis

  FaceCacheSvc --> Redis
  FaceExtractSvc --> Cascade

  JwtAuth --> JwtSvc
  JwtSvc --> JwtConfig

  SecConfig --> JwtAuth
  SecConfig --> JwtConfig
  SecConfig --> JwtSvc
  FacePhotoCtrl --> SecConfig
  FaceCompareCtrl --> SecConfig

  RedisCfg --> Redis
  OpenCvCfg --> FaceExtractSvc
```

---

## Features

- **Face photo upload & caching**: Extracts the largest face region, encodes it to PNG, and stores in Redis.
- **Retrieve cached face**: Serves the cached face PNG from Redis.
- **Face comparison**: Compares a stored ID photo and a live photo using LBPH recognizer with a configurable threshold.
- **JWT-based security**: Stateless OAuth2 Resource Server protecting the face-photo endpoints.
- **Configurable** via `.env` and `application.properties`.

---

## Technical Components

### Environment Loader
- **DotenvLoader**: Loads `APP_JWT_SECRET` from a `.env` file into system properties before Spring Boot startup.

### Configuration
- **JwtDecoderConfig**: Decodes Base64-encoded JWT secret and exposes a `JwtDecoder` bean.
- **RedisConfig**: Configures Lettuce-based `RedisConnectionFactory` and `RedisTemplate<String, byte[]>`.
- **OpenCvConfig**: Loads the Haar cascade XML from classpath into a `CascadeClassifier` bean.
- **SecurityConfig**: Disables CSRF, applies JWT filter to `/api/face-photo/**`, and permits other endpoints (e.g., health checks).

### Security
- **JwtService**: Validates JWT signature and extracts username.
- **JwtAuthenticationFilter**: Extracts and validates the Bearer token, populating the Spring Security context.
- **OAuth2 Resource Server**: Enabled via `SecurityFilterChain` for JWT.

### Core Services
- **FaceExtractionService**
    1. Decodes the uploaded image into an OpenCV `Mat`.
    2. Detects faces with `CascadeClassifier`.
    3. Crops the largest face region and encodes it to a PNG byte array.

- **FacePhotoCacheService**  
  Saves and retrieves face PNG bytes in Redis under key `face:{userId}`.

- **FaceComparisonService**
    1. Retrieves ID and live photo bytes from Redis.
    2. Crops, converts to grayscale, equalizes histograms, and resizes to 200×200.
    3. Trains and predicts with `LBPHFaceRecognizer` using the configured threshold.
    4. Returns a boolean indicating whether it’s a match.

### Controllers
- **FacePhotoController**
    - `POST /api/face-photo/{userId}`: Uploads live photo, extracts face, caches PNG.
    - `GET /api/face-photo/{userId}`: Retrieves cached face PNG.

- **FaceCompareController**
    - `GET /api/face-compare/{userId}?threshold=…`: Compares live vs. stored ID photo with optional threshold.

### Data Store
- **Redis**: In-memory store for face photos (`face:{userId}`) and ID photos (`idPhoto:{userId}`).

### Face Detection Model
- **haarcascade_frontalface_alt.xml**: Intel’s pre-trained Haar cascade frontal-face detector.

---

## API Endpoints

| Method | Path                         | Description                                               | Auth Required |
| ------ | ---------------------------- | --------------------------------------------------------- | ------------- |
| POST   | `/api/face-photo/{userId}`   | Upload live photo, extract face, cache PNG                | Yes           |
| GET    | `/api/face-photo/{userId}`   | Retrieve cached face PNG                                  | Yes           |
| GET    | `/api/face-compare/{userId}` | Compare stored ID vs. live face (`threshold` query param) | Yes           |

---

## Configuration

- **`application.properties`**
  ```properties
  spring.application.name=identityVerificationService
  server.port=8082
  app.jwt.secret=${APP_JWT_SECRET}
  app.jwt.expiration=3600000
  face.compare.threshold=50.0
  ```

- **Environment Variables**
    - `APP_JWT_SECRET`: Base64-encoded HMAC key for JWT validation (loaded via `DotenvLoader`).

---

## Build & Run

1. **Clone the repository**
2. **Create a `.env`** file with `APP_JWT_SECRET`
3. **Run Redis** (default `localhost:6379`)
4. **Build & start**
   ```bash
   ./mvnw clean package
   java -jar target/identityVerificationService-*.jar
   ```  
5. **Access** on `http://localhost:8082`

---

## Dependencies

- Spring Boot
- Spring Security (OAuth2 Resource Server)
- Spring Data Redis (Lettuce)
- Bytedeco OpenCV & JavaCPP
- io.jsonwebtoken (JJWT)
- jakarta.servlet
- io.github.cdimascio:dotenv-java

---

## License

MIT © [Your Company]
```