const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const gameMessage = document.getElementById('game-message');
const items = document.querySelectorAll('.clickable-item');

// 1. 인트로 애니메이션 후 화면 전환
setTimeout(() => {
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        setTimeout(() => {
            gameScreen.style.opacity = '1';
        }, 50);
    }, 1000);
}, 5000); // 애니메이션 지속 시간에 맞춤

// 2. 게임 상호작용 로직
const itemData = {
    'item-desk': '책상 위에는 낡은 열쇠 하나가 놓여 있습니다.',
    'item-painting': '그림 뒤에 무언가 숨겨져 있는 것 같습니다.',
    'item-door': '문이 굳게 잠겨 있습니다. 열쇠가 필요할 것 같습니다.'
};

items.forEach(item => {
    item.addEventListener('click', () => {
        const id = item.id;
        const message = itemData[id];
        displayMessage(message);
        
        if (id === 'item-desk') {
            addToInventory('🔑');
        }
    });
});

function displayMessage(msg) {
    gameMessage.style.opacity = '0';
    setTimeout(() => {
        gameMessage.innerText = msg;
        gameMessage.style.opacity = '1';
    }, 200);
}

function addToInventory(icon) {
    const firstSlot = document.querySelector('.slot:empty') || document.getElementById('slot-1');
    if (firstSlot.innerText === '') {
        firstSlot.innerText = icon;
        displayMessage('열쇠를 획득했습니다!');
    }
}

// 3. 다시 시작 버튼
document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload();
});
