import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
 
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
 
export async function POST(req: NextRequest) {
  try {
    const { task, data } = await req.json();
 
    let prompt = "";
 
    if (task === "voiceover-script") {
      prompt = `You are a professional voiceover scriptwriter. 
The user has provided this text: "${data.text}"
Language: ${data.language}
Emotion/Tone: ${data.emotion}
Voice: ${data.voiceName}
 
Rewrite this text as a polished, natural-sounding voiceover script optimized for ${data.emotion} tone in ${data.language}. 
Keep it concise and natural. Return only the script text, nothing else.`;
    } else if (task === "generate-caption") {
      prompt = `You are a viral social media caption writer.
Content: "${data.content}"
Platform: ${data.platform || "general"}
Style: ${data.style || "engaging"}
 
Write a viral, engaging caption for this content. Include relevant emojis and hashtags. Return only the caption, nothing else.`;
    } else if (task === "generate-title") {
      prompt = `You are a YouTube title optimization expert.
Video topic: "${data.topic}"
Target audience: ${data.audience || "general"}
 
Write 3 viral YouTube titles for this video. Return only the titles, one per line, nothing else.`;
    } else if (task === "generate-description") {
      prompt = `You are a YouTube SEO expert.
Video title: "${data.title}"
Video topic: "${data.topic}"
 
Write an SEO-optimized YouTube description with timestamps placeholder, keywords, and call to action. Return only the description, nothing else.`;
    } else {
      prompt = data.prompt || "Hello!";
    }
 
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
 
    const result = message.content[0].type === "text" ? message.content[0].text : "";
 
    return NextResponse.json({ result });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json({ error: "Claude API error" }, { status: 500 });
  }
}