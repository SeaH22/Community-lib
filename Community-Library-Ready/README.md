# Community Library Management System
**BIWA2110 – Web Application Development**

React + Express + MySQL full-stack project.

---

## How to run (simple steps)

### 1. Database (MySQL Workbench)

1. Open MySQL Workbench
2. Open the file: `DataBase/setup.sql`
3. Click the **lightning bolt** (Execute) button
4. You should see: "Database setup completed successfully!"

This creates the database, all 3 tables, and adds 5 sample books.

### 2. Backend

Open a terminal in VS Code:

```bash
cd backend
npm install
```

Open the file `backend/.env` and change this line to your real MySQL password:

```
DB_PASSWORD=your_mysql_password
```

Create the admin user:

```bash
npm run create-admin
```

Start the server:

```bash
npm start
```

You should see:
- Connected to MySQL database successfully!
- Server is running on port 5000

### 3. Frontend

Open a **second** terminal:

```bash
cd frontend
npm install
npm run dev
```

Click the link that appears (usually http://localhost:5173)

### 4. Login

- Membership ID: **ADMIN001**
- Password: **901018899**

---

## Project Structure

```
Community-Library-Ready/
├── DataBase/
│   └── setup.sql          ← Run this once in MySQL Workbench
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   ├── middleware/
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── styles/
    └── package.json
```

## Features included

- Login with JWT authentication
- Dashboard (totals + low stock books)
- Book Management (Add / Edit / Delete)
- Transactions (Borrow / Return / Add Stock)
- User Management (Admin only)
- Protected routes + role-based access

## Default Admin

| Field           | Value        |
|-----------------|--------------|
| Membership ID   | ADMIN001     |
| Password        | 901018899    |
| Role            | Admin        |

---

Ready for submission (frontend/ + backend/ folders).
