import { Store } from './core/store.js';
import { AuthService } from './services/auth.service.js';
import { Router } from './core/router.js';
import { Layout } from './components/Layout.js';
import { PubSub } from './core/pubsub.js'; // Asegúrate de importar esto arriba si lo usas abajo

// Importar Módulos
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

// Mapa de Rutas
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

// Función principal que controla la App
const router = async () => {
    // --- INICIO CÓDIGO NUEVO ---
    // Iniciamos el escuchador de Firebase una sola vez
    if (!window.authInitialized) {
        AuthService.initAuthListener();
        window.authInitialized = true;
    }
    // --- FIN CÓDIGO NUEVO ---

    const contentDiv = document.getElementById('app');
    
    // 1. Intentar recuperar sesión guardada
    Store.init();
    const user = Store.getState().user;

    // 2. PROTECCIÓN: Si NO hay usuario, forzar Login
    if (!user) {
        // Limpiamos la URL visualmente a '/' sin recargar
        if (window.location.pathname !== '/') {
            window.history.replaceState({}, '', '/');
        }
        
        // Renderizamos el Login directamente (sin Layout de menú lateral)
        contentDiv.innerHTML = await LoginModule.render();
        if (LoginModule.init) await LoginModule.init();
        return; // Detenemos la ejecución aquí
    }

    // 3. Si HAY usuario, buscamos la ruta solicitada
    // --- FIX GITHUB: Usamos el nombre REAL del repositorio (Mayúsculas importan) ---
    let path = window.location.pathname.replace('/CRM-Magic-Design-Efecto-Pro-2026', '');
    
    if (path === '') path = '/';
    
    const module = routes[path] || Dashboard;

    // 4. Renderizar el Módulo
    contentDiv.innerHTML = await module.render();
    
    // Inicializamos la lógica del módulo
    if (module.init) {
        await module.init();
    }
};

// Escuchar navegación
window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);

// Exponer navegación global para los enlaces del menú
document.body.addEventListener('click', e => {
    // 1. Detectar si el clic fue en un enlace o dentro de uno (icono)
    // Esto YA CUBRE los iconos SVG gracias a .closest()
    const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');

    if (link) {
        e.preventDefault(); // Evitamos que recargue la página
        
        // 2. CORRECCIÓN: Usamos getAttribute para obtener SOLO la ruta interna (ej: '/leads')
        // y NO la URL completa con https://... (que es lo que rompe GitHub Pages)
        const href = link.getAttribute('href'); 
        
        Router.navigateTo(href);
        router(); // Forzamos la actualización de la vista
    }
});

// Escuchar evento de Login/Logout para recargar la vista
PubSub.subscribe('AUTH_CHANGED', () => {
    router();
});

