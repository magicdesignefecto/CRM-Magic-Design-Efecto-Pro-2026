import { Store } from './core/store.js';
import { AuthService } from './services/auth.service.js';
import { Router } from './core/router.js';
import { Layout } from './components/Layout.js';
import { Config } from './core/config.js'; // <--- IMPORTAMOS EL CEREBRO

// Módulos
import { LoginModule } from './modules/login.js';
import { Dashboard } from './modules/dashboard.js';
import { LeadsModule } from './modules/leads.js';
import { ClientsModule } from './modules/clients.js';
import { PipelineModule } from './modules/pipeline.js';
import { QuotesModule } from './modules/quotes.js';
import { ProjectsModule } from './modules/projects.js';
import { CalendarModule } from './modules/calendar.js';
import { ReportsModule } from './modules/reports.js';
import { GoalsModule } from './modules/goals.js';
import { SettingsModule } from './modules/settings.js';

const routes = {
    '/': Dashboard,
    '/dashboard': Dashboard,
    '/leads': LeadsModule,
    '/clients': ClientsModule,
    '/pipeline': PipelineModule,
    '/quotes': QuotesModule,
    '/projects': ProjectsModule,
    '/calendar': CalendarModule,
    '/reports': ReportsModule,
    '/goals': GoalsModule,
    '/settings': SettingsModule
};

const router = async () => {
    // Inicializar Auth Listener una sola vez
    if (!window.authInitialized) {
        AuthService.initAuthListener();
        window.authInitialized = true;
    }

    const contentDiv = document.getElementById('app');
    Store.init(); // Ahora protegido con try-catch
    const user = Store.getState().user;
    
    // Obtenemos la ruta base automáticamente (Local o GitHub)
    const BASE_PATH = Config.getBasePath();

    // --- LIMPIEZA DE RUTA INTELIGENTE ---
    let path = window.location.pathname;
    
    // Si la ruta empieza con la base (ej: /CRM-Magic...), la quitamos para saber qué modulo cargar
    if (BASE_PATH && path.startsWith(BASE_PATH)) {
        path = path.replace(BASE_PATH, '');
    }
    
    // Limpieza extra
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    if (path === '') path = '/';

    console.log("Ruta detectada:", path);

    // --- PROTECCIÓN DE SESIÓN ---
    if (!user) {
        // Si no hay usuario y no estamos en login, mandar a login
        if (path !== '/' && path !== '/index.html') {
            window.history.replaceState({}, '', BASE_PATH + '/');
            path = '/';
        }
        contentDiv.innerHTML = await LoginModule.render();
        if (LoginModule.init) await LoginModule.init();
        return;
    }

    // --- CARGA DE MÓDULO ---
    const module = routes[path] || Dashboard;

    // Renderizamos Layout + Módulo
    try {
        // Pasamos el contenido del módulo al Layout
        // Nota: Layout.render ahora espera HTML string, no el módulo en sí
        const moduleContent = await module.render();
        const pageTitle = path.replace('/', '').toUpperCase() || 'DASHBOARD';
        
        contentDiv.innerHTML = Layout.render(moduleContent, pageTitle);
        
        // Inicializamos Layout (sidebar, logout) y luego el Módulo
        if (Layout.init) await Layout.init();
        if (module.init) await module.init();

    } catch (error) {
        console.error("Error renderizando:", error);
        contentDiv.innerHTML = "<h2>Error cargando la aplicación.</h2>";
    }
};

window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);

// --- NAVEGACIÓN GLOBAL MEJORADA ---
document.body.addEventListener('click', e => {
    const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
    if (link) {
        e.preventDefault();
        const route = link.getAttribute('href'); // Es la ruta interna (ej: /leads)
        
        // Construimos la URL real (Base + Ruta)
        const fullUrl = Config.getBasePath() + route;
        
        window.history.pushState({}, "", fullUrl);
        router();
    }
});
