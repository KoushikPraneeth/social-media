# Social Media Platform (Reddit Clone)

An end-to-end social media application inspired by Reddit. This project features a robust Java Spring Boot backend together with a modern React frontend built with Vite and TypeScript. It supports user authentication, post creation (with image upload and automatic hashtag extraction), commenting, liking, sharing, real-time notifications via WebSocket, trending hashtags, and more.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Backend Configuration](#backend-configuration)
- [Frontend Configuration](#frontend-configuration)
- [API Endpoints](#api-endpoints)
- [Setup & Installation](#setup--installation)
- [Development Workflow](#development-workflow)
- [License](#license)
- [Contributing](#contributing)

---

## Overview

This project is split into two parts:

1. **Backend** – A Spring Boot application that handles user management, posts, comments, likes, shares, notifications, and trending hashtag calculations. It uses PostgreSQL for data persistence and JWT for secure authentication.
2. **Frontend** – A React application built with Vite and TypeScript. It offers a responsive user interface built with Tailwind CSS and various Radix UI components. The app communicates with the backend via Axios and manages authentication, posts, notifications, and real-time features.

---

## Tech Stack

### Backend
- **Language / Framework:** Java, Spring Boot
- **Build Tool:** Maven (with included Maven wrapper: mvnw & mvnw.cmd)
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA with Hibernate
- **Security:** Spring Security with JWT (expiration: 24 hours), BCrypt password encoding
- **Real-time:** WebSocket using STOMP protocol (configured with SockJS support)
- **Scheduling:** Spring’s @Scheduled for trending hashtag calculations
- **File Upload:** Multipart file support (max size: 10MB)

### Frontend
- **Language / Framework:** React v18.2.0, TypeScript 5.2.2
- **Bundler:** Vite v5.0.8
- **Styling:** TailwindCSS v3.4.17, custom CSS
- **UI Components:** Radix UI primitives (Dialog, Toast, Label, etc.), Lucide React icons
- **Routing:** React Router v6.18.0
- **HTTP Client:** Axios with JWT interceptor
- **State Management:** React Context (Auth, Theme, Toast)

---

## Features

- **User Authentication:**
  - Register and Login using JWT-based authentication.
  - Passwords encrypted via BCrypt.
  - Protected endpoints with stateless session management.
  
- **Post Management:**
  - Create posts with text content and optional image attachments.
  - Automatic extraction of hashtags (e.g., #example) from post text.
  - Like/Unlike functionality with real-time like counts.
  - Commenting system with paginated responses.
  - Sharing posts with share count updates.

- **Trending Hashtags:**
  - Hourly recalculation of trending hashtags based on posts from the past 24 hours.
  - Time-weighted scores that decay linearly (new posts score higher).
  - Top 10 hashtags maintained in real-time.

- **Real-time Notifications:**
  - Notifications for likes, comments, shares, and new followers.
  - WebSocket-based notifications with STOMP endpoints.
  
- **User Profiles & Social Interactions:**
  - View profiles, follow/unfollow users, and update profile information.
  - Activity feeds for user-related actions.

- **Frontend UI/UX:**
  - Responsive and modern user interface.
  - Loading states, error messages, and toast notifications.
  - "Load More" functionality for posts using pagination.
  - Trending tags component for quick navigation.

---

## Project Structure

### Backend (Spring Boot)

```
src/main/java/com/koushik/redditclone/
├── config/          # Application-specific configurations (e.g., WebSocketConfig)
├── controller/      # REST API controllers (AuthController, PostController, etc.)
├── dto/             # Data Transfer Objects (AuthResponse, CreatePostRequest, etc.)
├── model/           # Entity classes (User, Post, Comment, ImageData, Notification)
├── repository/      # JPA repositories (UserRepository, PostRepository, etc.)
├── security/        # Security configuration (SecurityConfig, JwtAuthenticationFilter, etc.)
├── service/         # Business logic (PostService, NotificationService, TrendingService, etc.)
└── resources/       # Application properties and resource files
    └── application.properties
```

### Frontend (React)

```
frontend/
├── public/          # Static files (index.html, assets)
├── src/
│   ├── components/  # UI components divided by feature:
│   │   ├── auth/        # Login, Register components
│   │   ├── layout/      # Layout components (Home, Navbar, TrendingTags, etc.)
│   │   ├── posts/       # Post-related components (PostCard, CreatePost, CommentsList)
│   │   └── shared/      # Reusable components (ProtectedRoute, ErrorBoundary)
│   ├── contexts/    # React contexts (AuthContext, ThemeContext, ToastContext)
│   ├── lib/         # API client configuration and helper functions
│   ├── providers/   # Context providers (theme-provider)
│   └── types/       # TypeScript type definitions
├── package.json     # NPM package definitions and scripts
└── vite.config.js   # Vite configuration
```

---

## Backend Configuration

### application.properties

Key settings include:

```properties
spring.application.name=redditclone

# PostgreSQL Database
spring.datasource.url=jdbc:postgresql://localhost:5432/socialmediadb
spring.datasource.username=socialmediadb
spring.datasource.password=2003
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# File Upload settings
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=15MB
app.upload.directory=/Users/praneethkoushik/repos/social-media/uploads

# JWT Configuration
jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
jwt.expiration=86400000

# Logging
logging.level.com.koushik.redditclone=TRACE
logging.level.org.hibernate.SQL=DEBUG

# Actuator endpoints for monitoring
management.endpoints.web.exposure.include=*
management.endpoint.health.show-details=always
```

### Security

- Configured in `SecurityConfig.java`:
  - Disables CSRF and enables CORS for `http://localhost:3000`.
  - Uses a JWT authentication filter before `UsernamePasswordAuthenticationFilter`.
  - Restricts endpoints except for public routes such as `/auth/**`, `/uploads/**`, and certain GET endpoints.
  - Uses BCryptPasswordEncoder for password security.
  
### WebSocket & Notifications

- WebSocket is enabled via `WebSocketConfig.java`, listening on `/ws` with SockJS fallback.
- `NotificationService` creates notifications on events (like, comment, share, follow) and is designed to work with real-time broadcasting.

### Trending Hashtags

- The `TrendingService` calculates trending hashtags every hour by:
  - Scanning posts from the past 24 hours.
  - Using a time decay algorithm to score hashtags.
  - Keeping the top 10 trending hashtags updated in-memory.

---

## Frontend Configuration

### package.json & Dependencies

- **Core dependencies:**
  - React, React DOM
  - TypeScript
  - Vite (for fast development builds)
  - TailwindCSS (for styling)
- **UI Libraries:**
  - @radix-ui/react-dialog, react-toast, and related primitives
  - Lucide-react for icons
- **Other utilities:**
  - Axios for API communication (with token interceptor)
  - React Router for navigation

### API Integration

- The file at `frontend/src/lib/api.ts` configures a central Axios instance with:
  - Base URL: `http://localhost:8080`
  - An interceptor that injects the JWT token (from localStorage) into every request’s Authorization header.
- Endpoints are organized by feature:
  - Authentication (`auth.login`, `auth.register`)
  - Posts (`posts.getAll`, `posts.create`, etc.)
  - Trends (`trends.getHashtags`)
  - Users (`users.getProfile`, `users.follow`, etc.)
  - Notifications (`notifications.getAll`)

---

## API Endpoints

### Authentication
- **POST** `/auth/login` – Login a user (expects FormData containing username and password).
- **POST** `/auth/register` – Register a new user (expects FormData containing username, email, and password).

### Posts
- **GET** `/api/posts` – Retrieve paginated list of posts.
- **POST** `/api/posts` – Create a new post (supports image upload via multipart/form-data).
- **GET** `/api/posts/user/{username}` – Retrieve a user’s posts.
- **GET** `/api/posts/hashtag/{tag}` – Retrieve posts filtered by hashtag.
- **POST** `/api/posts/{postId}/like` – Like a post.
- **DELETE** `/api/posts/{postId}/like` – Unlike a post.
- **POST** `/api/posts/{postId}/comments` – Add a comment to a post.
- **GET** `/api/posts/{postId}/comments` – Get comments (paginated).
- **POST** `/api/posts/{postId}/share` – Share a post.
- **DELETE** `/api/posts/{postId}` – Delete a post (requires ownership).

### Trending & Notifications
- **GET** `/api/trends` – Retrieve trending hashtags.
- **POST** `/api/users/{username}/follow` – Follow a user.
- **POST** `/api/users/{username}/unfollow` – Unfollow a user.
- **GET** `/api/notifications` – Retrieve notifications (paginated).
- **PUT** `/api/notifications/{notificationId}/read` – Mark a notification as read.
- **PUT** `/api/notifications/read-all` – Mark all notifications as read.

---

## Setup & Installation

### Backend

1. **Prerequisites:**
   - Java 11 or higher installed.
   - Maven (or use the provided Maven wrapper).
   - PostgreSQL running on your machine.

2. **Database Setup:**
   - Create a PostgreSQL database named `socialmediadb` (or update the URL and credentials as needed).
   - Ensure the user credentials in `application.properties` match your PostgreSQL settings.

3. **Build & Run:**
   - From the project root, run:
     ```
     ./mvnw clean install
     ./mvnw spring-boot:run
     ```

4. **File Uploads:**
   - Check the `app.upload.directory` in your properties file and ensure that the directory exists and has the proper permissions.

### Frontend

1. **Prerequisites:**
   - Node.js and npm installed.

2. **Installation:**
   - Navigate to the `frontend` folder:
     ```
     cd frontend
     npm install
     ```

3. **Development Server:**
   - Start the development server:
     ```
     npm run dev
     ```
   - The app will be available at [http://localhost:3000](http://localhost:3000).

4. **Production Build:**
   - Build the production bundle:
     ```
     npm run build
     ```

---

## Development Workflow

- **Backend:**
  - Use Maven commands to run tests (`./mvnw test`), build, and run the Spring Boot application.
  - View detailed logs based on logging levels set in `application.properties`.
  - Monitor via Actuator endpoints (e.g., `/actuator/health`).

- **Frontend:**
  - Work with the React components, contexts, and API utilities.
  - Use Vite's fast refresh and module replacement for a smooth development experience.
  - Integration with backend via Axios configured in `src/lib/api.ts`.
  - Test components using your preferred testing framework (if included).

---

## License

This project is licensed under the MIT License.

---

## Contributing

Contributions are welcome! Please adhere to the following guidelines:
- Fork the repository and create a feature branch.
- Follow code conventions and include tests for new features.
- Open a pull request describing your changes.

---
