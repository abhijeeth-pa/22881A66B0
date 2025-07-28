# URL Shortener Full Stack Application - Setup Guide

This guide will help you set up and run the complete URL Shortener application with logging middleware, backend microservice, and React frontend.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Project Structure

```
├── logging-middleware/     # Reusable logging package
├── backend/               # URL Shortener microservice
├── frontend/             # React web application
├── install.sh            # Linux/Mac installation script
├── install.bat           # Windows installation script
└── README.md             # Project documentation
```

## Quick Installation

### Option 1: Automated Installation (Recommended)

**For Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

**For Windows:**
```cmd
install.bat
```

### Option 2: Manual Installation

1. **Install Logging Middleware:**
   ```bash
   cd logging-middleware
   npm install
   npm run build
   cd ..
   ```

2. **Install Backend:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install Frontend:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## Configuration

### Backend Configuration

1. Copy the environment template:
   ```bash
   cp backend/env.example backend/.env
   ```

2. Update `backend/.env` with your credentials:
   ```env
   PORT=5000
   LOG_API_URL=http://20.244.56.144/evaluation-service
   CLIENT_ID=your_client_id_here
   CLIENT_SECRET=your_client_secret_here
   EMAIL=your_email@university.edu
   NAME=Your Name
   ROLL_NO=your_roll_number
   ACCESS_CODE=your_access_code
   ```

### Frontend Configuration

The frontend is configured to proxy requests to the backend automatically. No additional configuration is needed.

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Start Frontend Application

In a new terminal:

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Backend API

- `POST /shorturls` - Create shortened URL
- `GET /shorturls/:shortcode` - Get URL statistics
- `GET /:shortcode` - Redirect to original URL
- `GET /health` - Health check
- `GET /urls` - Get all URLs (demo)

### Example API Usage

**Create Short URL:**
```bash
curl -X POST http://localhost:5000/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/very-long-url",
    "validity": 60,
    "shortcode": "mycode123"
  }'
```

**Get URL Statistics:**
```bash
curl http://localhost:5000/shorturls/mycode123
```

## Features

### Backend Features
- ✅ URL shortening with custom shortcodes
- ✅ Configurable validity periods (default: 30 minutes)
- ✅ Click tracking and analytics
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Automatic cleanup of expired URLs
- ✅ Health check endpoint

### Frontend Features
- ✅ Create up to 5 URLs simultaneously
- ✅ Real-time form validation
- ✅ Copy-to-clipboard functionality
- ✅ Responsive design (mobile & desktop)
- ✅ Material-UI components
- ✅ URL statistics dashboard
- ✅ Detailed click analytics

### Logging Features
- ✅ Integration with evaluation service
- ✅ Comprehensive logging throughout the application
- ✅ Error tracking and debugging
- ✅ Performance monitoring

## Development

### Backend Development

```bash
cd backend
npm run dev  # Start with hot reload
npm run build  # Build for production
```

### Frontend Development

```bash
cd frontend
npm start  # Start development server
npm run build  # Build for production
```

### Logging Middleware Development

```bash
cd logging-middleware
npm run dev  # Watch mode for development
npm run build  # Build the package
```

## Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## Production Deployment

### Backend Deployment

1. Build the application:
   ```bash
   cd backend
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Build the application:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the `build` folder using a web server like nginx or Apache.

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Change the port in `backend/.env` or `frontend/package.json`

2. **CORS errors:**
   - Ensure the backend is running on the correct port
   - Check that the frontend proxy is configured correctly

3. **Logging service errors:**
   - Verify your credentials in `backend/.env`
   - Check network connectivity to the evaluation service

4. **Build errors:**
   - Clear `node_modules` and reinstall dependencies
   - Ensure you're using Node.js v16 or higher

### Getting Help

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that both backend and frontend are running

## License

This project is created for evaluation purposes. 