import asyncio
import json
import io
import time
import base64
import numpy as np
import torch
import soundfile as sf
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import VitsModel, AutoTokenizer
import httpx

# ------------------- Настройки -------------------
IOnet_API_URL = "https://api.intelligence.io.solutions/api/v1/chat/completions"
IOnet_API_KEY = "io-v2-eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6ImI2ZGNjM2ZlLTIxNzAtNDJhNy1hYzU2LTY3NzM4ODdjNDIwYSIsImV4cCI6NDkyNTQzMTQzMn0.pHam4VqUF4KCcFqdk2V3MjpSQ8ICw0-_GRMRvv-B5GNZOUTsvU4cQ1W_ossl7MojJYkZnLLGwBdxbwf0ZW93Pg"

HUGGINGFACE_MODEL = "facebook/mms-tts-kaz"

# ------------------- Загружаем MMS-TTS модель -------------------
print("Загрузка MMS-TTS модели...")
tts_model = VitsModel.from_pretrained(HUGGINGFACE_MODEL)
tts_tokenizer = AutoTokenizer.from_pretrained(HUGGINGFACE_MODEL)
tts_model.eval()
SAMPLING_RATE = tts_model.config.sampling_rate

# ------------------- FastAPI -------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # локально можно "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- TTS функция -------------------
def tts_generate(text: str, speed: float = 1.0, pitch: float = 1.0) -> str:
    with torch.no_grad():
        inputs = tts_tokenizer(text, return_tensors="pt")
        output = tts_model(**inputs).waveform

    audio_data = output.cpu().numpy().squeeze()
    audio_data = np.interp(
        np.arange(0, len(audio_data), 1/speed),
        np.arange(0, len(audio_data)),
        audio_data
    )
    audio_data = np.clip(audio_data * pitch, -1, 1)
    pcm16 = np.int16(audio_data * 32767)
    buf = io.BytesIO()
    sf.write(buf, pcm16, samplerate=SAMPLING_RATE, format="wav", subtype="PCM_16")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

# ------------------- HTTP POST endpoint -------------------
@app.post("/chat")
async def chat_endpoint(request: Request):
    data = await request.json()
    user_text = data.get("text", "").strip()
    if not user_text:
        return {"text": "[Ошибка] Пустой запрос", "audio": None}

    start_time = time.time()

    # ------------------- Отправляем текст на IO.net -------------------
    system_prompt = "Сен қазақ тілі мұғалімі және виртуалды ассистентсің. Жауап беріп, сұрақтар қойыңыз."

    body = {
        "model": "meta-llama/Llama-3.3-70B-Instruct",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_text}
        ],
        "temperature": 0.4,
        "max_tokens": 600,
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {IOnet_API_KEY}"
    }

    try:
        async with httpx.AsyncClient(timeout=None) as client:
            resp = await client.post(IOnet_API_URL, headers=headers, json=body)
            resp_json = resp.json()
            answer = resp_json.get("choices", [{}])[0].get("message", {}).get("content") \
                     or resp_json.get("choices", [{}])[0].get("text") \
                     or "[Ошибка API]"

        # ------------------- Генерируем аудио -------------------
        audio_base64 = tts_generate(answer)
        elapsed = round(time.time() - start_time, 2)

        return {"text": answer, "audio": audio_base64, "time": elapsed}

    except Exception as e:
        return {"text": f"[Ошибка IO.net API]: {str(e)}", "audio": None, "time": None}