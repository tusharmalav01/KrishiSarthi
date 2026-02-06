# 🚜 AgriRent - Agricultural Equipment Rental Management System

A full-stack MERN application that enables farmers to rent agricultural equipment from local equipment owners.

## ✨ Features

### For Farmers
- 🔍 Browse and search agricultural equipment by category
- 📅 Check equipment availability for specific date ranges
- 💰 Get instant rental cost calculation
- 📝 Place and track rental requests
- 📊 View booking status (Pending, Approved, Active, Completed)

### For Equipment Owners
- ➕ List equipment with images and specifications
- 💵 Set and manage daily rental pricing
- ✅ Approve or reject booking requests
- 🔄 Mark rentals as active/completed
- 📈 Track earnings and booking statistics

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS with custom agricultural theme

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd "Agri Rental"
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Backend `.env` file (already created):
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/agri-rental
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   ```

5. **Seed the database (optional)**
   ```bash
   cd backend
   node seed.js
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Demo Accounts

After seeding the database:

| Role | Email | Password |
|------|-------|----------|
| Farmer | farmer@demo.com | password123 |
| Owner | owner@demo.com | password123 |

## 📂 Project Structure

```
Agri Rental/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── equipmentController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Equipment.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── equipment.js
│   │   └── booking.js
│   ├── .env
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Equipment
- `GET /api/equipment` - List all equipment (with filters)
- `GET /api/equipment/:id` - Get equipment details
- `POST /api/equipment` - Add equipment (owner only)
- `PUT /api/equipment/:id` - Update equipment (owner only)
- `DELETE /api/equipment/:id` - Delete equipment (owner only)

### Bookings
- `POST /api/bookings` - Create booking (farmer only)
- `GET /api/bookings/my-bookings` - Get farmer's bookings
- `GET /api/bookings/owner-bookings` - Get owner's bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `GET /api/bookings/check-availability/:equipmentId` - Check availability

## 📜 License

MIT License
