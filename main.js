const imageUpload = document.getElementById('image-upload');
const originalImage = document.getElementById('original-image');
const modifiedImage = document.getElementById('modified-image');
const addClosetBtn = document.getElementById('add-closet-btn');
const originalEmpty = document.getElementById('original-empty');
const modifiedEmpty = document.getElementById('modified-empty');

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            originalImage.src = event.target.result;
            originalImage.style.display = 'block';
            originalEmpty.style.display = 'none';
            
            modifiedImage.src = event.target.result;
            modifiedImage.style.display = 'block';
            modifiedEmpty.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

addClosetBtn.addEventListener('click', () => {
    if (originalImage.src && originalImage.src !== '#' && originalImage.src.startsWith('data:image')) {
        // UI Feedback
        addClosetBtn.innerText = '설치 중...';
        addClosetBtn.disabled = true;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const baseImage = new Image();
        baseImage.src = originalImage.src;
        baseImage.onload = () => {
            canvas.width = baseImage.width;
            canvas.height = baseImage.height;
            ctx.drawImage(baseImage, 0, 0);

            // 가상의 붙박이장 효과 (브라운 톤 반투명 오버레이 + 선 표현)
            setTimeout(() => {
                const closetWidth = canvas.width * 0.4;
                const closetHeight = canvas.height * 0.8;
                const closetX = canvas.width * 0.1;
                const closetY = canvas.height * 0.15;

                // 그라데이션을 통한 고급스러운 느낌 추가
                const gradient = ctx.createLinearGradient(closetX, closetY, closetX + closetWidth, closetY);
                gradient.addColorStop(0, 'rgba(84, 60, 43, 0.85)');
                gradient.addColorStop(1, 'rgba(60, 45, 30, 0.9)');

                ctx.fillStyle = gradient;
                ctx.fillRect(closetX, closetY, closetWidth, closetHeight);
                
                // 도어 라인 표현
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 2;
                ctx.strokeRect(closetX, closetY, closetWidth, closetHeight);
                
                // 세로선 (도어 구분선)
                ctx.beginPath();
                ctx.moveTo(closetX + closetWidth/2, closetY);
                ctx.lineTo(closetX + closetWidth/2, closetY + closetHeight);
                ctx.stroke();

                modifiedImage.src = canvas.toDataURL();
                
                addClosetBtn.innerHTML = '<span class="btn-icon">✨</span> 붙박이장 자동 설치하기';
                addClosetBtn.disabled = false;
            }, 800); // 인공지능 처리 느낌을 위한 딜레이
        };
    } else {
        alert('먼저 방 사진을 선택해 주세요.');
    }
});
