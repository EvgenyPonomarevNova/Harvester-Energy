// Маска для телефона
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('7') || value.startsWith('8')) {
            value = value.substring(1);
        }
        
        if (value.length > 0) {
            value = '+7 (' + value;
        }
        if (value.length > 7) {
            value = value.substring(0, 7) + ') ' + value.substring(7);
        }
        if (value.length > 12) {
            value = value.substring(0, 12) + '-' + value.substring(12);
        }
        if (value.length > 15) {
            value = value.substring(0, 15) + '-' + value.substring(15);
        }
        if (value.length > 18) {
            value = value.substring(0, 18);
        }
        
        e.target.value = value;
    });
    
    phoneInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace') {
            const cursorPosition = e.target.selectionStart;
            if (cursorPosition <= 4) {
                e.preventDefault();
            }
        }
    });
}

// Слайдер фоновых фото
function startPhotoSlider() {
    let currentBgSlide = 0;
    const bgSlides = document.querySelectorAll('.bg-slide');
    
    // Проверяем, есть ли слайды
    if (bgSlides.length === 0) {
        console.log('❌ Слайды не найдены');
        return;
    }
    
    console.log(`✅ Найдено слайдов: ${bgSlides.length}`);
    
    function nextBgSlide() {
        // Убираем активный класс у текущего слайда
        bgSlides[currentBgSlide].classList.remove('active');
        
        // Переходим к следующему слайду
        currentBgSlide = (currentBgSlide + 1) % bgSlides.length;
        
        // Добавляем активный класс новому слайду
        bgSlides[currentBgSlide].classList.add('active');
        
        console.log(`🔄 Переключение на слайд: ${currentBgSlide + 1}`);
    }
    
    // Предзагрузка изображений для мобильных
    function preloadImages() {
        bgSlides.forEach((slide, index) => {
            const bgImage = slide.style.backgroundImage;
            const imageUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            const img = new Image();
            img.src = imageUrl;
            console.log(`📸 Предзагрузка изображения ${index + 1}: ${imageUrl}`);
        });
    }
    
    // Показываем первый слайд
    bgSlides[0].classList.add('active');
    console.log('✅ Первый слайд активирован');
    
    // Предзагружаем изображения
    preloadImages();
    
    // Запускаем смену слайдов каждые 5 секунд
    const sliderInterval = setInterval(nextBgSlide, 5000);
    
    // Останавливаем слайдер при скрытии страницы (для экономии батареи на мобильных)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(sliderInterval);
        } else {
            // Перезапускаем слайдер при возвращении на страницу
            clearInterval(sliderInterval);
            setInterval(nextBgSlide, 5000);
        }
    });
}

// Управление модальным окном
function openModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация маски телефона
    initPhoneMask();
    
    // Активируем слайдер фото сразу, так как видео закомментировано
    const photoBg = document.querySelector('.photo-bg');
    if (photoBg) {
        photoBg.style.display = 'block';
        startPhotoSlider();
    }
    
    // Обработчик формы
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                company: document.getElementById('company').value.trim()
            };

            console.log('📤 Отправка формы:', formData);

            // Валидация
            if (!formData.name || !formData.phone) {
                alert('Пожалуйста, заполните обязательные поля: Имя и Телефон');
                return;
            }

            // Проверяем что телефон заполнен полностью
            const cleanPhone = formData.phone.replace(/\D/g, '');
            if (cleanPhone.length < 11) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }

            // Показываем индикатор загрузки
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Отправка руководителю...';
            submitButton.disabled = true;

            try {
                console.log('🔄 Отправка заявки руководителю...');
                
                // Отправляем на сервер
                const response = await fetch('sendmail.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData)
                });

                const result = await response.text();
                console.log('📨 Ответ сервера:', response.status, result);
                
                if (response.ok) {
                    alert('✅ Заявка отправлена руководителю! Мы перезвоним вам в течение 15 минут.');
                    closeModal();
                    document.getElementById('contact-form').reset();
                } else {
                    throw new Error(result);
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
                alert('❌ Ошибка отправки. Пожалуйста, позвоните нам: +7 (800) 123-45-67');
            } finally {
                // Восстанавливаем кнопку
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Обработчик клика вне модального окна
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    }
});