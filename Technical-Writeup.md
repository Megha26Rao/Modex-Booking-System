# 🎬 Movie Ticket System: Concurrency-Safe Booking (Modex Assessment)

## Project Overview
This project implements a scalable, full-stack Movie Ticket Booking System designed to meet the Modex assessment requirements. The core focus is the implementation of a robust **concurrency control mechanism** to ensure **zero overbooking** in high-traffic scenarios, leveraging PostgreSQL’s transactional features.

The application includes a clean, responsive UI and a dedicated Admin interface for content management.

## 🌟 Key Features Implemented

* **Concurrency Control:** Guaranteed prevention of overbooking using Pessimistic Locking (`SELECT FOR UPDATE`) within database transactions.
* **Full-Stack Functionality:** Admin can schedule shows, and users can browse, search, and book tickets instantly.
* **User Experience (UX):** Includes a radiant, cinematic UI theme, client-side search filtering, and a separate Booking Status view for users.
* **Multi-Seat Booking:** Users can specify the number of seats they wish to book in a single transaction.
* **State Management:** Utilizes React Context API for global state (Shows) and Mock Authentication (User Profile).

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose / Notes |
| :--- | :--- | :--- |
| **Frontend** | React.js, TypeScript | Clean, modular UI components; enforces type safety and uses hooks for lifecycle management. |
| **State Management** | React Context API | Manages global `Auth` state and `Show` data, minimizing prop drilling. |
| **Backend API** | Node.js (Express.js) | High-performance, non-blocking API server for handling business logic and concurrency. |
| **Database** | PostgreSQL | Selected for its superior support for complex transactions, integrity constraints, and built-in locking primitives (`SELECT FOR UPDATE`). |
| **Deployment** | Railway (BE/DB), Vercel/Netlify (FE) | Utilized modern CI/CD tools for mandatory live deployment. |

---

## 💻 Setup and Local Installation

### Prerequisites
1.  Node.js (LTS version)
2.  PostgreSQL Database (version 12+)
3.  Postman (for API testing)

### 1. Backend Setup (`/backend`)
1.  **Clone Repository:** Navigate to the `/backend` folder.
2.  **Install Dependencies:** `npm install`
3.  **Database Configuration:**
    * Create a database (e.g., `modex_booking`).
    * Create a `.env` file based on your credentials:
        ```ini
        PORT=3000
        DB_HOST=127.0.0.1
        DB_USER=postgres
        DB_PASSWORD=your_password
        DB_DATABASE=modex_booking
        ```
    * Run the necessary SQL schema creation (if not already done): `ALTER TABLE shows ADD COLUMN theatre_name VARCHAR(255);` (plus the base `CREATE TABLE` commands).
4.  **Run Server:** `node app.js` (The server should report successful DB connection and start on port 3000).

### 2. Frontend Setup (`/frontend`)
1.  **Navigate:** Navigate to the `/frontend` folder.
2.  **Install Dependencies:** `npm install`
3.  **Configure API URL:** Ensure `API_BASE_URL` in `src/context/ShowContext.tsx` is set to your local backend:
    ```typescript
    const API_BASE_URL = 'http://localhost:3000/api'; 
    ```
4.  **Run Application:** `npm start` (The app will launch on a new port, e.g., 3001).

---

## ⚙️ API Documentation

The following endpoints are functional (documentation provided as Postman Collection or Swagger link).

| Method | Endpoint | Description | Body Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/shows` | Creates a new movie show/screening. | `name, startTime, totalSeats, theatreName` |
| `GET` | `/api/shows` | Retrieves all available shows for the user dashboard. | None |
| **`POST`** | **`/api/book`** | **Critical:** Reserves seats using a database transaction and locking mechanism. | `showId, userName, userPhone, seatCount` |
| `GET` | `/api/bookings/:userId` | Retrieves a user's booking history (used for status view). | None (requires encoded user name in URL) |
| `GET` | `/api/admin/bookings` | Retrieves all booking records (Admin view). | None |
