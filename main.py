from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import io
import numpy as np
from PIL import Image
import tensorflow as tf
import tf_keras as tk

app = FastAPI()

# CORS 설정 (전 세계 모든 곳에서 접속 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 서버가 켜질 때 모델을 딱 한 번 로드 (깃허브에 올릴 model 폴더 경로)
model = tk.models.load_model("./model")

def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum()

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert('RGB')
    img = img.resize((180, 180))
    
    # 0~255 순정 스케일 전처리
    raw_array = np.array(img, dtype=np.float32)
    input_data = np.expand_dims(raw_array, axis=0)
    
    logits = model.predict(input_data)[0]
    true_probabilities = softmax(logits) * 100
    top_2 = np.argsort(true_probabilities)[-2:][::-1]
    
    return {
        "first_class": int(top_2[0]),
        "first_prob": float(true_probabilities[top_2[0]]),
        "second_class": int(top_2[1]),
        "second_prob": float(true_probabilities[top_2[1]])
    }

    