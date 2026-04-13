
# Quiz-App
# 🎯 Full-Stack Quiz Application

Full-stack application with React frontend and Node.js/Express backend. No database required - runs with mock data.

## 📂 Project Structure

```
quiz-app/
├── client/           # React frontend
├── server/           # Express backend (no database)
├── package.json      # Root package.json (runs both)
└── .env             # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16+ and npm

### Installation

1. Clone or setup the project and install all dependencies:

```bash
npm run install-all
```

This will install dependencies for:
- Root project
- Client (React)
- Server (Express)`

### Running in Development

Start both frontend and backend simultaneously:

```bash
npm run dev
```

This uses `concurrently` to run:
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:3000

### Alternative: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## 🔧 Backend Setup

### Environment Variables (`server/.env`)

```env
PORT=5000
JWT_SECRET=your_super_secret_key_change_in_production
NODE_ENV=development
```

**Note:** No database required - the app runs with mock data and responses.

### API Routes

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Quiz (Protected)
- `GET /api/quiz/questions` - Get all questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/leaderboard` - Get leaderboard

### Data Storage

**No Database Required:** The application runs entirely with mock data and in-memory operations. User authentication and quiz results are simulated for demonstration purposes.

## 🎨 Frontend Setup

### Environment Variables (Optional)

If you don't set `REACT_APP_API_URL`, it defaults to `http://localhost:5000/api`

```bash
# .env in client folder
REACT_APP_API_URL=http://localhost:5000/api
```

### API Service

The frontend uses a centralized Axios instance (`services/api.js`):
- ✅ Automatically attaches JWT token to all requests
- ✅ Handles 401 errors globally (logs out user)
- ✅ Request timeout: 10 seconds
- ✅ CORS enabled

## 🔐 Authentication Flow

1. **Register** → POST `/api/auth/register` → Get JWT token
2. **Login** → POST `/api/auth/login` → Get JWT token
3. **Store Token** → Save to `localStorage`
4. **Protected Routes** → Frontend redirects to `/` if no token
5. **API Calls** → Token automatically attached via interceptor
6. **Token Expiry** → 401 error → Auto logout

## 📊 Error Handling

### Backend
- ✅ All endpoints return proper status codes
- ✅ Async/await for clean error handling
- ✅ Global error middleware catches exceptions
- ✅ No hanging requests

### Frontend
- ✅ Error messages displayed to user
- ✅ Loading states handled
- ✅ 401 errors trigger logout
- ✅ Network timeouts alerted

## 🏗️ Production Deployment

### Option 1: Docker Deployment

1. **Build Docker Image:**
```bash
docker build -t quiz-app .
```

2. **Run Container:**
```bash
docker run -p 5000:5000 --env-file server/.env.production quiz-app
```

3. **Access Application:**
- Frontend & API: http://localhost:5000

### Option 2: Manual Production Build

1. **Build Production:**
```bash
npm run build
```

This creates an optimized React build in `client/build/`

2. **Start Production Server:**
```bash
npm start
```

This:
- Starts Express server on port 5000
- Serves React build from `client/build/`
- Routes all unmatched requests to `index.html` (SPA)

### Environment Setup for Production

1. **Update `server/.env.production`:**
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_here
```

**Note:** No database setup required - the app runs with mock data.

3. **Deploy to Cloud:**
   - Heroku, Vercel, AWS, DigitalOcean, etc.
   - Ensure environment variables are set
   - For Heroku: `heroku config:set JWT_SECRET=...`

## 📝 File Structure

```
server/
├── controllers/
│   ├── authController.js  # Auth logic (mock)
│   └── quizController.js  # Quiz logic
├── routes/
│   ├── auth.js            # Auth routes
│   └── quiz.js            # Quiz routes
├── middleware/
│   └── auth.js            # JWT verification
├── .env                   # Environment variables
├── server.js              # Main server file
└── package.json

client/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Quiz.jsx
│   │   └── Leaderboard.jsx
│   ├── components/
│   │   ├── PrivateRoute.jsx
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js         # Axios instance
│   └── App.jsx
├── package.json
└── .env (optional)
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
✅ Ensure MongoDB is running locally OR update MONGO_URI to MongoDB Atlas
✅ Check MONGO_URI format: mongodb://localhost:27017/quiz_app
```

### Port 3000 or 5000 Already in Use
```
✅ Change PORT in server/.env
✅ React will prompt for alternate port
```

### CORS Errors
```
✅ Backend has CORS enabled
✅ Frontend API baseURL must include /api
✅ Check REACT_APP_API_URL environment variable
```

### Token Issues / 401 Errors
```
✅ Clear browser localStorage
✅ Re-login to get valid token
✅ Check JWT_SECRET matches between frontend/backend
```

## 🎯 Key Features

- ✅ Production-grade error handling
- ✅ JWT authentication with httpOnly-ready architecture
- ✅ MongoDB with Mongoose schemas
- ✅ React context for global auth state
- ✅ Concurrent development server
- ✅ Clean separation of concerns
- ✅ Async/await throughout
- ✅ No API hangs or missing responses
- ✅ SPA routing support in production

## 📦 Technologies Used

### Frontend
- React 18+
- React Router v7+
- Axios
- React Context API

### Backend
- Node.js
- Express 4+
- MongoDB/Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS

## 📄 License

ISC
