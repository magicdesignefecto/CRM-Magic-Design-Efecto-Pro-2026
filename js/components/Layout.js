import { Store } from '../core/store.js';
import { Router } from '../core/router.js';
import { TasksService } from '../services/tasks.service.js'; 
import { Formatters } from '../utils/formatters.js';

export const Layout = {
    render: (content, title = 'CRM') => {
        // 1. Obtener usuario de forma segura
        const user = Store.getState().user || { name: 'Usuario', role: 'Invitado' };
        
        // 2. Calcular iniciales (Evita el error de pantalla blanca)
        const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';

        return `
        <div class="app-layout">
            <aside class="sidebar" id="sidebar">
                <div class="logo-area">
                    <div class="logo-circle">
                        <img src="https://raw.githubusercontent.com/magicdesignefecto/Magic-Design-Efecto-Servicios-Gestion-de-Redes-Sociales/77cbcdf9e5992cc519ac102d1182d9397f23f12a/logo%20svg%20magic%20design%20efecto.svg" alt="Logo" style="width:45px; height:45px; object-fit:contain;">
                    </div>
                    <span class="logo-text">Magic CRM</span>
                </div>
                
                <nav class="nav-links">
                    <a href="/dashboard" class="nav-item ${window.location.pathname === '/dashboard' || window.location.pathname === '/' ? 'active' : ''}" data-link>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        <span>Dashboard</span>
                    </a>
                    <a href="/leads" class="nav-item ${window.location.pathname === '/leads' ? 'active' : ''}" data-link>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                        <span>Leads</span>
                    </a>
                    <a href="/clients" class="nav-item ${window.location.pathname === '/clients' ? 'active' : ''}" data-link>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span>Clientes</span>
                    </a>
                    <a href="/pipeline" class="nav-item ${window.location.pathname === '/pipeline' ? 'active' : ''}" data-link>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        <span>Pipeline</span>
                    </a>
                    <a href="/quotes" class="nav-item ${window.location.pathname === '/quotes' ? 'active' : ''}" data-link>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <span>Cotizaciones</span>
                    </a>
                    <a href="/projects" class="nav-item ${window.location.pathname === '/projects' ? 'active' : ''}" data-link>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <span>Proyectos</span>
                    </a>
                    <a href="/calendar" class="nav-item ${window.location.pathname === '/calendar' ? 'active' : ''}" data-link>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>Calendario</span>
                    </a>
                    <a href="/reports" class="nav-item ${window.location.pathname === '/reports' ? 'active' : ''}" data-link>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                        <span>Reportes</span>
                    </a>
                    <a href="/goals" class="nav-item ${window.location.pathname === '/goals' ? 'active' : ''}" data-link>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                        <span>Metas</span>
                    </a>
                    <a href="/settings" class="nav-item ${window.location.pathname === '/settings' ? 'active' : ''}" data-link>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        <span>Configuración</span>
                    </a>
                </nav>
            </aside>

            <div class="main-wrapper">
                
                <header class="top-bar">
                    <div class="header-left">
                        <button id="menuToggle" class="menu-toggle">☰</button>
                        <h2 class="page-title">${title}</h2>
                    </div>
                    
                    <div class="header-right" style="display:flex; align-items:center; gap:15px;">
                        
                        <div class="user-capsule">
                            <div class="user-meta">
                                <span class="u-name">${user.name}</span>
                                <span class="u-divider">|</span>
                                <span class="u-role">${user.role}</span>
                            </div>
                            <div class="user-avatar">
                                ${initials}
                            </div>
                        </div>

                        <button id="btnLogout" class="btn-logout" title="Cerrar Sesión">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </button>
                    </div>
                </header>

                <main class="content-scroll-area">
                    <div class="content-container">
                        ${content}
                    </div>
                </main>
            </div>
        </div>

        <style>
            /* BASE */
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; overflow: hidden; font-family: 'Segoe UI', system-ui, sans-serif; background-color: #F8F9FA; }
            
            .app-layout { display: flex; width: 100vw; height: 100vh; }

            /* ESTILO BOTÓN LOGOUT */
            .btn-logout {
                background: #FEE2E2; 
                color: #EF4444; 
                border: none;
                width: 36px; height: 36px;
                border-radius: 8px;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.2s;
            }
            .btn-logout:hover {
                background: #EF4444;
                color: white;
                transform: scale(1.05);
            }

            /* ESTILO CÁPSULA USUARIO */
            .user-capsule {
                display: flex;
                align-items: center;
                gap: 12px;
                background: white;
                padding: 4px 4px 4px 16px;
                border: 1px solid #E2E8F0;
                border-radius: 50px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.04);
            }
            .user-meta { display: flex; align-items: center; gap: 8px; }
            .u-name { font-weight: 700; color: #1E293B; font-size: 0.9rem; white-space: nowrap; }
            .u-divider { color: #CBD5E1; font-size: 0.8rem; }
            .u-role { font-size: 0.75rem; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
            
            .user-avatar {
                width: 34px; height: 34px;
                background: var(--primary); 
                color: white; 
                border-radius: 50%; 
                display: flex; align-items: center; justify-content: center; 
                font-weight: 700; font-size: 0.85rem;
            }

            /* RESPONSIVE MÓVIL */
            @media (max-width: 768px) {
                .user-capsule { padding: 0; border: none; background: transparent; box-shadow: none; }
                .user-meta { display: none; } /* Ocultar texto en móvil */
                .header-right { gap: 10px; }
            }

            /* SIDEBAR */
            .sidebar { width: 260px; background: white; border-right: 1px solid #E5E7EB; display: flex; flex-direction: column; flex-shrink: 0; z-index: 50; transition: transform 0.3s ease; }
            .logo-area { height: 64px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #F3F4F6; gap: 10px; }
            .logo-text { font-weight: 800; font-size: 1.1rem; color: #111; letter-spacing: -0.5px; }
            .nav-links { padding: 20px 16px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
            .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; color: #64748B; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 0.95rem; transition: all 0.2s; }
            .nav-item:hover { background: #F1F5F9; color: #0F172A; }
            .nav-item.active { background: #EFF6FF; color: var(--primary); font-weight: 600; }

            /* MAIN WRAPPER */
            .main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }

            /* TOPBAR */
            .top-bar { height: 64px; width: 100%; background: white; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; padding: 0 24px; flex-shrink: 0; }
            .header-left { display: flex; align-items: center; gap: 16px; overflow: hidden; }
            .menu-toggle { display: none; background: none; border: none; cursor: pointer; padding: 0; color: #64748B; }
            .page-title { margin: 0; font-size: 1.25rem; font-weight: 700; color: #1E293B; white-space: nowrap; }
            
            /* SCROLL AREA */
            .content-scroll-area { flex: 1; overflow-y: auto; overflow-x: hidden; }
            .content-container { padding: 24px; max-width: 100%; margin: 0 auto; width: 100%; }

            /* MÓVIL */
            @media (max-width: 768px) {
                .sidebar { position: fixed; height: 100%; top: 0; left: 0; transform: translateX(-100%); box-shadow: 0 0 25px rgba(0,0,0,0.15); }
                .sidebar.active { transform: translateX(0); }
                .menu-toggle { display: block; }
                .top-bar { padding: 0 16px; }
                .page-title { font-size: 1.1rem; }
            }
        </style>
        `;
    },

    init: async () => {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        // Cierre de menú móvil al hacer clic fuera
        document.addEventListener('click', (e) => {
            if(window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                if(!sidebar.contains(e.target) && !menuToggle.contains(e.target)) sidebar.classList.remove('active');
            }
        });

        if(menuToggle) menuToggle.addEventListener('click', (e) => { e.stopPropagation(); sidebar.classList.toggle('active'); });

        // --- LÓGICA DE CIERRE DE SESIÓN (CORREGIDA) ---
        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', async () => {
                if (confirm('¿Cerrar sesión?')) {
                    try {
                        // Importamos el servicio real para desconectar de Firebase
                        const { AuthService } = await import('../services/auth.service.js');
                        await AuthService.logout(); 
                        // El servicio ya se encarga de redirigir
                    } catch (error) {
                        console.error("Error al salir:", error);
                        // Si falla, forzamos salida manual
                        Store.setUser(null);
                        window.location.href = '/';
                    }
                }
            });
        }
    }
};