// Управление слайдами
let currentSlide = 1;
const totalSlides = 8;

// Инициализация
document.addEventListener('DOMContentLoaded', function () {
    initSlides();
    initIndicators();
    updateProgress();
    updateNavigation();

    // Клавиатурная навигация
    document.addEventListener('keydown', handleKeyPress);

    // Swipe для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            changeSlide(1); // Swipe left - next
        }
        if (touchEndX > touchStartX + 50) {
            changeSlide(-1); // Swipe right - prev
        }
    }
});

// Инициализация слайдов
function initSlides() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        if (index === 0) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

// Инициализация индикаторов
function initIndicators() {
    const indicatorsContainer = document.getElementById('slideIndicators');
    indicatorsContainer.innerHTML = '';

    for (let i = 1; i <= totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (i === 1) {
            indicator.classList.add('active');
        }
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
}

// Переход к слайду
function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) return;

    const slides = document.querySelectorAll('.slide');
    const currentSlideElement = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
    const nextSlideElement = document.querySelector(`.slide[data-slide="${slideNumber}"]`);

    // Удаляем классы
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev');
    });

    // Определяем направление
    if (slideNumber > currentSlide) {
        nextSlideElement.classList.add('active');
    } else if (slideNumber < currentSlide) {
        nextSlideElement.classList.add('active');
        currentSlideElement.classList.add('prev');
    } else {
        nextSlideElement.classList.add('active');
    }

    currentSlide = slideNumber;
    updateProgress();
    updateIndicators();
    updateNavigation();
}

// Изменение слайда
function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    if (newSlide >= 1 && newSlide <= totalSlides) {
        goToSlide(newSlide);
    }
}

// Обновление прогресс-бара
function updateProgress() {
    const progress = (currentSlide / totalSlides) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// Обновление индикаторов
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index + 1 === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Обновление навигации
function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
}

// Обработка клавиатуры
function handleKeyPress(e) {
    switch (e.key) {
        case 'ArrowLeft':
            changeSlide(-1);
            break;
        case 'ArrowRight':
            changeSlide(1);
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides);
            break;
        case ' ':
            e.preventDefault();
            changeSlide(1);
            break;
    }
}

// Плавная прокрутка для длинных слайдов
document.querySelectorAll('.slide').forEach(slide => {
    slide.addEventListener('wheel', function (e) {
        const isScrolledToBottom = this.scrollHeight - this.scrollTop <= this.clientHeight + 10;
        const isScrolledToTop = this.scrollTop <= 10;

        if (e.deltaY > 0 && isScrolledToBottom) {
            // Прокрутка вниз и достигнут конец - следующий слайд
            e.preventDefault();
            changeSlide(1);
        } else if (e.deltaY < 0 && isScrolledToTop) {
            // Прокрутка вверх и достигнуто начало - предыдущий слайд
            e.preventDefault();
            changeSlide(-1);
        }
    });
});

// Автоматическое обновление при изменении размера окна
window.addEventListener('resize', function () {
    // Пересчитываем позиции при изменении размера
    updateProgress();
});
