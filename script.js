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

// ОБРАБОТЧИК ФОРМЫ - ОБНОВЛЕННЫЙ
document.getElementById('contact-form').addEventListener('submit', async function(e) {
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

// Слайдер фоновых фото
const videoBg = document.querySelector('.video-bg');
const photoBg = document.querySelector('.photo-bg');

videoBg.addEventListener('error', function() {
    console.log('Видео не доступно, включаем фото-фон');
    photoBg.style.display = 'block';
    startPhotoSlider();
});

function startPhotoSlider() {
    let currentBgSlide = 0;
    const bgSlides = document.querySelectorAll('.bg-slide');
    
    function nextBgSlide() {
        bgSlides[currentBgSlide].classList.remove('active');
        currentBgSlide = (currentBgSlide + 1) % bgSlides.length;
        bgSlides[currentBgSlide].classList.add('active');
    }
    
    setInterval(nextBgSlide, 5000);
}

// Управление модальным окном
function openModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Изначальная проверка видео
if (videoBg.readyState === 0) {
    photoBg.style.display = 'block';
    startPhotoSlider();
}

// Инициализация маски телефона после загрузки
document.addEventListener('DOMContentLoaded', function() {
    initPhoneMask();
});