/* ============================================================
   guard.js — Проверка авторизации на защищённых страницах
   Подключать на dashboard.html и любых других приватных страницах.
   ============================================================ */

   (function () {
    const SESSION_KEY = 'practice_session';
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');

    // Если сессии нет — отправляем на страницу входа
    if (!session) {
        window.location.replace('login.html');
    }
})();