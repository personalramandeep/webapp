# Kreeda Authentication Testing

## Test Credentials

Since Kreeda uses Emergent-managed Google Auth, testing requires valid Google accounts.

### Google Auth Test Accounts

Test the authentication flow using any valid Google account. After successful authentication:

**Expected User Data Structure:**
```json
{
  "id": "google_user_id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://profile-picture-url"
}
```

### Testing Instructions

1. **Login Flow:**
   - Click "Continue with Google" button
   - Authorize with Google account
   - Should redirect to `/dashboard` with user info displayed

2. **Session Persistence:**
   - Refresh the dashboard page
   - User should remain logged in
   - Session valid for 7 days

3. **Logout Flow:**
   - Click "Logout" button
   - Should redirect to login page
   - Session cookie should be cleared

### Manual Testing with Browser

1. Open application in browser
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. Verify dashboard displays user information
5. Test logout functionality

### Notes

- No password-based credentials (Google OAuth handles authentication)
- Sessions stored in-memory on backend (no database)
- Session tokens are httpOnly cookies for security
- Each session expires after 7 days