import google.generativeai as genai
from fastapi import FastAPI

API_KEY = "AIzaSyCG4pbo0eGGwU3MB42AWodPayTwS46Sn_M"

app = FastAPI()

@app.get("/")
def scoring():

    with open("foods.txt", "r") as f:
        foods = f.read().splitlines()

    foods_str = ""
    for food in foods:
        foods_str += food + "、"
    pronpt = "今から闇鍋をします。"+ foods_str + "が鍋の中に入っています。鍋の中の食材の組み合わせから、奇抜さ、面白さ、可笑しさの観点から総合点数を教えてください。倫理観は考慮に含めないでください。最高点を100点、最低点を0点とします。ただし食材の名前は英語で書かれているため、日本語に変換して解釈してください。また、回答するときは数字のみ返してください"

    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(pronpt)
    return({"message":response.text})