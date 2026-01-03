# ⚽ Football League Management System

A comprehensive Full-Stack Web Application for managing football leagues, tournaments, teams, players, and matches. Efficient, and user-friendly.

![ER Diagram](ER%20Diagram.png)

## 🚀 Features

-   **🏆 Tournament Management**: Create and manage leagues and knockout tournaments.
-   **👥 Team & Player Administration**: Manage team rosters, player details, and transfers.
-   **📅 Match Scheduling**: Schedule matches on specific dates and venues.
-   **⚡ Real-time Scoring**: Record match results and automatically update standings.
-   **📊 Dynamic Leaderboard**: Automated points calculation and ranking system.
-   **💻 Modern UI**: Responsive dashboard built with Next.js and Tailwind CSS.
-   **🔐 Secure Backend**: Robust Node.js/Express API with MySQL database integration.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15, React 19, Tailwind CSS, Lucide Icons
-   **Backend**: Node.js, Express.js
-   **Database**: MySQL (Local)
-   **Tools**: Swagger (API Docs), Mermaid (Diagrams)

## 📋 Prerequisites

Ensure you have the following installed:
-   **Node.js** (v18 or higher)
-   **MySQL Server** (Running on localhost)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Football-League-Management-System
```

### 2. Database Configuration
1.  Open **MySQL Workbench** or your preferred SQL client.
2.  Import and run the `FLMS.sql` file located in the root directory.
    -   *This will create the database, tables, and insert sample data.*
3.  Update the `.env` file in the root directory with your credentials:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=FootballLeagueDB
    ```

### 3. Install Dependencies
```bash
npm install                # Root dependencies
cd backend && npm install  # Backend dependencies
cd ../frontend && npm install # Frontend dependencies
```

## ▶️ Running the Application

Start both the frontend and backend servers concurrently:

```bash
npm run dev
```

-   **Frontend**: [http://localhost:3000](http://localhost:3000)
-   **Backend API**: [http://localhost:5001](http://localhost:5001)
-   **Swagger Docs**: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)

> **Default Admin Credentials:**
> - **Username**: `admin`
> - **Password**: `admin123`

## 📂 Project Structure

```
Football-League-Management-System/
├── backend/                # Node.js/Express Server
│   ├── config/             # Database configuration
│   ├── routes/             # API endpoints
│   └── server.js           # Entry point
├── frontend/               # Next.js Web Application
│   ├── app/                # Pages and routing
│   └── components/         # Reusable UI components
├── FLMS.sql                # Complete Database Schema & Data
├── ER Diagram.png          # Entity-Relationship Diagram
└── setup.bat               # Windows Setup Script
```
