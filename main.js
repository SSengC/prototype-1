// 1. DOM 요소 참조
const introScreen = document.getElementById('intro-screen');
const storySelectionScreen = document.getElementById('story-selection-screen');
const gameScreen = document.getElementById('game-screen');
const storyCards = document.querySelectorAll('.story-card:not(.disabled)');

const currentStoryTitle = document.getElementById('current-story-title');
const currentStageText = document.getElementById('current-stage');
const roomImage = document.getElementById('room-image');
const gameMessage = document.getElementById('game-message');
const puzzleLayer = document.getElementById('puzzle-layer');

const hintBtn = document.getElementById('hint-btn');
const hintCountText = document.getElementById('hint-count');
const hintModal = document.getElementById('hint-modal');
const hintText = document.getElementById('hint-text');
const adView = document.getElementById('ad-view');
const hintView = document.getElementById('hint-view');
const adProgress = document.querySelector('.ad-progress');

// 2. 게임 상태 변수
let currentStage = 1;
let hintsUsed = 0;
const freeHintsLimit = 3;

const storyData = {
    'library': {
        title: '자정의 도서관',
        stages: [
            {
                name: '금지된 서고',
                bg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1350&q=80',
                init: initStage1,
                hint: '책의 높이를 클릭해 조절하세요. 정답 패턴은 "중(2)-하(1)-상(3)-중(2)"입니다.'
            },
            {
                name: '기억의 복도',
                bg: 'https://images.unsplash.com/photo-1513519247388-4a26d7229777?auto=format&fit=crop&w=1350&q=80',
                init: initStage2,
                hint: '모든 시계 바늘이 12시(0도)를 향하게 만드세요. 시계를 클릭하면 3시간씩 돌아갑니다.'
            },
            {
                name: '과거의 교실',
                bg: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1350&q=80',
                init: initStage3,
                hint: '화면 곳곳에 숨겨진 종이 조각 3개를 찾아 클릭하세요.'
            }
        ]
    }
};

// 3. 초기 실행: 인트로 종료 후 스토리 선택 화면 표시
setTimeout(() => {
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.classList.add('hidden');
        storySelectionScreen.classList.remove('hidden');
    }, 1000);
}, 5000);

// 4. 스토리 선택 이벤트
storyCards.forEach(card => {
    card.addEventListener('click', () => {
        const story = card.getAttribute('data-story');
        if (story === 'library') {
            startGame();
        }
    });
});

function startGame() {
    storySelectionScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    loadStage(1);
}

function loadStage(stageNum) {
    currentStage = stageNum;
    const stage = storyData['library'].stages[stageNum - 1];
    
    currentStoryTitle.innerText = `자정의 도서관 - ${stage.name}`;
    currentStageText.innerText = `Stage ${stageNum}`;
    roomImage.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${stage.bg}')`;
    
    puzzleLayer.innerHTML = '';
    stage.init();
}

// 5. 스테이지별 퍼즐 구현
function initStage1() {
    displayMessage('책장에 꽂힌 책들의 높낮이를 맞춰 비밀 통로를 여세요.');
    const pattern = [2, 1, 3, 2];
    let current = [1, 1, 1, 1];
    
    const shelf = document.createElement('div');
    shelf.className = 'book-shelf';
    
    for (let i = 0; i < 4; i++) {
        const book = document.createElement('div');
        book.className = 'book';
        book.style.height = (current[i] * 30 + 40) + 'px';
        book.onclick = () => {
            current[i] = (current[i] % 3) + 1;
            book.style.height = (current[i] * 30 + 40) + 'px';
            if (JSON.stringify(current) === JSON.stringify(pattern)) {
                displayMessage('비밀 통로가 열렸습니다!');
                setTimeout(() => loadStage(2), 1500);
            }
        };
        shelf.appendChild(book);
    }
    puzzleLayer.appendChild(shelf);
}

function initStage2() {
    displayMessage('모든 시계를 자정(12시)으로 맞추세요.');
    const times = [3, 9, 6];
    const container = document.createElement('div');
    container.className = 'clock-container';
    
    times.forEach((t, i) => {
        const clock = document.createElement('div');
        clock.className = 'clock';
        clock.innerHTML = `<div class="hand" style="transform: rotate(${t * 30}deg)"></div>`;
        clock.onclick = () => {
            times[i] = (times[i] + 3) % 12;
            clock.querySelector('.hand').style.transform = `rotate(${times[i] * 30}deg)`;
            if (times.every(v => v === 0)) {
                displayMessage('교실 문이 열렸습니다.');
                setTimeout(() => loadStage(3), 1500);
            }
        };
        container.appendChild(clock);
    });
    puzzleLayer.appendChild(container);
}

function initStage3() {
    displayMessage('흩어진 일기장 조각 3개를 찾으세요.');
    let found = 0;
    const pos = [{t:'20%',l:'30%'}, {t:'70%',l:'60%'}, {t:'40%',l:'10%'}];
    
    pos.forEach(p => {
        const piece = document.createElement('div');
        piece.className = 'diary-piece';
        piece.innerText = '📄';
        piece.style.top = p.t; piece.style.left = p.l;
        piece.onclick = () => {
            piece.remove();
            found++;
            addToInventory('📄');
            if (found === 3) {
                displayMessage('일기장을 완성했습니다! 현실로 귀환합니다.');
                setTimeout(() => { alert('탈출 성공!'); location.reload(); }, 2000);
            }
        };
        puzzleLayer.appendChild(piece);
    });
}

// 6. UI 보조 기능 (힌트, 메시지 등)
function displayMessage(msg) {
    gameMessage.innerText = msg;
}

function addToInventory(item) {
    const slots = document.querySelectorAll('.slot');
    for (let slot of slots) {
        if (slot.innerText === '') {
            slot.innerText = item;
            break;
        }
    }
}

hintBtn.onclick = () => {
    if (hintsUsed < freeHintsLimit) {
        showHintModal();
        hintsUsed++;
        updateHintUI();
    } else {
        showAdModal();
    }
};

function updateHintUI() {
    const remaining = freeHintsLimit - hintsUsed;
    hintCountText.innerText = remaining > 0 ? remaining : 'AD';
}

function showHintModal() {
    const hint = storyData['library'].stages[currentStage - 1].hint;
    hintText.innerText = hint;
    adView.classList.add('hidden');
    hintView.classList.remove('hidden');
    hintModal.classList.remove('hidden');
}

function showAdModal() {
    hintView.classList.add('hidden');
    adView.classList.remove('hidden');
    hintModal.classList.remove('hidden');
    adProgress.style.width = '0%';
    
    let p = 0;
    const interval = setInterval(() => {
        p += 2;
        adProgress.style.width = p + '%';
        if (p >= 100) {
            clearInterval(interval);
            showHintModal();
        }
    }, 100);
}

document.querySelector('.close-modal').onclick = () => hintModal.classList.add('hidden');
document.getElementById('back-to-stories').onclick = () => location.reload();
document.getElementById('restart-btn').onclick = () => loadStage(1);
