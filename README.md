# Kreeda - AI Badminton Coach

A modern split-screen login page for Kreeda, an AI-powered platform that analyzes badminton videos to deliver data-driven coaching insights.

## Features

- 🎨 **Modern Split-Screen Design**: Premium athletic tech aesthetic
- 🔐 **Emergent Google Auth**: Hassle-free authentication
- ✨ **Animated Text**: Smooth rotating phrases
- 🎥 **Video Background**: Dynamic badminton footage
- 📱 **Responsive**: Works on all devices

## Tech Stack

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: FastAPI
- **Authentication**: Emergent-managed Google OAuth
- **State Management**: React Router v6

## Project Structure

```
/app/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginPage.js      # Split-screen login
│   │   │   ├── AuthCallback.js   # OAuth callback handler
│   │   │   └── Dashboard.js      # Protected dashboard
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env               # Frontend environment variables
└── memory/
    └── test_credentials.md # Testing documentation

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- Yarn

### Installation

1. Install backend dependencies:
```bash
cd /app/backend
pip install -r requirements.txt
```

2. Install frontend dependencies:
```bash
cd /app/frontend
yarn install
```

### Running the Application

The application uses Supervisor to manage both services:

```bash
# Start all services
sudo supervisorctl restart all

# Check status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/frontend.out.log
```

### Manual Start (Development)

**Backend:**
```bash
cd /app/backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Frontend:**
```bash
cd /app/frontend
yarn start
```

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017/kreeda
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## Design System

### Colors

- **Primary Background**: `#2D2926` (Charcoal)
- **Accent**: `#F45831` (Sport Orange)
- **Secondary**: `#1B3B36` (Deep Green)

### Typography

- System fonts optimized for readability
- Bold headings for impact
- Smooth animations for rotating text

### Animations

- **Text Rotation**: 3-second cycles with fade in/out
- **Button Hover**: Subtle lift effect with shadow
- **Loading States**: Spinner animations

## Authentication Flow

1. User clicks "Continue with Google"
2. Redirects to Emergent Auth (Google OAuth)
3. After authentication, returns with `session_id`
4. Frontend sends `session_id` to backend
5. Backend exchanges for user data and sets cookie
6. User redirected to dashboard

## Testing

See `/app/auth_testing.md` for comprehensive testing guide.

### Quick Test

1. Navigate to login page
2. Click "Continue with Google"
3. Complete Google authentication
4. Verify dashboard displays user info
5. Test logout functionality

## API Endpoints

### Health Check
```
GET /api/health
```

### Create Session
```
POST /api/auth/session
Body: { "session_id": "string" }
```

### Get Current User
```
GET /api/auth/me
Headers: Cookie: session_token=...
```

### Logout
```
POST /api/auth/logout
Headers: Cookie: session_token=...
```

## Security Features

- ✅ httpOnly cookies (XSS protection)
- ✅ Secure & SameSite=None flags
- ✅ CORS properly configured
- ✅ Session expiry (7 days)
- ✅ Server-side session validation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Services not starting
```bash
# Check supervisor logs
tail -n 100 /var/log/supervisor/backend.err.log
tail -n 100 /var/log/supervisor/frontend.err.log
```

### Auth not working
- Verify REACT_APP_BACKEND_URL is correct
- Check CORS settings in backend
- Ensure cookies are enabled in browser
- Check browser console for errors

### Port already in use
```bash
# Kill process on port 8001
lsof -ti:8001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## License

Proprietary - Kreeda Platform

## Support

For issues or questions, contact the Kreeda development team.