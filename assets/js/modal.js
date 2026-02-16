// === МОДАЛЬНОЕ ОКНО ===

// Открыть модальное окно
function openModal() {
    const modal = document.getElementById('appointmentModal');
    const body = document.body;

    modal.classList.add('active');
    body.classList.add('modal-open');

    // Фокус на первое поле
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 300);
}

// Закрыть модальное окно
function closeModal() {
    const modal = document.getElementById('appointmentModal');
    const body = document.body;

    modal.classList.remove('active');
    body.classList.remove('modal-open');
}

// Закрытие по клику на оверлей
document.getElementById('appointmentModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Закрытие по ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// === ОТПРАВКА ФОРМЫ ===
document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Временный лог всех полей формы
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    // Покажем индикатор загрузки
    const submitBtn = form.querySelector('.form-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    fetch('/main_handler.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        console.log('Raw response:', data); // смотрим что реально пришло
        let json;
        try {
            json = JSON.parse(data); // пробуем вручную распарсить JSON
        } catch(err) {
            console.error('JSON parse error:', err);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Записаться на прием';
            showNotification("❌ Сервер вернул некорректный ответ. Попробуйте еще раз.", "error");
            return;
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Записаться на прием';
        showNotification(json.message, json.status === "success" ? "success" : "error");

        if (json.status === "success") {
            form.reset();
            setTimeout(closeModal, 2000);
        }
    })
    .catch(err => {
        console.error('Fetch error:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Записаться на прием';
        showNotification("❌ Ошибка при отправке. Попробуйте еще раз.", "error");
    });
});

// === УВЕДОМЛЕНИЯ ===
function showNotification(message, type) {
    // Удаляем старые уведомления
    const old = document.querySelector('.form-alert');
    if (old) old.remove();

    const div = document.createElement('div');
    div.className = `form-alert ${type}`;
    div.textContent = message;
    document.body.appendChild(div);

    setTimeout(() => div.remove(), 4000);
}

// === КНОПКА ЗАКРЫТИЯ ===
document.getElementById('closeModal').addEventListener('click', closeModal);
