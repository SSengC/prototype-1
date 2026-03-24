const introScreen = document.getElementById('intro-screen');
const storySelectionScreen = document.getElementById('story-selection-screen');
const gameScreen = document.getElementById('game-screen');
const storyCards = document.querySelectorAll('.story-card');
const currentStoryTitle = document.getElementById('current-story-title');
const roomImage = document.getElementById('room-image');
const gameMessage = document.getElementById('game-message');

const storyData = {
    'closet': {
        title: '사라진 붙박이장',
        bg: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        message: '벽장 뒤에서 서늘한 기운이 느껴집니다.'
    },
    'library': {
        title: '자정의 도서관',
        bg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        message: '책장 사이로 오래된 종이 냄새가 진동합니다.'
    },
    'laboratory': {
        title: '모모의 비밀 실험실',
        bg: 'https://images.unsplash.com/photo-1532094349884-543bb1198343?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        message: '기계 장치들이 규칙적인 소음을 내고 있습니다.'
    },
    'dream': {
        title: '달빛 아래 꿈의 조각',
        bg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        message: '현실인지 꿈인지 알 수 없는 몽환적인 풍경입니다.'
    }
};

// 1. 인트로 -> 스토리 선택 화면 전환
setTimeout(() => {
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.classList.add('hidden');
        storySelectionScreen.classList.remove('hidden');
        storySelectionScreen.style.opacity = '1';
    }, 1000);
}, 5000);

// 2. 스토리 선택 -> 게임 화면 전환
storyCards.forEach(card => {
    card.addEventListener('click', () => {
        const storyKey = card.getAttribute('data-story');
        const data = storyData[storyKey];

        // 게임 화면 정보 설정
        currentStoryTitle.innerText = data.title;
        roomImage.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${data.bg}')`;
        gameMessage.innerText = data.message;

        // 화면 전환
        storySelectionScreen.style.opacity = '0';
        setTimeout(() => {
            storySelectionScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            gameScreen.style.opacity = '1';
        }, 800);
    });
});

// 3. 다시 시작 및 뒤로가기 버튼
document.getElementById('back-to-stories').addEventListener('click', () => {
    gameScreen.style.opacity = '0';
    setTimeout(() => {
        gameScreen.classList.add('hidden');
        storySelectionScreen.classList.remove('hidden');
        storySelectionScreen.style.opacity = '1';
    }, 800);
});

document.getElementById('restart-btn').addEventListener('click', () => {
    // 소지품 초기화 등 게임 상태 리셋 로직
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => slot.innerText = '');
    displayMessage('방이 초기화되었습니다.');
});

function displayMessage(msg) {
    gameMessage.style.opacity = '0';
    setTimeout(() => {
        gameMessage.innerText = msg;
        gameMessage.style.opacity = '1';
    }, 200);
}
