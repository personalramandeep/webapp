import os
import asyncio
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

router = APIRouter(prefix="/api/ai-coach", tags=["ai-coach"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    context: Dict[str, Any]
    messages: List[ChatMessage]

def build_system_prompt(context: Dict[str, Any]) -> str:
    """Build the AI Coach system prompt with video analysis context"""
    skills = context.get('skills', {})
    
    # Determine weakest skill
    weakest_skill = min(skills.items(), key=lambda x: x[1])[0] if skills else 'defense'
    
    def format_skill_name(name: str) -> str:
        return ''.join([' ' + c if c.isupper() else c for c in name]).strip().title()
    
    player_name = context.get('playerName', 'Player')
    score = context.get('score', 72)
    grade = context.get('grade', 'B')
    analysis = context.get('analysis', {})
    
    skill_scores = '\n'.join([f"- {format_skill_name(k)}: {v}/100" for k, v in skills.items()])
    
    return f"""You are KreedAI Coach — a concise, encouraging badminton performance analyst.
Answer questions about THIS specific video analysis session using only the context below.

## RESPONSE RULES
- Answer in at most 3 sentences. Do not pad.
- Tone: encouraging but tight — brief framing is fine, no "Great question!" or "Sure!" filler.
- Use bullet points only when listing 3+ items.
- Every stat you cite must appear verbatim in the context. Never invent numbers.
- If the user asks about a metric not in the context, say so in one sentence and move on.
- Do not dump the full score breakdown back at the user — reference only what's relevant to their question.

## WEAKEST SKILL (deterministic)
From "Skill Scores" below, the weakest skill is {format_skill_name(weakest_skill)}.

## RECOMMENDED VIDEOS CTA
After your 3-sentence answer, you MAY append ONE additional CTA line — and ONLY if ALL of these are true:
  1. The user's question is about improvement, drills, technique, or the weakest skill itself.
  2. You have not already given this CTA earlier in the conversation.

Format the CTA line exactly like:
  "Head to Recommended Videos — it'll surface {format_skill_name(weakest_skill)} drills tailored to your weaknesses."

If the user then asks for more variety, more drills, or says Recommended Videos wasn't enough, follow up with:
  "You can also explore the Training page for the full drill library."

Do NOT mention the Training page otherwise. Do NOT mention Recommended Videos on purely tactical/analytical questions (e.g. "what was my distance?", "how many smashes did I hit?") — skip the CTA entirely.

The CTA line does NOT count against the 3-sentence cap.

## Video Analysis Context
**Player:** {player_name}
**Video:** Singles Match - Court 2
**AI Score:** {score}/100 (Grade {grade})
**Calories Burned (est. per set):** {analysis.get('calories', 630)} kcal
**vs. Your Average:** {analysis.get('vsAverage', '-6')} points

### Skill Scores
{skill_scores}

### AI Summary
A solid performance with good shot variety. Focus on increasing offensive aggression to further improve.

### Raw Metrics
Steps: {analysis.get('steps', 18)} | Distance: {analysis.get('distance', '8.51m')} | Duration: {analysis.get('duration', '0 min')}
Smash count: {analysis.get('smashCount', 2)} | Defence count: {analysis.get('defenseCount', 4)} | Serve count: {analysis.get('serveCount', 0)} | Total shot count: {analysis.get('totalShots', 6)}"""

@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """Stream AI Coach responses"""
    api_key = os.getenv('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="AI Coach API key not configured")
    
    try:
        # Build system prompt
        system_message = build_system_prompt(request.context)
        
        # Initialize chat
        chat = LlmChat(
            api_key=api_key,
            session_id=f"coach-{request.context.get('playerName', 'player')}",
            system_message=system_message
        ).with_model("anthropic", "claude-4-sonnet-20250514")
        
        # Prepare messages (skip system messages from frontend)
        chat_messages = [msg for msg in request.messages if msg.role == 'user']
        
        if not chat_messages:
            raise HTTPException(status_code=400, detail="No user messages provided")
        
        # Get the last user message
        last_message = chat_messages[-1]
        user_msg = UserMessage(text=last_message.content)
        
        # Stream response
        async def generate():
            try:
                response = await chat.send_message(user_msg)
                # Stream the response in chunks
                for char in response:
                    yield f"data: {char}\n\n"
                    await asyncio.sleep(0.01)  # Small delay for smooth streaming
                yield "data: [DONE]\n\n"
            except Exception as e:
                yield f"data: [ERROR] {str(e)}\n\n"
        
        return StreamingResponse(generate(), media_type="text/event-stream")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Coach error: {str(e)}")
