# Football League Management System (FLMS)

## 1. Introduction
The **Football League Management System (FLMS)** is a comprehensive web-based application designed to digitize and automate the management of football tournaments. This project demonstrates the integration of a relational database with a modern full-stack web architecture, featuring automated leaderboards and strict data integrity.

---

## 2. Key Features

- **Team & Player Management:** Add, update, and delete teams and their squad members.
- **Match Scheduling:** Organize fixtures between teams with date and venue.
- **Automated Standings:** The leaderboard updates automatically as match scores are entered.
- **Statistical Analysis:** View performance metrics like Total Goals and Win Rates.
- **Data Validation:** Backend and Database level checks prevent invalid data entry.

---

## 3. System Architecture & Technology Stack

The project follows a **3-Tier Architecture**:

### 3.1 Frontend
- **Framework:** [Next.js](https://nextjs.org/) (React Framework)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)

### 3.2 Backend
- **Runtime:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **API Pattern:** RESTful API

### 3.3 Database
- **RDBMS:** MySQL
- **Driver:** `mysql2`

---

## 4. Database Design

### 4.1 ER Diagram
![ER Diagram](ER%20Diagram.png)

### 4.2 DBMS Concepts Implemented
- **Normalization:** Schema designed up to **3NF**.
- **Constraints:** Primary Keys, Foreign Keys, and CHECK constraints.
- **Triggers:** Automated match count updates and score validation.
- **Stored Procedures:** Transaction-safe match result recording.
- **Views:** Dynamic `Leaderboard` generation.
- **Functions:** Custom logic for calculating win percentages.

---

## 5. Directory Structure

```plaintext
Football-League-Management-System/
├── backend/                # Server-side logic
│   ├── routes/             # API Endpoints
│   ├── server.js           # Entry point
│   └── ...
├── frontend/               # Client-side application
│   ├── app/                # Next.js pages & routing
│   ├── components/         # Reusable UI components
│   └── ...
├── FLMS.sql                # Database Setup Script
├── ER Diagram.png          # Visual Schema Representation
└── README.md               # Project Documentation
```

---

## 6. Installation & Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **MySQL Server** (v8.0 or higher)

### Step 1: Database Configuration
1. Open your MySQL Client (Workbench or Command Line).
2. Run the `FLMS.sql` script provided in the root directory.
   ```sql
   SOURCE_PATH/TO/FLMS.sql;
   ```

### Step 2: Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Configure `.env` file with your DB credentials.
4. Start the server: `npm start`

### Step 3: Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Contribution

Contributions are welcome!
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes.
4. Push to the branch and Open a Pull Request.

---

## 8. Support & Contact

- **Email:** [shashank.u.shashu1359@gmail.com](mailto:shashank.u.shashu1359@gmail.com)
- **LinkedIn:** [Shashank U](https://www.linkedin.com/in/shashank-u-016b54330/)
- **GitHub:** [Shashank-U-04](https://github.com/Shashank-U-04)

---

<br>
<div align="center">
  <p>Made with ❤️ by <b>Shashank U</b></p>
  <p>⭐ If you find this project helpful, please give it a star!</p>
</div>
