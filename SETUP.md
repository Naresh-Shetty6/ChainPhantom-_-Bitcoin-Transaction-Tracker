# ChainPhantom Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- BlockCypher API token (get from https://www.blockcypher.com/dev/)

### 1. Install Dependencies
```bash
# Install all dependencies at once
npm run install:all

# Or install individually
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Configuration

#### Backend Environment
Create `backend/.env` file:
```env
BLOCKCYPHER_TOKEN=your_blockcypher_api_token_here
NODE_ENV=development
PORT=5000
```

#### Frontend Environment
The frontend `.env` already exists with:
```env
REACT_APP_BLOCKCHAIN_API_KEY=your_blockchain_info_api_key_here
REACT_APP_API_BASE_URL=http://localhost:5000
```

### 3. Running the Application

#### Development Mode (Both servers)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

#### Individual Services
```bash
# Backend only
npm run start:backend

# Frontend only
npm run start:frontend
```

### 4. Testing
```bash
# Run all tests
npm test

# Backend tests only
cd backend && npm test

# Frontend tests only
cd frontend && npm test
```

### 5. Code Quality
```bash
# Lint code
npx eslint .

# Format code
npx prettier --write .
```

## 🔧 API Endpoints

- **Health Check**: `GET /health`
- **Search**: `GET /api/search/:query`
- **Analyze**: `POST /api/analyze`
- **Trace**: `POST /api/trace`
- **Detect Suspicious**: `POST /api/detect-suspicious`

## 📱 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🛠️ Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Nodemon**: Auto-restart for backend development
- **Concurrently**: Run multiple npm scripts

## 🔒 Security Features

- Environment variable protection
- Rate limiting (100 requests/minute per IP)
- Error handling middleware
- Request logging
- Gitignore protection for sensitive files

## 📊 Monitoring

The backend includes:
- Request logging with timestamps
- Error logging with stack traces
- Health check endpoint
- Uptime tracking
- Environment status reporting
