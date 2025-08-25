const { ipcRenderer } = require('electron');

ipcRenderer.on('update-progress', (event, data) => {
    document.querySelector('.status-message').textContent = data.message;
    document.querySelector('.progress').style.width = `${data.percent}%`;
});

ipcRenderer.on('update-error', (event, error) => {
    document.querySelector('.status-message').textContent = `Ошибка: ${error}`;
    document.querySelector('.spinner').style.display = 'none';
});

ipcRenderer.on('update-complete', () => {
    setTimeout(() => {
        window.close();
    }, 2000);
});
