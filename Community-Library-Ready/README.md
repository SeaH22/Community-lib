Community Library Management System


React + Express + MySQL full-stack project.




 1. Database (MySQL Workbench)

1. Open MySQL Workbench
2. Open the file: `DataBase/setup.sql`
3. Click the  (Execute) button
 4.   "Database setup completed successfully!"


 2. Backend

 terminal in VS Code:
cd backend
npm install


Open the file `backend/.env` and change this line to my real  password in MySQL:


DB_PASSWORD=your_mysql_password


Create the admin user:

npm run create-admin


Start the server:

npm start


What will appear:
- Connected to MySQL database successfully!
- Server is running on port 5000

3. Frontend

Open a second terminal:


cd frontend
npm install
npm run dev


Click the link that appears (usually http://localhost:5173)

4. Login

- Membership ID: ADMIN001
- Password: 901018899
- role: Admin



 Project Structure


Community-Library-Ready/
├── DataBase/
│   └── setup.sql          - This runs in MySQL Workbench
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


 Features included

- Login with JWT authentication
- Dashboard (totals + low stock books)
- Book Management (Add / Edit / Delete)
- Transactions (Borrow / Return / Add Stock)
- User Management (Admin only)
- Protected routes + role-based access

 



