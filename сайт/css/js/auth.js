/* ============================================================
   auth.js — Регистрация, вход, выход, работа с localStorage
   ============================================================ */

   const USERS_KEY = 'practice_users';
   const SESSION_KEY = 'practice_session';
   
   /* -------- Утилиты -------- */
   function getUsers() {
       return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
   }
   
   function saveUsers(users) {
       localStorage.setItem(USERS_KEY, JSON.stringify(users));
   }
   
   function setSession(email) {
       localStorage.setItem(SESSION_KEY, JSON.stringify({ email, loginAt: Date.now() }));
   }
   
   function getSession() {
       return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
   }
   
   function clearSession() {
       localStorage.removeItem(SESSION_KEY);
   }
   
   /* -------- Проверка, что пароль не пустой и не слишком простой -------- */
   function validatePassword(pwd) {
       if (!pwd || pwd.length < 6) {
           return 'Пароль должен быть не короче 6 символов.';
       }
       return '';
   }
   
   /* ============================================================
      РЕГИСТРАЦИЯ
      ============================================================ */
   const registerForm = document.getElementById('registerForm');
   if (registerForm) {
       registerForm.addEventListener('submit', (e) => {
           e.preventDefault();
           const errorBox = document.getElementById('registerError');
           errorBox.textContent = '';
   
           const data = new FormData(registerForm);
           const fullname = (data.get('fullname') || '').trim();
           const email    = (data.get('email') || '').trim().toLowerCase();
           const password = data.get('password') || '';
           const group    = (data.get('group') || '').trim();
   
           // Валидация
           if (fullname.length < 3) {
               errorBox.textContent = 'Введите корректное ФИО.';
               return;
           }
           if (!/^\S+@\S+\.\S+$/.test(email)) {
               errorBox.textContent = 'Введите корректный email.';
               return;
           }
           const pwdError = validatePassword(password);
           if (pwdError) {
               errorBox.textContent = pwdError;
               return;
           }
           if (!group) {
               errorBox.textContent = 'Укажите группу.';
               return;
           }
   
           const users = getUsers();
           if (users.some(u => u.email === email)) {
               errorBox.textContent = 'Пользователь с таким email уже зарегистрирован.';
               return;
           }
   
           users.push({ fullname, email, password, group, createdAt: Date.now() });
           saveUsers(users);
           setSession(email);
   
           // Переход в личный кабинет
           window.location.href = 'dashboard.html';
       });
   }
   
   /* ============================================================
      ВХОД
      ============================================================ */
   const loginForm = document.getElementById('loginForm');
   if (loginForm) {
       loginForm.addEventListener('submit', (e) => {
           e.preventDefault();
           const errorBox = document.getElementById('loginError');
           errorBox.textContent = '';
   
           const data = new FormData(loginForm);
           const email    = (data.get('email') || '').trim().toLowerCase();
           const password = data.get('password') || '';
   
           const user = getUsers().find(u => u.email === email && u.password === password);
           if (!user) {
               errorBox.textContent = 'Неверный email или пароль.';
               return;
           }
   
           setSession(email);
           window.location.href = 'dashboard.html';
       });
   }
   
   /* ============================================================
      КНОПКА ВЫХОДА
      ============================================================ */
   const logoutBtn = document.getElementById('logoutBtn');
   if (logoutBtn) {
       logoutBtn.addEventListener('click', (e) => {
           e.preventDefault();
           clearSession();
           window.location.href = 'index.html';
       });
   }
   
   /* ============================================================
      ЗАПОЛНЕНИЕ ЛИЧНОГО КАБИНЕТА
      ============================================================ */
   if (document.getElementById('userName')) {
       const session = getSession();
       if (session) {
           const user = getUsers().find(u => u.email === session.email);
           if (user) {
               const firstName = user.fullname.split(' ')[1] || user.fullname.split(' ')[0];
               document.getElementById('userName').textContent = firstName;
               document.getElementById('userFullName').textContent = user.fullname;
               document.getElementById('userEmail').textContent = user.email;
               document.getElementById('userGroup').textContent = user.group;
   
               // ----- Чек-лист прогресса -----
               const progressKey = 'practice_progress_' + user.email;
               const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
               document.querySelectorAll('.checklist input[data-key]').forEach(cb => {
                   cb.checked = !!progress[cb.dataset.key];
                   cb.addEventListener('change', () => {
                       progress[cb.dataset.key] = cb.checked;
                       localStorage.setItem(progressKey, JSON.stringify(progress));
                   });
               });
           }
       }
   }