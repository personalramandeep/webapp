// Use backend API for AI Coach instead of direct Anthropic calls
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export function buildSystemPrompt({ playerName, score, grade, skills, analysis }) {
  // Not used anymore since system prompt is built in backend
  return null;
}

// Async generator that yields incremental text chunks via backend SSE
export async function* streamReply({ context, messages }) {
  try {
    const response = await fetch(`${API_URL}/api/ai-coach/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI Coach API error: ${error}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          if (data.startsWith('[ERROR]')) {
            throw new Error(data.slice(8));
          }
          yield data;
        }
      }
    }
  } catch (error) {
    console.error('Stream error:', error);
    throw error;
  }
}

export const hasAIKey = true; // Backend always has the key
