from fastapi import FastAPI, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from routes.ai_coach import router as ai_coach_router

load_dotenv()

app = FastAPI()

# CORS configuration
# NOTE: When using credentials (cookies), we must specify exact origins, not wildcard "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://28e121b3-f352-47bd-b927-cf08c206ad4e.preview.emergentagent.com",
        "http://localhost:3000",  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include AI Coach router
app.include_router(ai_coach_router)

# In-memory session storage (since no database required)
sessions = {}

class SessionRequest(BaseModel):
    session_id: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    picture: str

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.post("/api/auth/session")
async def create_session(session_req: SessionRequest, response: Response):
    """
    Exchange session_id for user data and session_token.
    Called by frontend after Google OAuth redirect.
    """
    try:
        # Call Emergent Auth API to get session data
        async with httpx.AsyncClient() as client:
            auth_response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_req.session_id},
                timeout=10.0
            )
            
            if auth_response.status_code != 200:
                raise HTTPException(
                    status_code=auth_response.status_code,
                    detail="Failed to authenticate with Emergent Auth"
                )
            
            session_data = auth_response.json()
            session_token = session_data.get("session_token")
            
            if not session_token:
                raise HTTPException(status_code=400, detail="No session token received")
            
            # Store session in memory with 7-day expiry
            expiry = datetime.now(timezone.utc) + timedelta(days=7)
            sessions[session_token] = {
                "user": {
                    "id": session_data.get("id"),
                    "email": session_data.get("email"),
                    "name": session_data.get("name"),
                    "picture": session_data.get("picture")
                },
                "expires_at": expiry
            }
            
            # Set httpOnly cookie
            response.set_cookie(
                key="session_token",
                value=session_token,
                httponly=True,
                secure=True,
                samesite="none",
                max_age=7 * 24 * 60 * 60,  # 7 days
                path="/"
            )
            
            return session_data
            
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.get("/api/auth/me")
async def get_current_user(request: Request):
    """
    Get current authenticated user from session token.
    Checks cookie first, then Authorization header as fallback.
    """
    # Try to get session_token from cookie
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Check if session exists and is valid
    session = sessions.get(session_token)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check if session is expired
    expires_at = session["expires_at"]
    if expires_at < datetime.now(timezone.utc):
        del sessions[session_token]
        raise HTTPException(status_code=401, detail="Session expired")
    
    return session["user"]

@app.post("/api/auth/logout")
async def logout(request: Request, response: Response):
    """
    Logout user by clearing session.
    """
    session_token = request.cookies.get("session_token")
    
    if session_token and session_token in sessions:
        del sessions[session_token]
    
    # Clear cookie
    response.delete_cookie(
        key="session_token",
        path="/",
        secure=True,
        samesite="none"
    )
    
    return {"message": "Logged out successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)