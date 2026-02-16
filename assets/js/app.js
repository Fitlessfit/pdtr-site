// ------------------------------
// СЛАЙДЕР ДО / ПОСЛЕ
// ------------------------------
const slidesData = [
    { before: 'assets/img/dostijeniya/before-1.png', after: 'assets/img/dostijeniya/after-1.png' },
    { before: 'assets/img/dostijeniya/before-2.png', after: 'assets/img/dostijeniya/after-2.png' },
    { before: 'assets/img/dostijeniya/before-3.png', after: 'assets/img/dostijeniya/after-3.png' }
];

let currentSlide = 0;
const beforeImage = document.getElementById('before-image');
const afterImage = document.getElementById('after-image');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const indicatorsContainer = document.getElementById('indicators');
const errorMessage = document.getElementById('error-message');

function createIndicators() {
    indicatorsContainer.innerHTML = '';
    slidesData.forEach((_, i) => {
        const ind = document.createElement('div');
        ind.classList.add('indicator');
        if (i === currentSlide) ind.classList.add('active');
        ind.addEventListener('click', () => {
            currentSlide = i;
            updateSlider();
        });
        indicatorsContainer.appendChild(ind);
    });
}

function updateSlider() {
    beforeImage.innerHTML = '<div>Загрузка...</div>';
    afterImage.innerHTML = '<div>Загрузка...</div>';

    const beforeImg = new Image();
    const afterImg = new Image();

    beforeImg.onload = () => { beforeImage.innerHTML = ''; beforeImage.appendChild(beforeImg); };
    afterImg.onload = () => { afterImage.innerHTML = ''; afterImage.appendChild(afterImg); };
    beforeImg.onerror = afterImg.onerror = () => { showError(); };

    beforeImg.src = slidesData[currentSlide].before;
    afterImg.src = slidesData[currentSlide].after;

    document.querySelectorAll('.indicator').forEach((ind, idx) => {
        ind.classList.toggle('active', idx === currentSlide);
    });

    errorMessage.style.display = 'none';
}

function showError() {
    errorMessage.style.display = 'block';
    beforeImage.innerHTML = '<div>Ошибка загрузки</div>';
    afterImage.innerHTML = '<div>Ошибка загрузки</div>';
}

// --- управление кнопками ---
prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slidesData.length) % slidesData.length;
    updateSlider();
});
nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slidesData.length;
    updateSlider();
});

// --- управление стрелками на клавиатуре ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        currentSlide = (currentSlide - 1 + slidesData.length) % slidesData.length;
        updateSlider();
    } else if (e.key === 'ArrowRight') {
        currentSlide = (currentSlide + 1) % slidesData.length;
        updateSlider();
    }
});

// --- свайп (тач-события) ---
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // свайп влево → следующий
        currentSlide = (currentSlide + 1) % slidesData.length;
        updateSlider();
    }
    if (touchEndX > touchStartX + 50) {
        // свайп вправо → предыдущий
        currentSlide = (currentSlide - 1 + slidesData.length) % slidesData.length;
        updateSlider();
    }
}

// слушаем тач
document.querySelector('.achievement__content-images-block').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});
document.querySelector('.achievement__content-images-block').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

createIndicators();
updateSlider();

// ==============================
// ACCORDION ДЛЯ УСЛУГ
// ==============================
function toggleService(button) {
    const serviceItems = button.nextElementSibling;
    const isOpen = serviceItems.style.display !== 'none';
    
    // Закрываем все остальные аккордионы
    document.querySelectorAll('.service-items').forEach(item => {
        item.style.display = 'none';
    });
    
    // Открываем текущий, если он был закрыт
    if (!isOpen) {
        serviceItems.style.display = 'flex';
        button.setAttribute('aria-expanded', 'true');
    } else {
        button.removeAttribute('aria-expanded');
    }
    
    // Убираем aria-expanded у других
    document.querySelectorAll('.service-category-title').forEach(btn => {
        if (btn !== button) {
            btn.removeAttribute('aria-expanded');
        }
    });
}

// ==============================
// ACCORDION ДЛЯ FAQ
// ==============================
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const faqContent = button.nextElementSibling;
    const isOpen = faqContent.style.display !== 'none';
    
    // Закрываем все остальные FAQ
    document.querySelectorAll('.faq__item-content').forEach(content => {
        content.style.display = 'none';
    });
    document.querySelectorAll('.faq__item').forEach(item => {
        item.removeAttribute('aria-expanded');
    });
    
    // Открываем текущий, если он был закрыт
    if (!isOpen) {
        faqContent.style.display = 'block';
        faqItem.setAttribute('aria-expanded', 'true');
    }
}
