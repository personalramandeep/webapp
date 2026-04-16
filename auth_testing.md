# Auth-Gated App Testing Playbook

## Emergent Google Auth Testing Guide

This playbook covers testing for apps using Emergent-managed Google authentication.

## Step 1: Understanding the Auth Flow

### Authentication Process
1. User clicks "Continue with Google" on login page
2. Redirects to `https://auth.emergentagent.com/`
3. User completes Google OAuth
4. Returns to app with `session_id` in URL fragment: `{redirect_url}#session_id={session_id}`
5. Frontend extracts `session_id` and sends to backend
6. Backend exchanges `session_id` for user data via Emergent Auth API
7. Backend sets httpOnly cookie with `session_token`
8. User redirected to dashboard

### Key Components to Test
- Login button redirects correctly
- AuthCallback processes `session_id`
- Backend successfully exchanges `session_id` for user data
- Session cookie is set properly
- Dashboard displays user information
- Protected routes require authentication
- Logout clears session

## Step 2: Manual Browser Testing

### Prerequisites
- Valid Google account for testing
- Application running and accessible

### Test Cases

#### Test 1: Initial Login
```
1. Navigate to login page
2. Click "Continue with Google"
3. Complete Google authentication
4. Expected: Redirect to /dashboard with user info displayed
5. Verify: User name, email, and profile picture shown
```

#### Test 2: Session Persistence
```
1. After successful login, refresh the page
2. Expected: User remains logged in
3. Expected: Dashboard loads without redirect to login
```

#### Test 3: Direct Dashboard Access (Authenticated)
```
1. While logged in, navigate directly to /dashboard
2. Expected: Dashboard loads with user info
3. Expected: No redirect to login page
```

#### Test 4: Direct Dashboard Access (Not Authenticated)
```
1. Clear cookies or use incognito window
2. Navigate directly to /dashboard
3. Expected: Redirect to login page (after auth check fails)
```

#### Test 5: Logout Flow
```
1. While logged in, click "Logout" button
2. Expected: Redirect to login page
3. Verify: Session cookie cleared
4. Try accessing /dashboard
5. Expected: Redirect to login (no longer authenticated)
```

## Step 3: Backend API Testing

Since sessions are stored in-memory, we need to test through the actual auth flow.

### Test Auth Endpoint After Login
```bash
# After completing Google login, extract session_token from browser cookies
# Then test the /api/auth/me endpoint

curl -X GET "http://localhost:8001/api/auth/me" \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN_HERE"

# Expected response:
# {
#   "id": "google_user_id",
#   "email": "user@example.com",
#   "name": "User Name",
#   "picture": "https://profile-picture-url"
# }
```

### Test Logout Endpoint
```bash
curl -X POST "http://localhost:8001/api/auth/logout" \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN_HERE"

# Expected response:
# {"message": "Logged out successfully"}
```

## Step 4: Playwright Testing

For automated testing with Playwright:

```python
# Navigate to login page
await page.goto("https://your-app-url.com")

# Click Google login button
await page.click('[data-testid="google-auth-button"]')

# Note: Google OAuth cannot be fully automated in tests
# You'll need to manually complete the OAuth flow once
# Then extract and save the session_token for subsequent tests

# For testing with existing session:
await page.context.add_cookies([{
    "name": "session_token",
    "value": "YOUR_TEST_SESSION_TOKEN",
    "domain": "your-app-url.com",
    "path": "/",
    "httpOnly": True,
    "secure": True,
    "sameSite": "None"
}])

# Then navigate to dashboard
await page.goto("https://your-app-url.com/dashboard")

# Verify user is logged in
await page.wait_for_selector('[data-testid="user-name"]')
```

## Step 5: Common Issues & Debugging

### Issue: Infinite redirect loop
**Cause:** AuthCallback not processing session_id correctly
**Fix:** Check that session_id is being extracted from URL fragment (not query params)

### Issue: "Not authenticated" error on dashboard
**Cause:** Session cookie not being set or sent
**Fix:** 
- Verify `credentials: 'include'` in fetch calls
- Check CORS settings allow credentials
- Verify cookie is httpOnly with correct domain/path

### Issue: Auth callback fails
**Cause:** Backend cannot reach Emergent Auth API
**Fix:**
- Check network connectivity
- Verify Emergent Auth API endpoint is correct
- Check backend logs for detailed error messages

### Issue: Session expires immediately
**Cause:** Timezone issues with expiry calculation
**Fix:** Ensure all datetime operations use `datetime.now(timezone.utc)`

## Success Indicators

✅ Login redirects to Google OAuth
✅ After OAuth, user redirects back to app
✅ Dashboard loads with user information
✅ Session persists across page refreshes
✅ Logout clears session and redirects to login
✅ Protected routes require authentication

## Failure Indicators

❌ Login button does nothing or errors
❌ After OAuth, stuck in redirect loop
❌ Dashboard shows "Not authenticated"
❌ Session doesn't persist on refresh
❌ Logout doesn't clear session
❌ Can access protected routes without login

## Notes

- **No Database Required:** This implementation uses in-memory session storage
- **Session Duration:** 7 days
- **Security:** Sessions use httpOnly cookies for XSS protection
- **No Passwords:** Google OAuth handles all authentication
- **Test Accounts:** Use any valid Google account for testing