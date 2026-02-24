from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from googletrans import Translator
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

translator = Translator()

class TranslationRequest(BaseModel):
    text: str
    target_lang: str

@app.post("/translate")
async def translate_text(request: TranslationRequest):
    try:
        # Googletrans uses 'hi' for Hindi, 'kn' for Kannada, etc.
        # We can map standard codes if necessary, but ISO codes usually work.
        translated = translator.translate(request.text, dest=request.target_lang)
        return {"original": request.text, "translated": translated.text, "src": translated.src, "dest": request.target_lang}
    except Exception as e:
        print(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Translation Backend"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
