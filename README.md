---

# ⚙️ Back-End README (`backend/README.md`)

```markdown
# ⚙️ Blog Platform - Back-End API

This is the robust, secure REST API powering the Full-Stack Blog Platform. It handles data persistence, JWT session tracking, third-party OAuth flows, and transactional emails for user account verification.

## 🚀 Core Features

*   **Hybrid Authentication System:**
    *   Traditional email registration with secure password hashing (`bcrypt`).
    *   **Email Verification:** Dispatches secure verification tokens via SMTP on signup.
    *   **OAuth Integration:** Social login handling using Passport.js or custom OAuth hooks.
*   **Secure API Architecture:** Protected endpoints backed by custom JWT verification middleware.
*   **Blog Controller Engine:** Fully functional RESTful CRUD operations for posts.
*   **CORS Enabled:** Secured resource sharing locked strictly to the client URL.

## 🛠️ Tech Stack

*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (with Mongoose) / PostgreSQL
*   **Authentication:** JSON Web Tokens (JWT), Passport.js
*   **Email Service:** Nodemailer / SendGrid

---

## 💻 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   A running database instance (e.g., MongoDB Atlas or local Postgres instance)

### Installation

1. Navigate to the backend directory:
```bash
   cd backend