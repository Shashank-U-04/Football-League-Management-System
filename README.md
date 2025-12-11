# ⚽ Football League Management System

A comprehensive Full-Stack Web Application for managing football leagues, tournaments, teams, players, and matches. efficient, and user-friendly.

![ER Diagram](ERD_Final.png)

## 🚀 Features

-   **🏆 Tournament Management**: Create and manage leagues and knockout tournaments.
-   **👥 Team & Player Administration**: Manage team rosters, player details, and transfers.
-   **📅 Match Scheduling**: Schedule matches, setting venues and dates.
-   **⚡ Real-time Scoring**: Record match results and automatically update standings.
-   **📊 Dynamic Leaderboard**: Automated points calculation and ranking system.
-   **💻 Modern UI**: Responsive dashboard built with Next.js and Tailwind CSS.
-   **🔐 Secure Backend**: Robust Node.js/Express API with MySQL database integration.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 16, React 19, Tailwind CSS, Lucide Icons
-   **Backend**: Node.js, Express.js
-   **Database**: MySQL
-   **Tools**: Swagger (API Docs), Mermaid (Diagrams)

## 📋 Prerequisites

Ensure you have the following installed:
-   **Node.js** (v18 or higher)
-   **MySQL Server**

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Football-League-Management-System
```

### 2. Database Configuration
1.  Create a MySQL database (e.g., `FootballLeagueDB`).
2.  Update the `.env` file in the root directory (or create one based on a template) with your credentials:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=FootballLeagueDB
    ```

### 3. Automated Setup (Windows)
Simply run the setup script to install dependencies and initialize the database:
```cmd
setup.bat
```

### 4. Manual Setup
If you prefer manual installation:

**Install Dependencies:**
```bash
npm install                # Root dependencies
cd backend && npm install  # Backend dependencies
cd ../frontend && npm install # Frontend dependencies
```

**Initialize Database:**
```bash
cd backend
node scripts/reset_db.js
```

## ▶️ Running the Application

Start both the frontend and backend servers concurrently:

```bash
npm run dev
```

-   **Frontend**: [http://localhost:3000](http://localhost:3000)
-   **Backend API**: [http://localhost:5001](http://localhost:5001)
-   **Swagger Docs**: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)

## 📂 Project Structure

```
Football-League-Management-System/
├── backend/                # Node.js/Express Server
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── routes/             # API endpoints
│   └── server.js           # Entry point
├── frontend/               # Next.js Web Application
│   ├── app/                # Pages and routing
│   ├── components/         # Reusable UI components
│   └── lib/                # API client & utilities
├── database.sql            # Database Schema
├── ERD_Final.html          # Interactive ER Diagram
└── setup.bat               # Windows Setup Script
```
