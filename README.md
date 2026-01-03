# ⚽ Football League Management System

A robust Full-Stack Web Application for managing football leagues, tournaments, teams, players, and matches.

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Features

-   **Tournament Management**: Create/manage leagues and knockout cups.
-   **Team & Player Admin**: Roster management, player details, and transfers.
-   **Match Scheduling**: Set venues, dates, and track match status.
-   **Real-time Scoring**: Record results with auto-updating standings.
-   **Dynamic Leaderboard**: Automated ranking system based on points/goals.

## 📂 Project Structure

```
Football-League-Management-System/
├── backend/            # Express Server & API
├── frontend/           # Next.js Dashboard App
├── FLMS.sql            # Database Schema & Data
└── README.md           # Documentation
```

## ⚙️ Quick Start

**1. Database Setup**
Import `FLMS.sql` into your local MySQL server.
Update `backend/.env` (or root `.env`) with your DB credentials.

**2. Install Dependencies**
```bash
npm install                # Root
cd backend && npm install  # Backend
cd ../frontend && npm install # Frontend
```

**3. Run Application**
```bash
npm run dev
```
-   **Frontend**: [http://localhost:3000](http://localhost:3000)
-   **Backend**: [http://localhost:5001](http://localhost:5001)

> **Admin Login**: `admin` / `admin123`
