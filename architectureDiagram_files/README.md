# Node-by-Node Detail

## A [User]

Represents the end user of the system (e.g., a voter, politician, or administrator).

Interacts with the web interface to register, log in, view election details, and cast votes.

## B [Frontend (Tailwind)]

A web-based user interface developed using Tailwind CSS, likely combined with a JavaScript framework (e.g., React, Angular, or Vue).

It manages client-side form validation, user input, and presentation logic, then sends requests to the backend.

## C [API Gateway (Optional)]

An optional single entry point that routes incoming HTTP requests to the correct microservice.

Simplifies client-side communication and provides a unified endpoint for authentication, rate limiting, or other cross-cutting concerns.

If omitted, the frontend can call services directly (sometimes using a load balancer or separate endpoints).

## D [Voter Authentication Service]

Handles user registration and login workflows.

Validates credentials, manages sessions, and issues JSON Web Tokens (JWT) upon successful authentication.

If an MFA (Multi-Factor Authentication) layer is used, it would integrate here.

## E [ID Card Processing Microservice]

Responsible for handling the photo of a user’s identity card.

Performs format validation (file size, image type) and OCR using a tool like Tesseract or Google Cloud Vision API to extract text data (e.g., name, date of birth, ID number).

## F [Selfie Verification Microservice]

Receives a user’s selfie.

Integrates with a facial recognition API (e.g., AWS Rekognition or Azure Face) to compare the selfie with the extracted ID card photo.

A similarity score is returned; if it exceeds a predefined threshold, the user is deemed verified.

## G [Election & Campaign Management Service]

Provides functionalities for creating, managing, and retrieving election data.

Allows politicians to post campaign materials (videos, text, etc.), viewable by voters in a social-media-like feed.

Interacts with the database to store or retrieve candidate/voter details, election timelines, and vote counts.

## H [Token Store / JWT]

The authentication service (D) issues JWTs that the client must include in subsequent requests for resource access.

Tokens are stored client-side (e.g., local storage or HTTP-only cookies).

The system verifies the token’s signature and expiration to ensure valid requests.

## I [Database]

Central repository for user details, elections, voting records, campaign posts, etc.

Segregated into multiple tables or collections to handle different data entities (e.g., voters, elections, votes, campaign content).

Must implement proper encryption, backups, and security policies.

## J [Tesseract or Google Vision API]

The OCR engine used by the ID Card Processing Microservice.

Extracts text from images, enabling automated reading of user identity documents.

## K [AWS Rekognition / Azure Face]

A face comparison API used by the Selfie Verification Microservice.

Provides a numeric confidence level indicating how closely two images match.