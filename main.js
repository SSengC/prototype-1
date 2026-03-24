const introScreen = document.getElementById('intro-screen');
const storySelectionScreen = document.getElementById('story-selection-screen');
const gameScreen = document.getElementById('game-screen');
const storyCards = document.querySelectorAll('.story-card');
const currentStoryTitle = document.getElementById('current-story-title');
const roomImage = document.getElementById('room-image');
const gameMessage = document.getElementById('game-message');
const puzzleLayer = document.getElementById('puzzle-layer');
const currentStageText = document.getElementById('current-stage');

let currentStage = 1;
let selectedStory = '';

const storyData = {
    'library': {
        title: '자정의 도서관',
        stages: [
            {
                name: '금지된 서고',
                bg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1350&q=80',
                init: initStage1
            },
            {
                name: '기억의 복도',
                bg: 'https://images.unsplash.com/photo-1513519247388-4a26d7229777?auto=format&fit=crop&w=1350&q=80',
                init: initStage2
            },
            {
                name: '과거의 교실',
                bg: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1350&q=80',
                init: initStage3
            }
        ]
    }
};

// 1. 화면 전환 로직
setTimeout(() => {
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.classList.add('hidden');
        storySelectionScreen.classList.remove('hidden');
        storySelectionScreen.style.opacity = '1';
    }, 1000);
}, 5000);

storyCards.forEach(card => {
    card.addEventListener('click', () => {
        selectedStory = card.getAttribute('data-story');
        if (selectedStory === 'library') {
            startGame();
        } else {
            alert('이 스토리는 준비 중입니다. 자정의 도서관을 선택해 주세요.');
        }
    });
});

function startGame() {
    storySelectionScreen.style.opacity = '0';
    setTimeout(() => {
        storySelectionScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameScreen.style.opacity = '1';
        loadStage(1);
    }, 800);
}

function loadStage(stageNum) {
    currentStage = stageNum;
    const stage = storyData['library'].stages[stageNum - 1];
    currentStoryTitle.innerText = `자정의 도서관 - ${stage.name}`;
    currentStageText.innerText = `Stage ${stageNum}`;
    roomImage.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${stage.bg}')`;
    
    puzzleLayer.innerHTML = ''; // 이전 퍼즐 제거
    stage.init();
}

// 2. Stage 1: 금지된 서고 (책장 패턴)
function initStage1() {
    displayMessage('책장에 꽂힌 책들의 높낮이가 수상합니다. 특정 패턴을 맞춰보세요.');
    
    const pattern = [2, 1, 3, 2]; // 정답 패턴
    let currentPattern = [1, 1, 1, 1];
    
    const bookContainer = document.createElement('div');
    bookContainer.className = 'book-shelf';
    
    for (let i = 0; i < 4; i++) {
        const book = document.createElement('div');
        book.className = 'book';
        book.style.height = (currentPattern[i] * 30 + 40) + 'px';
        book.addEventListener('click', () => {
            currentPattern[i] = (currentPattern[i] % 3) + 1;
            book.style.height = (currentPattern[i] * 30 + 40) + 'px';
            checkPattern();
        });
        bookContainer.appendChild(book);
    }
    puzzleLayer.appendChild(bookContainer);

    function checkPattern() {
        if (JSON.stringify(currentPattern) === JSON.stringify(pattern)) {
            displayMessage('철컥! 서고의 비밀 통로가 열렸습니다.');
            setTimeout(() => loadStage(2), 1500);
        }
    }
}

// 3. Stage 2: 기억의 복도 (시계 맞추기)
function initStage2() {
    displayMessage('벽면의 시계들이 제각각입니다. 모든 시계를 자정(00:00)으로 맞추세요.');
    
    const clockTimes = [3, 9, 6]; // 현재 시간들 (3시, 9시, 6시)
    const clockContainer = document.createElement('div');
    clockContainer.className = 'clock-container';
    
    clockTimes.forEach((time, index) => {
        const clock = document.createElement('div');
        clock.className = 'clock';
        clock.innerHTML = `<div class="hand" style="transform: rotate(${time * 30}deg)"></div>`;
        clock.addEventListener('click', () => {
            clockTimes[index] = (clockTimes[index] + 3) % 12;
            clock.querySelector('.hand').style.transform = `rotate(${clockTimes[index] * 30}deg)`;
            if (clockTimes.every(t => t === 0)) {
                displayMessage('자정의 종소리와 함께 교실 문이 열립니다.');
                setTimeout(() => loadStage(3), 1500);
            }
        });
        clockContainer.appendChild(clock);
    });
    puzzleLayer.appendChild(clockContainer);
}

// 4. Stage 3: 과거의 교실 (일기 조각 모으기)
function initStage3() {
    displayMessage('책상 위에 흩어진 일기장 조각 3개를 모아 특정 날짜를 찾아내세요.');
    let foundPieces = 0;
    
    const positions = [
        { t: '60%', l: '20%' },
        { t: '30%', l: '70%' },
        { t: '50%', l: '50%' }
    ];
    
    positions.forEach((pos, i) => {
        const piece = document.createElement('div');
        piece.className = 'diary-piece';
        piece.innerText = '📄';
        piece.style.top = pos.t;
        piece.style.left = pos.l;
        piece.addEventListener('click', () => {
            piece.style.display = 'none';
            foundPieces++;
            addToInventory('📄');
            if (foundPieces === 3) {
                displayMessage('일기장을 완성했습니다! "1998년 3월 24일"... 현실로 돌아갑니다.');
                setTimeout(() => {
                    alert('탈출 성공! 당신은 무사히 현실로 돌아왔습니다.');
                    location.reload();
                }, 2000);
            } else {
                displayMessage(`조각을 찾았습니다. (${foundPieces}/3)`);
            }
        });
        puzzleLayer.appendChild(piece);
    });
}

function displayMessage(msg) {
    gameMessage.style.opacity = '0';
    setTimeout(() => {
        gameMessage.innerText = msg;
        gameMessage.style.opacity = '1';
    }, 200);
}

function addToInventory(icon) {
    const emptySlot = Array.from(document.querySelectorAll('.slot')).find(s => s.innerText === '');
    if (emptySlot) emptySlot.innerText = icon;
}

document.getElementById('back-to-stories').addEventListener('click', () => location.reload());
document.getElementById('restart-btn').addEventListener('click', () => loadStage(1));
