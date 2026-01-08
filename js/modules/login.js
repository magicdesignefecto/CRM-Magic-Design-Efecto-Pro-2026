import { Layout } from '../components/Layout.js';
import { Store } from '../core/store.js';
import { Router } from '../core/router.js';

export const LoginModule = {
    render: async () => {
        return `
            <style>
                .login-container { min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background: #F8FAFC; padding: 20px; box-sizing: border-box; }
                .auth-card { background: white; width: 100%; max-width: 400px; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center; border: 1px solid #E2E8F0; max-height: 90vh; overflow-y: auto; }
                .logo-circle { width: 90px; height: 90px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #F1F5F9; padding: 15px; box-sizing: border-box; }
                h2 { margin: 0 0 10px 0; color: #1E293B; font-weight: 800; font-size: 1.5rem; }
                p { color: #64748B; font-size: 0.9rem; margin: 0 0 25px 0; line-height: 1.5; }
                .input-group { margin-bottom: 15px; text-align: left; position: relative; }
                .input-label { display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 5px; }
                .auth-input { width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 1rem; outline: none; transition: border 0.2s; box-sizing: border-box; }
                .auth-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
                .btn-auth { width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: transform 0.1s; margin-top: 10px; }
                .btn-auth.secondary { background: #fff; color: var(--primary); border: 1px solid var(--primary); margin-top: 0; }
                .auth-links { margin-top: 20px; font-size: 0.85rem; display: flex; flex-direction: column; gap: 8px; }
                .link { color: var(--primary); text-decoration: none; cursor: pointer; font-weight: 500; }
                .link:hover { text-decoration: underline; }
                
                /* VISTAS */
                .auth-view { display: none; animation: fadeIn 0.3s ease; }
                .auth-view.active { display: block; }

                /* OJO PASSWORD */
                .password-wrapper { position: relative; width: 100%; }
                .toggle-password { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #94A3B8; user-select: none; }
                .toggle-password:hover { color: var(--primary); }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            </style>
            
            <div class="login-container">
                <div class="auth-card">
                    <div class="logo-circle">
                        <img src="https://raw.githubusercontent.com/magicdesignefecto/Magic-Design-Efecto-Servicios-Gestion-de-Redes-Sociales/77cbcdf9e5992cc519ac102d1182d9397f23f12a/logo%20svg%20magic%20design%20efecto.svg" alt="Logo" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    
                    <div id="viewLogin" class="auth-view active">
                        <h2>Iniciar Sesión</h2>
                        <p>Bienvenido a Magic CRM.</p>
                        <form id="loginForm">
                            <div class="input-group">
                                <label class="input-label">Correo Electrónico</label>
                                <input type="email" name="email" class="auth-input" required>
                            </div>
                            <div class="input-group">
                                <label class="input-label">Contraseña</label>
                                <div class="password-wrapper">
                                    <input type="password" name="password" id="passwordInput" class="auth-input" required>
                                    <span id="togglePassword" class="toggle-password">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </span>
                                </div>
                            </div>
                            <button type="submit" class="btn-auth">Ingresar</button>
                        </form>
                        <div class="auth-links">
                            <span class="link" onclick="switchView('viewForgot')">¿Olvidaste tu contraseña?</span>
                            <span style="color:#94A3B8;">¿Nuevo aquí? <span class="link" onclick="switchView('viewRequest')">Solicitar Acceso</span></span>
                        </div>
                    </div>

                    <div id="viewForgot" class="auth-view">
                        <h2>Recuperar Cuenta</h2>
                        <p>Te enviaremos un enlace a tu correo.</p>
                        <form onsubmit="event.preventDefault(); alert('Función de recuperación simulada. Revisa tu correo.'); switchView('viewLogin');">
                            <div class="input-group">
                                <label class="input-label">Correo Electrónico</label>
                                <input type="email" class="auth-input" required>
                            </div>
                            <button type="submit" class="btn-auth">Enviar Enlace</button>
                            <button type="button" class="btn-auth secondary" onclick="switchView('viewLogin')" style="margin-top:10px;">Volver</button>
                        </form>
                    </div>

                    <div id="viewRequest" class="auth-view">
                        <h2>Solicitar Acceso</h2>
                        <p>Este es un CRM privado. Contacta al administrador.</p>
                        <div style="text-align:left; background:#F1F5F9; padding:15px; border-radius:8px; margin-bottom:20px; font-size:0.9rem;">
                            <strong>Administrador:</strong> Diego Gonzales<br>
                            <strong>Correo:</strong> admin@magicdesignefecto.com
                        </div>
                        <button type="button" class="btn-auth secondary" onclick="switchView('viewLogin')">Volver al Login</button>
                    </div>

                </div>
            </div>
        `;
    },

    init: async () => {
        // Cargar AuthService
        let AuthService;
        try {
            const module = await import('../services/auth.service.js');
            AuthService = module.AuthService;
        } catch (e) {
            console.error("Error cargando AuthService:", e);
            return;
        }

        // --- FUNCIÓN GLOBAL PARA CAMBIAR VISTAS ---
        window.switchView = (viewId) => {
            document.querySelectorAll('.auth-view').forEach(el => el.classList.remove('active'));
            const el = document.getElementById(viewId);
            if(el) el.classList.add('active');
        };

        // --- LÓGICA DEL OJO ---
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('passwordInput');
        
        if(togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                // Icono
                if (type === 'text') {
                    togglePassword.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
                } else {
                    togglePassword.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
                }
            });
        }

        // --- LÓGICA DE LOGIN ---
        const loginForm = document.getElementById('loginForm');
        if(loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = loginForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                
                btn.innerText = 'Conectando...'; 
                btn.disabled = true;
                
                const email = loginForm.email.value;
                const password = loginForm.password.value;

                try {
                    const firebaseUser = await AuthService.login(email, password);
                    
                    // --- FIX USUARIO UNDEFINED ---
                    const safeName = firebaseUser.displayName || firebaseUser.email.split('@')[0];
                    const appUser = {
                        name: safeName.charAt(0).toUpperCase() + safeName.slice(1), 
                        email: firebaseUser.email,
                        photo: firebaseUser.photoURL,
                        role: 'Admin'
                    };

                    Store.setUser(appUser);

                    // --- NAVEGACIÓN SEGURA ---
                    Router.navigateTo('/dashboard');

                } catch (error) {
                    console.error("Error Login:", error);
                    btn.innerText = originalText;
                    btn.disabled = false;
                    let msg = "Error de acceso.";
                    if(error.code === 'auth/invalid-credential') msg = "Correo o contraseña incorrectos.";
                    alert(msg);
                }
            });
        }
    },

    destroy: () => { delete window.switchView; }
};

