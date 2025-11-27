// Функция для отправки сообщения в Telegram
async function sendToTelegram(formData) {
  const botToken = "YOUR_BOT_TOKEN"; // Замените на токен вашего бота
  const chatId = "YOUR_CHAT_ID"; // Замените на ID чата/канала

  const message = `📩 Новая заявка с сайта Harvester Energy

👤 Имя: ${formData.name}
📞 Телефон: ${formData.phone}
💬 Сообщение: ${formData.message || "Не указано"}

🕒 Время: ${new Date().toLocaleString("ru-RU")}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error("Ошибка отправки в Telegram:", error);
    return false;
  }
}

// Обновите обработчик формы
document
  .getElementById("contact-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    // Валидация
    if (!formData.name || !formData.phone) {
      alert("Пожалуйста, заполните обязательные поля: Имя и Телефон");
      return;
    }

    // Показываем индикатор загрузки
    const submitButton = this.querySelector(".submit-button");
    const originalText = submitButton.textContent;
    submitButton.textContent = "Отправка...";
    submitButton.disabled = true;

    try {
      // Отправляем в Telegram
      const telegramSuccess = await sendToTelegram(formData);

      if (telegramSuccess) {
        alert("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
        closeModal();
        document.getElementById("contact-form").reset();
      } else {
        alert(
          "Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами другим способом."
        );
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.");
    } finally {
      // Восстанавливаем кнопку
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
        // Проверка поддержки видео и загрузки
        const videoBg = document.querySelector('.video-bg');
        const photoBg = document.querySelector('.photo-bg');
        
        videoBg.addEventListener('error', function() {
            // Если видео не загрузилось, показываем фото-фон
            console.log('Видео не доступно, включаем фото-фон');
            photoBg.style.display = 'block';
            startPhotoSlider();
        });
        
        videoBg.addEventListener('canplay', function() {
            // Видео доступно, скрываем фото-фон
            photoBg.style.display = 'none';
        });

        // Слайдер фоновых фото (только если видео недоступно)
        function startPhotoSlider() {
            let currentBgSlide = 0;
            const bgSlides = document.querySelectorAll('.bg-slide');
            
            function nextBgSlide() {
                bgSlides[currentBgSlide].classList.remove('active');
                currentBgSlide = (currentBgSlide + 1) % bgSlides.length;
                bgSlides[currentBgSlide].classList.add('active');
            }
            
            // Смена фона каждые 5 секунд
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

        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };

            console.log('Данные формы:', formData);
            
            alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            closeModal();
            
            document.getElementById('contact-form').reset();
        });

        // Изначально проверяем, доступно ли видео
        if (videoBg.readyState === 0) {
            // Видео еще не начало загружаться
            photoBg.style.display = 'block';
            startPhotoSlider();
        }