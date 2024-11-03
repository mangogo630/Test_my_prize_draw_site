

// 顯示剩餘獎項
function loadRemainingPrizes() {
    fetch('/prizes')
        .then(response => response.json())
        .then(data => {
            const remainingPrizesList = document.getElementById('remaining-prizes');
            remainingPrizesList.innerHTML = ''; // 清空列表
            data.prizes.forEach(prize => {  // 顯示所有獎項，不過濾數量
                const listItem = document.createElement('li');
                listItem.textContent = `${prize.name}: ${prize.quantity}個`;
                remainingPrizesList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading remaining prizes:', error));
}

// 顯示最新三次抽取紀錄
// script.js 中的 loadDrawHistory (隱藏時間)
function loadDrawHistory() {
    fetch('/draw_history')
        .then(response => response.json())
        .then(data => {
            const drawHistoryList = document.getElementById('draw-history');
            drawHistoryList.innerHTML = ''; // 清空列表
            data.history.slice(-3).reverse().forEach(record => {  // 顯示最新三條紀錄
                const listItem = document.createElement('li');
                listItem.textContent = `抽中了 ${record.prize}`;  // 隱藏時間部分
                drawHistoryList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading draw history:', error));
}

// 抽獎後更新畫面
function drawPrize() {
    fetch('/draw', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.prize) {
                document.getElementById("result").innerText = `恭喜！你抽中了 ${data.prize.name}！`;
                loadRemainingPrizes();  // 更新剩餘獎項
                loadDrawHistory();      // 更新抽取紀錄
            } else {
                document.getElementById("result").innerText = data.message;
            }
        })
        .catch(error => console.error('Error:', error));
}

// 頁面載入時顯示獎項和抽取紀錄
window.onload = function() {
    loadRemainingPrizes();
    loadDrawHistory();
    setInterval(loadRemainingPrizes, 2500);  // 每5秒更新剩餘獎項
    setInterval(loadDrawHistory, 2500);      // 每5秒更新抽獎紀錄
};
