Absolutely! Here's a cleaner, more polished version of your `README.md` with improved structure, formatting, and properly embedded image support.

---

```markdown
# 📄 Document Service

A Spring Boot microservice for uploading, storing, indexing, and retrieving PDF documents. It securely integrates with an external authentication service via JWT, shares a PostgreSQL database, and extracts text using PDFBox or Tesseract OCR.

---

## 📚 Table of Contents

- [Features](#features)  
- [Architecture](#architecture)  
- [Prerequisites](#prerequisites)  
- [Getting Started](#getting-started)  
  - [Clone the Repository](#clone-the-repository)  
  - [Configure Environment Variables](#configure-environment-variables)  
  - [Build & Run](#build--run)  
- [Configuration](#configuration)  
- [API Reference](#api-reference)  
  - [Upload Document](#upload-document)  
  - [List Documents](#list-documents)  
  - [Download Document](#download-document)  
- [Security](#security)  
- [Data Model](#data-model)  
- [Dependencies](#dependencies)  
- [Contributing](#contributing)  
- [License](#license)  

---

## 🚀 Features

- **PDF Upload**: Accepts PDF files only (`application/pdf`).
- **Text Extraction**:  
  - **Primary**: Apache PDFBox  
  - **Fallback**: Tesseract OCR via Tess4J
- **Storage**:  
  - PDF stored as `bytea` in PostgreSQL  
  - Extracted text stored in a `TEXT` column  
  - Metadata includes filename, content type, timestamp, and uploader username
- **Secure Access**: JWT-based authentication via shared secret (no roundtrips to Auth service)
- **Multi-Tenant**: Users can only access their own uploaded documents

---

## 🏗 Architecture

<img src="./documentServiceArch.png" alt="Document Service Architecture" width="100%" style="max-width:800px; display:block; margin:auto;" />

1. **Auth Service** issues JWTs, stores users in the shared `auth_db`.
2. **Document Service** validates tokens using shared secret—no HTTP calls.
3. **DotenvLoader** loads environment variables from `.env` before Spring starts.
4. **PDF Processing Pipeline**:
  - Tries PDFBox
  - Falls back to Tesseract OCR if necessary (make sure `TESSDATA_PREFIX` is set)

---

## ⚙ Prerequisites

- Java 17+  
- Maven 3.6+ (or use included wrapper)  
- PostgreSQL 12+ (running on `localhost:5432`, DB: `auth_db`)  
- Tesseract OCR installed and configured  
- `.env` file in project root:

```dotenv
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_pass
APP_JWT_SECRET=<Base64-encoded-HMAC-SHA-key>
TESSDATA_PREFIX=/path/to/tessdata_parent
```

---

## 🧪 Getting Started

### 🔽 Clone the Repository

```bash
git clone https://github.com/your-org/document-service.git
cd document-service
```

### 🛠 Configure Environment Variables

Create a `.env` file in the root directory as described above.

### 🚀 Build & Run

**Using Maven Wrapper**

```bash
./mvnw clean package
java -jar target/documentservice-0.1.0.jar
```

**Or Directly**

```bash
mvn clean install
mvn spring-boot:run
```

The app will start on **port 8081**.

---

## ⚙ Configuration

All settings are in `src/main/resources/application.properties`:

```properties
spring.application.name=documentservice
server.port=8081

spring.datasource.url=jdbc:postgresql://localhost:5432/auth_db
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

app.jwt.secret=${APP_JWT_SECRET}
app.jwt.expiration=3600000
```

The `DotenvLoader` loads `.env` variables before Spring starts.

---

## 📡 API Reference

All endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

### 📤 Upload Document

- **POST** `/api/documents`
- Accepts: `multipart/form-data`
- Field: `file` (PDF)
- Response: JSON with metadata and extracted `textContent`

```bash
curl -X POST http://localhost:8081/api/documents \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F file=@/path/to/file.pdf
```

---

### 📄 List Documents

- **GET** `/api/documents`
- Response: Array of your uploaded documents

```bash
curl http://localhost:8081/api/documents \
  -H "Authorization: Bearer $JWT_TOKEN"
```

---

### 📥 Download Document

- **GET** `/api/documents/{id}`
- Response: PDF with `Content-Disposition: attachment`

```bash
curl http://localhost:8081/api/documents/123 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  --output downloaded.pdf
```

---

## 🔐 Security

- **JWT Only**: No sessions/cookies
- **Spring Security Filter Chain**:

```java
http
  .csrf().disable()
  .sessionManagement().sessionCreationPolicy(STATELESS)
  .authorizeHttpRequests()
    .requestMatchers("/api/documents/**").authenticated()
    .anyRequest().permitAll()
  .and()
  .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
```

- Token validation and user extraction in `JwtService`

---

## 🧬 Data Model

```java
@Entity
@Table(name = "documents")
public class Document {
  @Id @GeneratedValue
  private Long id;
  private String filename;
  private String contentType;

  @Column(columnDefinition = "bytea")
  private byte[] data;

  @Lob
  @Column(columnDefinition = "text")
  private String textContent;

  private LocalDateTime uploadedAt;
  private String uploadedBy; // JWT subject
}
```

---

## 📦 Dependencies

- Spring Boot Web / Data JPA / Security
- PostgreSQL Driver
- Apache PDFBox
- Tess4J (Tesseract OCR)
- Lombok
- Dotenv for Java (`io.github.cdimascio:dotenv-java`)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow code style and add unit tests where applicable.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
```

---

✅ **Your PNG** (`documentServiceArch.png`) is correctly referenced with a relative path that will work on GitHub or Markdown viewers that support embedded local images.

Would you like me to generate a visual version (e.g., styled HTML or PDF) of this README?