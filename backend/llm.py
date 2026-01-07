import google.generativeai as genai
from config import Config
import json
import re

# Validate API key exists
Config.validate()
genai.configure(api_key=Config.GEMINI_API_KEY)

def call_llm(review_text, rating):
    """
    Generate AI response, summary, and recommended action using Gemini 2.0 Flash Exp (Free).
    Returns JSON string with response, summary, and action fields.
    """
    
    prompt = f"""
You are a customer service AI for Fynd, an e-commerce platform.

User Rating: {rating}/5
User Review: "{review_text}"

Generate a JSON response with exactly these fields:
1. "response": A personalized, empathetic response to the customer (2-3 sentences)
2. "summary": A brief summary of the review in 1 sentence
3. "action": Recommended action for the admin team (e.g., "Follow up within 24 hours", "No action needed", "Escalate to manager")

Respond ONLY with valid JSON in this exact format:
{{
  "response": "<your response>",
  "summary": "<summary>",
  "action": "<recommended action>"
}}
"""
    
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
    except Exception as e:
        print(f"AI service error: {e}")
        fallback = {
            "response": "Thank you for your feedback. We appreciate you taking the time to share your experience with us.",
            "summary": f"Customer rated {rating} stars: {review_text[:100]}",
            "action": "Review customer feedback" if rating <= 3 else "No immediate action required"
        }
        return json.dumps(fallback)
    
    # Extract and validate JSON from response
    text = response.text.strip()
    
    # Remove markdown code blocks if present
    if "```" in text:
        match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
        if match:
            text = match.group(1)
        else:
            text = re.sub(r'```(?:json)?', '', text).strip()
    
    try:
        # Parse and validate JSON
        parsed = json.loads(text)
        
        # Ensure all required fields exist
        required_fields = ["response", "summary", "action"]
        for field in required_fields:
            if field not in parsed:
                parsed[field] = "N/A"
        
        return json.dumps(parsed)
    except:
        fallback = {
            "response": "Thank you for your feedback. We value your input.",
            "summary": f"Customer rated {rating} stars",
            "action": "Review feedback"
        }
        return json.dumps(fallback)
