from flask import Flask, render_template, jsonify, request
from datetime import datetime
import random
import json

app = Flask(__name__)

# 讀取獎項資料
def load_prizes():
    with open('data/prizes.json', encoding="utf-8") as f:
        return json.load(f)

# 更新獎項數量
def save_prizes(prizes):
    with open('data/prizes.json', 'w', encoding="utf-8") as f:
        json.dump(prizes, f)
        
# 儲存抽取紀錄
def save_draw_history(prize_name):
    record = {
        "prize": prize_name,
        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    try:
        # 嘗試讀取現有的紀錄陣列
        with open('data/draw_history.json', 'r', encoding="utf-8") as f:
            history = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # 如果檔案不存在或格式有錯誤，初始化為空列表
        history = []

    # 將新紀錄加入陣列
    history.append(record)

    # 儲存更新後的紀錄
    with open('data/draw_history.json', 'w', encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=4)

# 前台頁面
@app.route('/')
def index():
    return render_template('index.html')

# 後台頁面
@app.route('/admin')
def admin():
    return render_template('admin.html')

# 抽獎邏輯
@app.route('/draw', methods=['POST'])
def draw_prize():
    prizes = load_prizes()
    available_prizes = [prize for prize in prizes if prize["quantity"] > 0]

    if not available_prizes:
        return jsonify({"message": "抱歉，所有獎品已抽完！"}), 400

    # 設定每個獎品的權重（以剩餘數量為基礎）
    weights = [prize["quantity"] for prize in available_prizes]

    # 根據權重選擇獎品
    selected_prize = random.choices(available_prizes, weights=weights, k=1)[0]
    selected_prize["quantity"] -= 1

    save_prizes(prizes)
    save_draw_history(selected_prize["name"])

    return jsonify({"prize": selected_prize})


# 取得獎項資料
@app.route('/prizes')
def get_prizes():
    prizes = load_prizes()
    return jsonify({"prizes": prizes})

# 更新獎項數量
@app.route('/update_prize', methods=['POST'])
def update_prize():
    data = request.get_json()
    prize_id = data.get('prize_id')
    new_quantity = data.get('new_quantity')

    prizes = load_prizes()
    for prize in prizes:
        if prize["prize_id"] == prize_id:
            prize["quantity"] += new_quantity #改為增加數量
            save_prizes(prizes)
            return jsonify({"message": f"獎項ID {prize_id} 已更新為 {new_quantity} 個。"})

    return jsonify({"message": "獎項ID未找到。"}), 404

# 重置獎品
@app.route('/reset', methods=['POST'])
def reset_prizes():
    initial_prizes = [
    {"prize_id": 1, "name": "A 獎 客製小燈箱", "quantity": 2}, 
    {"prize_id": 2, "name": "B 獎 盒玩款水壺", "quantity": 2},
    {"prize_id": 3, "name": "C 獎 搖搖樂吊飾", "quantity": 10},
    {"prize_id": 4, "name": "D 獎 阿狼款壓克力吊飾", "quantity": 10},
    {"prize_id": 5, "name": "D 獎 栩栩熊款壓克力吊飾", "quantity": 10},
    {"prize_id": 6, "name": "D 獎 狼狽為奸款壓克力吊飾", "quantity": 10},
    {"prize_id": 7, "name": "D 獎 狐狸音款壓克力吊飾", "quantity": 10},
    {"prize_id": 8, "name": "D 獎 貓抓老鼠款壓克力吊飾", "quantity": 10},
    {"prize_id": 9, "name": "D 獎 盒玩款壓克力吊飾", "quantity": 10},
    {"prize_id": 10, "name": "D 獎 盒玩款L夾", "quantity": 20},
    {"prize_id": 11, "name": "E 獎 盒玩貼紙組-10款隨機", "quantity": 50},
    {"prize_id": 12, "name": "F 獎 盒玩款明信片組-3張一組", "quantity": 50}
    ]
    save_prizes(initial_prizes)
    return jsonify({"message": "獎品已重設！"})

# 取得抽取紀錄
# app.py 中的 get_draw_history 修改版
@app.route('/draw_history')
def get_draw_history():
    try:
        with open('data/draw_history.json', 'r', encoding="utf-8") as f:
            history = json.load(f)  # 直接解析為 JSON 陣列
    except (FileNotFoundError, json.JSONDecodeError):
        history = []  # 若文件不存在或無法解析，則返回空列表
    return jsonify({"history": history})



if __name__ == '__main__':
    app.run(debug=True)
