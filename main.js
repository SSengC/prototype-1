const imageUpload = document.getElementById('image-upload');
const originalImage = document.getElementById('original-image');
const modifiedImage = document.getElementById('modified-image');
const addClosetBtn = document.getElementById('add-closet-btn');

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            originalImage.src = event.target.result;
            originalImage.style.display = 'block';
            modifiedImage.src = event.target.result;
            modifiedImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

addClosetBtn.addEventListener('click', () => {
    if (originalImage.src && originalImage.src !== '#' && originalImage.src.startsWith('data:image')) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const baseImage = new Image();
        baseImage.src = originalImage.src;
        baseImage.onload = () => {
            canvas.width = baseImage.width;
            canvas.height = baseImage.height;
            ctx.drawImage(baseImage, 0, 0);

            // 가상의 붙박이장 이미지를 불러오거나, 실패 시 사각형을 그립니다.
            const closetImage = new Image();
            // 무료로 사용할 수 있는 붙박이장 또는 유사한 이미지 URL (테스트용)
            closetImage.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'; // 대체 이미지 사용 시도
            closetImage.crossOrigin = "Anonymous";

            closetImage.onload = () => {
                const closetWidth = canvas.width * 0.4;
                const closetHeight = canvas.height * 0.7;
                const closetX = canvas.width * 0.1;
                const closetY = canvas.height * 0.2;

                ctx.drawImage(closetImage, closetX, closetY, closetWidth, closetHeight);
                modifiedImage.src = canvas.toDataURL();
            };

            closetImage.onerror = () => {
                // 이미지를 불러오지 못할 경우 스타일링된 사각형으로 대체
                ctx.fillStyle = 'rgba(100, 70, 40, 0.8)'; // 나무 색상 계열
                ctx.fillRect(canvas.width * 0.1, canvas.height * 0.2, canvas.width * 0.4, canvas.height * 0.7);
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.strokeRect(canvas.width * 0.1, canvas.height * 0.2, canvas.width * 0.4, canvas.height * 0.7);
                modifiedImage.src = canvas.toDataURL();
            };
        };
    } else {
        alert('먼저 방 사진을 선택해 주세요.');
    }
});
