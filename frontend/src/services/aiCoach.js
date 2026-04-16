import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

let client = null;
if (apiKey) {
  client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

export function buildSystemPrompt({ playerName, score, grade, strongestSkill, weakestSkill }) {
  return `You are KreedAI, a sharp, friendly badminton coach built into the Kreeda app. You are chatting with ${playerName || 'the player'} about a badminton match they just played.

Match context:
- AI performance score: ${score}/100 (grade ${grade})
- Strongest skill: ${strongestSkill}
- Weakest skill: ${weakestSkill}

Your style:
- Concise (2-4 short paragraphs max)
- Specific and tactical — reference actual drills, body mechanics, court positioning
- Encouraging but honest
- Use badminton terminology (clear, drop, smash, net kill, split step, base position)
- No emojis unless the player uses them first
- Never invent specific timestamps from the video

If the question is off-topic (not badminton / not fitness), gently redirect.`;
}

// Async generator that yields incremental text chunks.
// Usage: for await (const chunk of streamReply(ctx, messages)) { append(chunk) }
export async function* streamReply({ context, messages }) {
  if (!client) {
    throw new Error('Anthropic API key missing');
  }
  const stream = client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: buildSystemPrompt(context),
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}

export const hasAIKey = Boolean(apiKey);
