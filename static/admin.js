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
// 顯示所有抽取紀錄
// admin.js 中的 loadDrawHistory (每隔5秒自動刷新)
function loadDrawHistory() {
    fetch('/draw_history')
        .then(response => response.json())
        .then(data => {
            const drawHistoryList = document.getElementById('draw-history');
            drawHistoryList.innerHTML = ''; // 清空列表
            data.history.reverse().forEach(record => {  // 顯示所有紀錄
                const listItem = document.createElement('li');
                listItem.textContent = `抽中了 ${record.prize} (${record.timestamp})`;
                drawHistoryList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading draw history:', error));
}

// 更新獎項數量
document.getElementById('update-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const prizeId = document.getElementById('prize-id').value;
    const newQuantity = document.getElementById('new-quantity').value;
    
    fetch('/update_prize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prize_id: parseInt(prizeId),
            new_quantity: parseInt(newQuantity)
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadAllPrizes();  // 更新獎項顯示
        loadRemainingPrizes(); // 更新剩餘獎項
    })
    .catch(error => console.error('Error updating prize:', error));
});

// admin.js 中的 loadPrizeOptions 函數
function loadPrizeOptions() {
    fetch('/prizes')
        .then(response => response.json())
        .then(data => {
            const prizeSelect = document.getElementById('prize-id');
            prizeSelect.innerHTML = ''; // 清空選單
            data.prizes.forEach(prize => {
                const option = document.createElement('option');
                option.value = prize.prize_id;
                option.textContent = `${prize.name} (ID: ${prize.prize_id})`;
                prizeSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading prize options:', error));
}


// 頁面載入時顯示獎項和抽取紀錄
window.onload = function() {
    loadPrizeOptions();      // 加載獎項選單
    loadRemainingPrizes();   // 加載剩餘獎項
    loadDrawHistory();       // 加載抽取紀錄
    setInterval(loadRemainingPrizes, 30000);
    setInterval(loadDrawHistory, 30000 );  // 每5秒刷新一次
};


