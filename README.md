This is a full stack travel blog application I made as part of my Computer Science coursework.
The app allows users to log in, create travel logs and create journey plans.

Technologies used:
- React
- JavaScript
- HTML
- CSS
- Node.js
- Express
- MySQL
- JWT
- bcrypt

Features:
- User login
- Password hashing
- JWT authentication
- Create, view, edit and delete travel logs
- Create and manage journey plans
- Data is stored separately for each user
- React frontend connected to a Node and Express backend
- MySQL database

How to run:
- Install Node.js
- Install MySQL
- Run the schema.sql file inside the database folder
- Create a MySQL user with access to the travel_blog database
- Copy backend/.env.example and rename it to .env
- Add your own database details and JWT secret to the .env file

Backend:
- Open the backend folder
- Run npm install
- Run node server.js
- The backend runs on http://localhost:5000

Frontend:
- Open the frontend folder
- Run npm install
- Run npm start
- The frontend runs on http://localhost:3000

This app was originally made using a university hosted mySQL database but its since been changed so it can run using a local MySQL database.<img width="960" height="540" alt="Screenshot 2026-09-19 025857" src="https://github.com/user-attachments/assets/261fea7b-a6b6-4357-b652-c1b646948b72" />
<img width="960" height="540" alt="Screenshot 2026-09-19 025908" src="https://github.com/user-attachments/assets/ab6499c8-0297-4f46-b905-643295418b08" />
