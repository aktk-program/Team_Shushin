import requests
import time

"""
response = string_to_model("a mushroom")
print(response)

上のコードでresponseに a mashroom の3dモデルがあるurlが入る

文字列(string)を渡したら、その3dモデルのurl(string)を返す
YOUR_API_KEYに、meshyのapi keyを入力する
"""

def string_to_model(prompt):

    YOUR_API_KEY = ""

    # モデルの生成 ------------------------------------
    payload = {
        "mode": "preview",
        "prompt": str(prompt),
        "art_style": "realistic",
        "negative_prompt": ""
    }
    headers = {
        "Authorization": f"Bearer {YOUR_API_KEY}"
    }
    response = requests.post(
        "https://api.meshy.ai/v2/text-to-3d",
        headers=headers,
        json=payload,
    )
    response.raise_for_status()

    print("停止中")
    time.sleep(60)
    print("再開")
    # モデルの取得(url) -------------------------------
    task_id = response.json()["result"]
    headers = {
    "Authorization": f"Bearer {YOUR_API_KEY}"
    }
    print("task_id.type: ", type(task_id))
    response = requests.get(
    f"https://api.meshy.ai/v2/text-to-3d/{task_id}",
    headers=headers,
    )
    response.raise_for_status()

    print(response.json())
    return response.json()["model_urls"]["glb"]