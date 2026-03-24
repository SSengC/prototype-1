// 1. DOM 요소 참조
const introScreen = document.getElementById('intro-screen');
const storySelectionScreen = document.getElementById('story-selection-screen');
const gameScreen = document.getElementById('game-screen');
const startBtns = document.querySelectorAll('.start-btn');

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
const progressBar = document.querySelector('.progress-bar');
const closeModal = document.querySelector('.close-modal');

// 2. 게임 상태 관리
let currentStage = 1;
let hintsUsed = 0;
const freeHintsLimit = 3;

const storyData = {
    'library': {
        title: '자정의 도서관',
        stages: [
            {
                name: '금지된 서고',
                bg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80',
                init: initStage1,
                hint: '책들의 높이가 계단 모양이 되도록 맞춰보세요. (중-하-상-중)'
            },
            {
                name: '기억의 복도',
                bg: 'https://images.unsplash.com/photo-1513519247388-4a26d7229777?auto=format&fit=crop&w=1600&q=80',
                init: initStage2,
                hint: '모든 시계 바늘이 정확히 하늘(12시)을 찌르게 만드세요.'
            },
            {
                name: '과거의 교실',
                bg: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
                init: initStage3,
                hint: '희미하게 빛나는 종이 조각 3개를 모두 클릭해야 합니다.'
            }
        ]
    }
};

// 3. 인트로 및 화면 전환
window.onload = () => {
    setTimeout(() => {
        introScreen.style.opacity = '0';
        setTimeout(() => {
            introScreen.classList.add('hidden');
            storySelectionScreen.classList.remove('hidden');
        }, 1000);
    }, 5000);
};

// 스토리 선택 버튼 이벤트 (탐험 시작 버튼)
startBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.story-card');
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
    
    currentStoryTitle.innerText = stage.name;
    currentStageText.innerText = `0${stageNum}`;
    roomImage.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${stage.bg}')`;
    
    puzzleLayer.innerHTML = '';
    stage.init();
}

// 4. 퍼즐 로직
function initStage1() {
    displayMessage('서고의 책들이 불규칙하게 꽂혀 있습니다. 규칙을 찾아 배열하세요.');
    const pattern = [2, 1, 3, 2];
    let current = [1, 1, 1, 1];
    
    const shelf = document.createElement('div');
    shelf.className = 'book-shelf';
    
    for (let i = 0; i < 4; i++) {
        const book = document.createElement('div');
        book.className = 'book';
        book.style.height = (current[i] * 40 + 50) + 'px';
        book.onclick = () => {
            current[i] = (current[i] % 3) + 1;
            book.style.height = (current[i] * 40 + 50) + 'px';
            if (JSON.stringify(current) === JSON.stringify(pattern)) {
                displayMessage('조용히 서재의 뒷문이 열립니다.');
                setTimeout(() => loadStage(2), 1500);
            }
        };
        shelf.appendChild(book);
    }
    puzzleLayer.appendChild(shelf);
}

function initStage2() {
    displayMessage('멈춰버린 시계들... 자정의 종소리를 다시 울려야 합니다.');
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
                displayMessage('자정의 종소리가 복도를 가득 채웁니다.');
                setTimeout(() => loadStage(3), 1500);
            }
        };
        container.appendChild(clock);
    });
    puzzleLayer.appendChild(container);
}

function initStage3() {
    displayMessage('교실 바닥에 흩어진 과거의 일기 조각을 모두 모으세요.');
    let found = 0;
    const positions = [
        {t:'25%',l:'20%'}, {t:'75%',l:'70%'}, {t:'45%',l:'85%'}
    ];
    
    positions.forEach(p => {
        const piece = document.createElement('div');
        piece.className = 'diary-piece';
        piece.innerText = '📄';
        piece.style.top = p.t; piece.style.left = p.l;
        piece.onclick = () => {
            piece.remove();
            found++;
            addToInventory('📄');
            if (found === 3) {
                displayMessage('모든 기억이 돌아왔습니다. 문이 열립니다!');
                setTimeout(() => { 
                    alert('🎉 축하합니다! 모모의 방에서 성공적으로 탈출하셨습니다.'); 
                    location.reload(); 
                }, 2000);
            } else {
                displayMessage(`일기 조각을 찾았습니다. (${found}/3)`);
            }
        };
        puzzleLayer.appendChild(piece);
    });
}

// 5. 유틸리티 함수
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

// 6. 힌트 시스템
hintBtn.onclick = () => {
    if (hintsUsed < freeHintsLimit) {
        showHint();
        hintsUsed++;
        updateHintBtn();
    } else {
        playAd();
    }
};

function updateHintBtn() {
    const left = freeHintsLimit - hintsUsed;
    hintCountText.innerText = left > 0 ? left : 'AD';
}

function showHint() {
    const h = storyData['library'].stages[currentStage - 1].hint;
    hintText.innerText = h;
    adView.classList.add('hidden');
    hintView.classList.remove('hidden');
    hintModal.classList.remove('hidden');
}

function playAd() {
    hintView.classList.add('hidden');
    adView.classList.remove('hidden');
    hintModal.classList.remove('hidden');
    progressBar.style.width = '0%';
    
    let w = 0;
    const timer = setInterval(() => {
        w += 2;
        progressBar.style.width = w + '%';
        if (w >= 100) {
            clearInterval(timer);
            showHint();
        }
    }, 100);
}

closeModal.onclick = () => hintModal.classList.add('hidden');
document.getElementById('back-to-stories').onclick = () => location.reload();
document.getElementById('restart-btn').onclick = () => loadStage(1);
