# 🏬 Store Rating System

A comprehensive web application that allows users to submit ratings for stores registered on the platform.  
The system features **role-based access control** with different functionalities for **System Administrators**, **Normal Users**, and **Store Owners**.

---

## 🌟 Features

### 🔐 Authentication System
- Single Login System for all user roles  
- JWT-based authentication with automatic token refresh  
- Role-based routing and access control  
- Secure password validation (uppercase + special character required)  
- User registration for normal users  

### 👨‍💼 System Administrator Features
#### 📊 Dashboard
- Total number of users  
- Total number of stores  
- Total number of submitted ratings  

#### 👥 User Management
- View, search, and filter all users  
- Add new normal users and administrators  
- View detailed user information  
- Sort by name, email, address, and role  

#### 🏪 Store Management
- View all registered stores  
- Add new stores with owner assignment  
- View store details with ratings  
- Advanced search and filtering  

#### 🔍 Advanced Features
- Sortable tables (ascending/descending)  
- Pagination support  
- Real-time search functionality  

### 👤 Normal User Features
- 📝 User Registration with form validation  
- 🏬 Store Browsing (view, search, sort stores)  
- ⭐ Rating System (submit, update, comment, view history)  
- 🔒 Account Management (update password, view profile)  

### 🏪 Store Owner Features
- 📈 Store Dashboard (average rating, reviews count, performance)  
- 👥 Customer Reviews (detailed review history, paginated listing)  
- 🔐 Account Management (secure password update)  

---

## 🛠 Technology Stack

**Backend**
- Node.js with Express.js  
- MongoDB + Mongoose  
- JWT for authentication  
- bcryptjs for password hashing  
- Joi for input validation  
- CORS + Helmet for security  

**Frontend**
- React.js (functional components)  
- React Router  
- Axios  
- Context API for state management  
- CSS3 (modern styling + animations)  

---

## 📋 Prerequisites
Make sure you have installed:
- Node.js (v14+)  
- npm or yarn  
- MongoDB (v4.4+)  
- Git  

---

## 🚀 Installation & Setup

### 1. Clone Repository

git clone <repository-url>
cd store-rating-system

## 🚀 Installation & Setup

### 2. Backend Setup

cd backend
npm install

# ⚙️ Environment Configuration

The application requires environment variables for both the **backend** and **frontend**.  
Follow the setup below:

---

## 📂 Backend (.env)
Create a `.env` file inside the **backend** directory:

MONGODB_URI=mongodb://localhost:27017/store-rating

JWT_SECRET=your-super-secret-jwt-key-here

PORT=5000

NODE_ENV=development

FRONTEND_URL=http://localhost:3000

## 📂 Frontend (.env)
Create a `.env` file inside the **frontend** directory:

REACT_APP_API_URL=http://localhost:5000/api


---

## 🔍 Form Validations
- **Name:** 20–60 chars (required)  
- **Email:** Valid format (required)  
- **Address:** Max 400 chars (required)  
- **Password:** 8–16 chars, 1 uppercase, 1 special char  
- **Rating:** Integer 1–5 (required)  
- **Comment:** Max 500 chars (optional)  

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` – Register user  
- `POST /api/auth/login` – Login  
- `GET /api/auth/profile` – Get profile  
- `POST /api/auth/logout` – Logout  

### User Management
- `PUT /api/users/password` – Update password  

### Store Management
- `GET /api/stores` – List stores  
- `GET /api/stores/:id` – Store details  

### Rating Management
- `POST /api/ratings` – Submit/update rating  
- `GET /api/ratings/store-ratings` – Store ratings (owner view)  

### Admin
- `GET /api/admin/dashboard` – Statistics  
- `POST /api/admin/users` – Create user/admin  
- `POST /api/admin/stores` – Create store with owner  
- `GET /api/admin/users` – Get all users  
- `GET /api/admin/stores` – Get all stores  
- `GET /api/admin/users/:id` – User details  
- `GET /api/admin/stores/:id` – Store details  

---

## 🎨 Key Features

### ✅ User Interface
- Responsive design (desktop, tablet, mobile)  
- Modern CSS (gradients, shadows, animations)  
- Interactive elements (hover effects, loading states)  
- Consistent typography  
- Color-coded roles  

### ✅ User Experience
- Intuitive navigation  
- Real-time validation & feedback  
- Loading states during API calls  
- Search & sorting  
- Pagination  

### ✅ Security
- JWT Authentication  
- Password hashing (bcrypt)  
- Input validation (frontend + backend)  
- CORS protection  
- Rate limiting  

### ✅ Performance
- Database indexing  
- Pagination  
- Optimized React rendering  
- Error boundaries
