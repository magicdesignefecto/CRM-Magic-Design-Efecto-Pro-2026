import { Store } from '../core/store.js';
import { AuthService } from '../services/auth.service.js';

export const LoginModule = {
    render: async () => {
        return `
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
                .login-container { min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background: #F8FAFC; padding: 20px; box-sizing: border-box; }
                .auth-card { background: white; width: 100%; max-width: 420px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #E2E8F0; }
                
                /* TABS */
                .auth-tabs { display: flex; border-bottom: 1px solid #E2E8F0; background: #F1F5F9; }
                .tab-btn { flex: 1; padding: 15px; border: none; background: none; font-weight: 600; color: #64748B; cursor: pointer; transition: 0.3s; }
                .tab-btn.active { background: white; color: #2563EB; border-bottom: 2px solid #2563EB; }
                
                .auth-content { padding: 30px; text-align: center; }
                .logo-circle { width: 80px; height: 80px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #F1F5F9; padding: 10px; }
                
                .input-group { margin-bottom: 15px; text-align: left; position: relative; }
                .input-label { display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 5px; }
                .auth-input { width: 100%; padding: 12px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; }
                
                .password-wrapper { position: relative; }
                .toggle-pass { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #64748B; cursor: pointer; }
                
                .btn-auth { width: 100%; padding: 12px; background: #2563EB; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 10px; }
                .btn-auth:hover { background: #1D4ED8; }
                
                .forgot-link { display: block; text-align: right; margin-top: 10px; color: #2563EB; font-size: 0.85rem; text-decoration: none; cursor: pointer; }
                .hidden { display: none; }
            </style>
            
            <div class="login-container">
                <div class="auth-card">
                    <div class="auth-tabs">
                        <button class="tab-btn active" id="tabLogin">Ingresar</button>
                        <button class="tab-btn" id="tabRegister">Registrarse</button>
                    </div>

                    <div class="auth-content">
                        <div class="logo-circle">
                             <img src="https://raw.githubusercontent.com/magicdesignefecto/Magic-Design-Efecto-Servicios-Gestion-de-Redes-Sociales/77cbcdf9e5992cc519ac102d1182d9397f23f12a/logo%20svg%20magic%20design%20efecto.svg" alt="Logo" style="width:100%; height:100%; object-fit:contain;">
                        </div>

                        <form id="loginForm">
                            <h2 style="margin:0 0 15px 0; color:#1E293B;">Bienvenido</h2>
                            <div class="input-group">
                                <label class="input-label">Correo Electrónico</label>
                                <input type="email" id="loginEmail" class="auth-input" required>
                            </div>
                            <div class="input-group">
                                <label class="input-label">Contraseña</label>
                                <div class="password-wrapper">
                                    <input type="password" id="loginPass" class="auth-input" required>
                                    <button type="button" class="toggle-pass" onclick="toggleVisibility('loginPass')">👁️</button>
                                </div>
                            </div>
                            <button type="submit" class="btn-auth">Ingresar</button>
                            <a class="forgot-link" id="btnForgot">¿Olvidaste tu contraseña?</a>
                        </form>

                        <form id="registerForm" class="hidden">
                            <h2 style="margin:0 0 15px 0; color:#1E293B;">Crear Cuenta</h2>
                            <div class="input-group">
                                <label class="input-label">Nombre Completo</label>
                                <input type="text" id="regName" class="auth-input" required placeholder="Tu Nombre">
                            </div>
                            <div class="input-group">
                                <label class="input-label">Correo (Gmail recomendado)</label>
                                <input type="email" id="regEmail" class="auth-input" required>
                            </div>
                            <div class="input-group">
                                <label class="input-label">WhatsApp</label>
                                <input type="tel" id="regPhone" class="auth-input" placeholder="+591..." required>
                            </div>
                            <div class="input-group">
                                <label class="input-label">Cargo</label>
                                <input type="text" id="regRole" class="auth-input" placeholder="Ej: Ventas">
                            </div>
                            <div class="input-group">
                                <label class="input-label">Contraseña</label>
                                <div class="password-wrapper">
                                    <input type="password" id="regPass" class="auth-input" required>
                                    <button type="button" class="toggle-pass" onclick="toggleVisibility('regPass')">👁️</button>
                                </div>
                            </div>
                            <button type="submit" class="btn-auth">Registrarse</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    init: async () => {
        const tabLogin = document.getElementById('tabLogin');
        const tabRegister = document.getElementById('tabRegister');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        window.toggleVisibility = (id) => {
            const input = document.getElementById(id);
            input.type = input.type === 'password' ? 'text' : 'password';
        };

        if(tabLogin && tabRegister) {
            tabLogin.addEventListener('click', () => {
                tabLogin.classList.add('active');
                tabRegister.classList.remove('active');
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            });

            tabRegister.addEventListener('click', () => {
                tabRegister.classList.add('active');
                tabLogin.classList.remove('active');
                registerForm.classList.remove('hidden');
                loginForm.classList.add('hidden');
            });
        }

        // --- LÓGICA DE LOGIN CON ALERTAS PRO ---
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = loginForm.querySelector('button');
                btn.innerText = 'Entrando...';
                btn.disabled = true;

                try {
                    const email = document.getElementById('loginEmail').value;
                    const pass = document.getElementById('loginPass').value;
                    
                    await AuthService.login(email, pass);
                    
                    // Alerta de éxito sutil
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    
                    Toast.fire({
                        icon: 'success',
                        title: '¡Bienvenido de nuevo!'
                    });

                    window.location.hash = '#/dashboard';
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Acceso',
                        text: 'El correo o la contraseña son incorrectos.',
                        confirmButtonColor: '#2563EB'
                    });
                    btn.innerText = 'Ingresar';
                    btn.disabled = false;
                }
            });
        }

        // --- LÓGICA DE REGISTRO CON WHATSAPP ---
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = registerForm.querySelector('button');
                btn.innerText = 'Registrando...';
                btn.disabled = true;

                try {
                    const name = document.getElementById('regName').value;
                    const email = document.getElementById('regEmail').value;
                    const pass = document.getElementById('regPass').value;
                    const phone = document.getElementById('regPhone').value;
                    const role = document.getElementById('regRole').value;
                    
                    // 1. Crear usuario en Firebase
                    await AuthService.register(email, pass, name);

                    // 2. Preparar mensaje de WhatsApp para TI
                    const adminPhone = "59160000000"; // <--- ¡CAMBIA ESTO POR TU NÚMERO REAL!
                    const text = `Hola Diego, soy *${name}*.%0A%0AAcabo de registrarme en Magic CRM.%0A📧 Correo: ${email}%0A📱 Celular: ${phone}%0A💼 Cargo: ${role}%0A%0ASolicito activación. Gracias.`;
                    const waLink = `https://wa.me/${adminPhone}?text=${text}`;

                    // 3. Alerta Pro con botón de WhatsApp
                    await Swal.fire({
                        title: '¡Cuenta Creada!',
                        text: "Para activar tu cuenta, notifica al administrador por WhatsApp.",
                        icon: 'success',
                        showCancelButton: true,
                        confirmButtonColor: '#25D366',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: '<i class="fab fa-whatsapp"></i> Notificar a Diego',
                        cancelButtonText: 'Ir al Dashboard'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.open(waLink, '_blank');
                        }
                    });

                    window.location.hash = '#/dashboard';

                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar',
                        text: error.message,
                        confirmButtonColor: '#2563EB'
                    });
                    btn.innerText = 'Registrarse';
                    btn.disabled = false;
                }
            });
        }

        // Recuperar Contraseña Pro
        const btnForgot = document.getElementById('btnForgot');
        if(btnForgot) {
            btnForgot.addEventListener('click', async () => {
                const { value: email } = await Swal.fire({
                    title: 'Recuperar Contraseña',
                    input: 'email',
                    inputLabel: 'Ingresa tu correo registrado',
                    inputPlaceholder: 'tu@correo.com',
                    showCancelButton: true,
                    confirmButtonColor: '#2563EB',
                    confirmButtonText: 'Enviar enlace'
                });

                if (email) {
                    try {
                        await AuthService.resetPassword(email);
                        Swal.fire('¡Enviado!', 'Revisa tu correo para restablecer tu contraseña.', 'success');
                    } catch (error) {
                        Swal.fire('Error', error.message, 'error');
                    }
                }
            });
        }
    }
};
