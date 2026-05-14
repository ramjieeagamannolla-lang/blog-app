# Blog App

A full-stack Blog Application built with **Node.js**, **Express.js**, and **React.js**.  
The platform supports multiple roles including **Admin**, **Author**, and **User** with authentication and role-based access control.

---

## Features

### Authentication
- User Registration & Login
- JWT Authentication
- Protected Routes
- Role-Based Authorization

### Admin
- Manage all users
- Manage all blogs/posts
- Delete inappropriate content
- View platform statistics

### Author
- Create blog posts
- Edit own posts
- Delete own posts
- Upload images
- Manage drafts/published posts

### User
- Read blogs
- Like and comment on posts
- Search blogs
- Update profile

---

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS / CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js

---

## Project Structure
blog-app/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
