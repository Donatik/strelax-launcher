const { ipcRenderer } = require('electron');

// Навигация
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        showSection(targetId);
        setActiveLink(this);
    });
});

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelector(sectionId).classList.add('active');
}

function setActiveLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Управление окном
document.querySelector('.minimize-btn').addEventListener('click', () => {
    ipcRenderer.send('window-minimize');
});

document.querySelector('.close-btn').addEventListener('click', () => {
    ipcRenderer.send('window-close');
});

// Перемещение окна
let isDragging = false;
let mouseStartPosition = { x: 0, y: 0 };

document.querySelector('.draggable-header').addEventListener('mousedown', (e) => {
    isDragging = true;
    mouseStartPosition = { x: e.screenX, y: e.screenY };
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (e) => {
    if(isDragging) {
        const deltaX = e.screenX - mouseStartPosition.x;
        const deltaY = e.screenY - mouseStartPosition.y;
        ipcRenderer.send('window-move', { deltaX, deltaY });
        mouseStartPosition = { x: e.screenX, y: e.screenY };
    }
});

// Настройки
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
            el.classList.remove('active');
        });
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Магазин
document.querySelectorAll('.buy-button').forEach(btn => {
    btn.addEventListener('click', function() {
        showNotification({
            title: 'Покупка',
            message: 'Товар добавлен в корзину',
            type: 'success',
            duration: 3000
        });
    });
});

// Уведомления
function showNotification({ title, message, type = 'info', duration = 5000 }) {
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

    if(duration) {
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    document.getElementById('notificationContainer').appendChild(notification);
}

// Инициализация
showSection('#home');
showNotification({
    title: 'Добро пожаловать!',
    message: 'Strelax Launcher успешно запущен',
    type: 'success',
    duration: 4000
});

// Локализация
const translations = {
    ru: {
        minimize: "Сворачивать после запуска",
        clearCache: "Очистить кэш",
        fixPermissions: "Починить права",
        verifyFiles: "Проверить файлы"
    },
    en: {
        minimize: "Minimize after launch",
        clearCache: "Clear cache",
        fixPermissions: "Fix permissions",
        verifyFiles: "Verify files"
    }
};

// Обработчики новых кнопок
document.getElementById('clearCache').addEventListener('click', () => {
    ipcRenderer.send('clear-cache');
    showNotification({
        title: 'Очистка кэша',
        message: 'Кэш успешно очищен',
        type: 'success'
    });
});

document.getElementById('fixPermissions').addEventListener('click', () => {
    ipcRenderer.send('fix-permissions');
    showNotification({
        title: 'Права доступа',
        message: 'Права успешно восстановлены',
        type: 'success'
    });
});

document.getElementById('verifyFiles').addEventListener('click', () => {
    ipcRenderer.send('verify-files');
    showNotification({
        title: 'Проверка файлов',
        message: 'Проверка целостности запущена',
        type: 'info'
    });
});

// Выбор путей установки
document.getElementById('changeGtaPath').addEventListener('click', async () => {
    const path = await ipcRenderer.invoke('select-directory');
    if(path) document.getElementById('gtaPath').value = path;
});

document.getElementById('changeStrelaxPath').addEventListener('click', async () => {
    const path = await ipcRenderer.invoke('select-directory');
    if(path) document.getElementById('strelaxPath').value = path;
});

// Обновление текстов при смене языка
document.getElementById('languageSelect').addEventListener('change', function() {
    const lang = this.value;
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        el.textContent = translations[lang][key];
    });
});
