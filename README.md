# AI Interview Assistant

AI Interview Assistant is a professional-grade full-stack web application that streamlines the technical interview process. It leverages Artificial Intelligence to generate custom questions, grade responses in real-time, and provide comprehensive candidate assessments.

---

## 🚀 Features

### Core Functionality
* **AI-Powered Interview Questions**: Generates dynamic technical questions tailored to specific candidate resumes and job roles.
* **Real-time Answer Grading**: Provides instantaneous feedback and scoring for candidate responses using LLMs.
* **Resume Parsing**: Automatically extracts and analyzes data from PDF and DOCX resume formats.
* **Candidate Management**: A centralized dashboard to view, manage, and track all interview sessions and performance metrics.

### Performance & Security
* **Session Management**: Powered by **Redis** for high-speed session storage and concurrent session control.
* **Enterprise Security**: Includes CSRF protection, rate limiting, Helmet security headers, and input sanitization.
* **Authentication**: Secure JWT-based authentication with refresh token logic.
* **Data Privacy**: GDPR-compliant features including the ability to delete candidate personal data.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Ant Design, Redux Toolkit, Vite, Storybook |
| **Backend** | Node.js, Express.js, JWT, Helmet, Winston (Logging) |
| **Database** | MongoDB (Mongoose ODM), Redis (Caching/Sessions) |
| **AI/ML** | OpenAI API (GPT Models), PDF/DOCX Parsing |
| **DevOps** | Docker, Docker Compose, GitHub Actions (CI/CD) |

---

## 📦 Project Structure

```text
ai-interview/
├── backend/              # Node.js API server
│   ├── controllers/      # Request handlers
│   ├── models/           # Mongoose schemas
│   ├── services/         # OpenAI integration & business logic
│   └── middleware/       # Auth, RBAC, and Security
├── src/                  # React Frontend (TypeScript)
│   ├── features/         # Modular feature logic
│   ├── components/       # Reusable UI components
│   └── services/         # API client integration
├── .github/              # CI/CD Workflows
├── Dockerfile            # Containerization config
└── docker-compose.yml    # Multi-container orchestration
