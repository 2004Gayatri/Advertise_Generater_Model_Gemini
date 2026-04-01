# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import requests
# import os
# import json
# from dotenv import load_dotenv

# load_dotenv()

# app = Flask(__name__)
# CORS(app)

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# @app.route('/')
# def home():
#     return "Backend is running!"

# @app.route('/generate-ad', methods=['POST'])
# def generate_ad():
#     try:
#         data = request.json
#         product = data.get("product")
#         audience = data.get("audience")

#         prompt = f"""
# You are an expert marketing assistant.

# Create a COMPLETE marketing campaign.

# Return ONLY JSON in this format:
# {{
#   "headline": "<catchy title>",
#   "ad_copy": "<creative ad>",
#   "cta": "<call to action>",
#   "platform": "<best platform like Instagram, YouTube>",
#   "best_time": "<best time to post>",
#   "audience_insight": "<describe target audience>",
#   "performance": "<expected performance>"
# }}

# Product: {product}
# Audience: {audience}

# Make it realistic and professional.
# """

#         url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

#         headers = {
#             "Content-Type": "application/json",
#             "x-goog-api-key": GEMINI_API_KEY
#         }

#         payload = {
#             "contents": [
#                 {
#                     "parts": [
#                         {"text": prompt}
#                     ]
#                 }
#             ]
#         }

#         response = requests.post(url, headers=headers, json=payload)
#         result = response.json()

#         ai_text = result['candidates'][0]['content']['parts'][0]['text']

#         # Clean markdown
#         clean_text = ai_text.replace("```json", "").replace("```", "").strip()

#         try:
#             ad_json = json.loads(clean_text)
#         except:
#             ad_json = {
#                 "product": product,
#                 "audience": audience,
#                 "ad_copy": clean_text
#             }

#         return jsonify(ad_json)

#     except Exception as e:
#         return jsonify({"error": str(e)})

# if __name__ == '__main__':
#     app.run(debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Enable CORS so your React frontend (localhost:3000) can connect
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# 2026 Model IDs
# Stable model for text strategy
TEXT_MODEL = "gemini-1.5-flash" 
# New model for ad images (Nano Banana 2)
IMAGE_MODEL = "gemini-3.1-flash-image-preview"

@app.route('/generate-ad', methods=['POST'])
def generate_ad():
    try:
        data = request.json
        product = data.get("product")
        audience = data.get("audience")

        # 1. GENERATE THE TEXT AND VISUAL PROMPT (Stable 1.5 Model)
        text_url = f"https://generativelanguage.googleapis.com/v1beta/models/{TEXT_MODEL}:generateContent?key={GEMINI_API_KEY}"
        
        # We need the AI to not just write the ad, but *also* write a description for the image
        prompt = f"""
        Expert marketing assistant. Create a JSON campaign for {product} targeting {audience}.
        Return ONLY a JSON object with these exact keys:
        {{
            "headline": "catchy title",
            "ad_copy": "full creative ad text",
            "visual_prompt": "detailed 4k description of an advertisement image for {product}"
        }}
        """
        
        text_response = requests.post(text_url, json={"contents": [{"parts": [{"text": prompt}]}]})
        
        if text_response.status_code != 200:
            print(f"⚠️ Text API Error: {text_response.text}")
            return jsonify({"error": "Failed to generate campaign text"}), text_response.status_code

        raw_ai_text = text_response.json()['candidates'][0]['content']['parts'][0]['text']
        # Extract JSON (AI often includes "```json")
        clean_json_str = raw_ai_text.split('{', 1)[-1].rsplit('}', 1)[0]
        ad_data = json.loads('{' + clean_json_str + '}')

        # 2. GENERATE THE IMAGE (Nano Banana 2) - Isolated
        # We use the 'visual_prompt' written by the AI in Step 1
        visual_prompt = ad_data.get("visual_prompt", f"A professional studio advertisement for {product}")
        
        img_url = f"[https://generativelanguage.googleapis.com/v1beta/models/](https://generativelanguage.googleapis.com/v1beta/models/){IMAGE_MODEL}:generateContent?key={GEMINI_API_KEY}"
        
        # Required configuration for multimodal output in 2026
        img_payload = {
            "contents": [{"parts": [{"text": visual_prompt}]}],
            "generationConfig": {
                "responseModalities": ["IMAGE"]
            }
        }
        
        # 30-second timeout is safe for image generation
        img_response = requests.post(img_url, json=img_payload, timeout=30)
        
        # We add "Fall-Safe" logic here
        if img_response.status_code == 200:
            # Successfully got the Base64 image data
            ad_data["image_data"] = img_response.json()['candidates'][0]['content']['parts'][0]['inlineData']['data']
        else:
            # Google is down or overloaded, but we don't crash the server.
            # ad_data["image_data"] will simply be null.
            print(f"⚠️ Image API Error: {img_response.text}")
            ad_data["image_data"] = None

        return jsonify(ad_data)

    except Exception as e:
        print(f"❌ Critical Backend Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Flask will now run on localhost:5000
    app.run(debug=True, port=5000)