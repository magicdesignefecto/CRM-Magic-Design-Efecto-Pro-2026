import { Store } from '../core/store.js';

export const LoginModule = {
    render: async () => {
        return `
            <style>
                .login-container { min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background: #F8FAFC; padding: 20px; box-sizing: border-box; }
                .auth-card { background: white; width: 100%; max-width: 400px; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center; border: 1px solid #E2E8F0; }
                .logo-circle { width: 90px; height: 90px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #F1F5F9; padding: 15px; }
                h2 { margin: 0 0 10px 0; color: #1E293B; font-weight: 800; font-size: 1.5rem; }
                p { color: #64748B; font-size: 0.9rem; margin: 0 0 25px 0; }
                .input-group { margin-bottom: 15px; text-align: left; }
                .auth-input { width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 1rem; outline: none; box-sizing: border-box; }
                .btn-auth { width: 100%; padding: 12px; background: #2563EB; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 10px; }
                .btn-auth:disabled { background: #94A3B8; cursor: not-allowed; }
            </style>
            
            <div class="login-container">
                <div class="auth-card">
                    <div class="logo-circle">
                         <img src="https://raw.githubusercontent.com/magicdesignefecto/Magic-Design-Efecto-Servicios-Gestion-de-Redes-Sociales/77cbcdf9e5992cc519ac102d1182d9397f23f12a/logo%20svg%20magic%20design%20efecto.svg" alt="Logo" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    <h2>Iniciar Sesión</h2>
                    <p>Bienvenido a Magic CRM.</p>
                    <form id="loginForm">
                        <div class="input-group">
                            <label style="display:block; font-size:0.8rem; font-weight:600; color:#475569; margin-bottom:5px;">Correo Electrónico</label>
                            <input type="email" name="email" class="auth-input" required>
                        </div>
                        <div class="input-group">
                            <label style="display:block; font-size:0.8rem; font-weight:600; color:#475569; margin-bottom:5px;">Contraseña</label>
                            <input type="password" name="password" class="auth-input" required>
                        </div>
                        <button type="submit" class="btn-auth">Ingresar</button>
                    </form>
                </div>
            </div>
        `;
    },

    init: async () => {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = loginForm.querySelector('button');
                btn.innerText = 'Conectando...';
                btn.disabled = true;

                const email = loginForm.email.value;
                const password = loginForm.password.value;

                try {
                    // Importamos Auth aquí para asegurar que cargue
                    const { AuthService } = await import('../services/auth.service.js');
                    const firebaseUser = await AuthService.login(email, password);
                    
                    // Guardamos sesión
                    const safeName = firebaseUser.displayName || firebaseUser.email.split('@')[0];
                    Store.setUser({
                        name: safeName.charAt(0).toUpperCase() + safeName.slice(1),
                        email: firebaseUser.email,
                        photo: firebaseUser.photoURL,
                        role: 'Admin'
                    });

                    // --- SOLUCIÓN AL BLOQUEO DE LOGIN ---
                    // Forzamos la recarga hacia el dashboard. Esto NO falla.
                    console.log("Redirigiendo...");
                    window.location.href = '/CRM-Magic-Design-Efecto-Pro-2026/dashboard';

                } catch (error) {
                    console.error("Error Login:", error);
                    btn.innerText = 'Ingresar';
                    btn.disabled = false;
                    alert("Error: Verifica tu correo y contraseña.");
                }
            });
        }
    }
};
