# ⚙️ Blog Platform — Back-End API

This is the robust, secure, and scalable RESTful API powering the Full-Stack Blog Platform. Built to handle complex user life-cycles and content distribution, this back-end manages secure data persistence, session tracking, social authentication, and transactional email infrastructure.

---

## 🚀 Core Features

### 🔐 Hybrid Authentication System
* **Traditional Email Registration:** Secure signup flows backed by `bcrypt` password hashing.
* **Email Verification:** Automated SMTP engine that dispatches secure, expiring verification tokens upon user registration.
* **OAuth Integration:** Social login hooks integrated seamlessly via Passport.js for friction-free onboarding.

### 🛡️ Enterprise-Grade Security
* **JWT Verification Middleware:** Custom middleware guarding protected resource endpoints.
* **CORS-Locked Policies:** Cross-Origin Resource Sharing tightly bound exclusively to the authenticated client URL.
* **Input Validation:** Strict sanitization of incoming payloads to eliminate malicious injections.

### 📝 Blog Controller Engine
* High-performance, fully functional **RESTful CRUD operations** optimizing data flow for posts, updates, and author metrics.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime Environment** | `Node.js` | High-concurrency JavaScript backend execution. |
| **Framework** | `Express.js` | Minimalist, fast routing engine for API endpoints. |
| **Database ORM/ODM** | `Mongoose` / `Sequelize` | Structured schema design for MongoDB or PostgreSQL. |
| **Authentication** | `JWT` & `Passport.js` | Stateless session tracking and third-party OAuth handling. |
| **Mailing Service** | `Nodemailer` / `SendGrid` | High-delivery transactional email dispatching. |

---

## 💻 Getting Started

### 📋 Prerequisites

Before setting up the API, ensure you have the following installed on your local machine:
* **Node.js** (v18.0.0 or higher)
* **Database Instance** (A live connection URI for MongoDB Atlas or a local PostgreSQL instance)


#### 1. Navigate to the Directory
```bash
cd backend
