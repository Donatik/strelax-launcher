// Функция показа уведомлений
function showNotification({ title, message, type = 'info', duration = 5000, onClick = null }) {
    const icons = {
        info: 'fa-circle-info',
        success: 'fa-circle-check',
        warning: 'fa-triangle-exclamation',
        error: 'fa-circle-xmark'
    };

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fa-solid ${icons[type]} notification-icon"></i>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    });

    if (onClick) {
        notification.style.cursor = 'pointer';
        notification.addEventListener('click', onClick);
    }

    if (duration) {
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    document.getElementById('notificationContainer').appendChild(notification);
}

// Примеры использования:
showNotification({
    title: 'Добро пожаловать!',
    message: 'Вы успешно авторизованы в системе',
    type: 'success',
    duration: 4000
});

// Плавная прокрутка для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Обработчик внешних ссылок
        document.querySelectorAll('.external-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(this.href, '_blank');
            });
        });

        // Обработчик кнопки "Играть"
        document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', function() {
                this.textContent = 'Подключение...';
                this.disabled = true;
                setTimeout(() => {
                    this.textContent = '▶ Играть';
                    this.disabled = false;
                    alert('Не удалось подключиться к серверу');
                }, 2000);
            });
        });

// Обработчик внешних ссылок с уведомлением
document.querySelectorAll('.external-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification({
            title: 'Открытие ссылки',
            message: 'Вы будете перенаправлены на внешний ресурс',
            type: 'warning',
            duration: 3000
        });
        setTimeout(() => window.open(this.href, '_blank'), 1000);
    });
});
