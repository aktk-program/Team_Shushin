# Your Yaminabe

## 使い方

```
$ cd ./back
$ uvicorn main:app --reload
$ cd ./..
$ npm run dev
```

## 注意

Gemini と Meshy の API key は各自用意してください。<br>
string_to_model.py の`YOUR_API_KEY`に Meshy の API key、<br>
scoring.py の`API_KEY`に Gemini の API key を入れてください。

# React(JS) + Vite

環境は`./package.json`参照

```
npm run dev
```

# Python

環境は`./back/requirements.txt`参照

## 仮想環境の activate

```
#作業ディレクトリに移動
$ sudo apt install python3.12-venv
$ python3 -m venv [env_name]
$ source [env_name]/bin/activate
$ pip install -r requirements.txt
$ [env_name]/bin/activate
```

## 仮想環境の deactivate

```
([env_name]) $ deactivate
```
