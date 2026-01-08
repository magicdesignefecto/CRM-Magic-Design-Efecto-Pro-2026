import { Store } from './core/store.js';
import { AuthService } from './services/auth.service.js';
import { Router } from './core/router.js';
import { Layout } from './components/Layout.js';

// Importar Módulos
import { LoginModule } from './modules/login.js'; // <--- IMPORTANTE
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
        await LoginModule.init();
        return; // Detenemos la ejecución aquí
    }

    // 3. Si HAY usuario, buscamos la ruta solicitada
    // --- FIX GITHUB: Limpiamos la ruta para que funcione en la carpeta del proyecto ---
    let path = window.location.pathname.replace('/magic-crm-pro-2026', '');
    if (path === '') path = '/';
    
    const module = routes[path] || Dashboard;

    // 4. Renderizar el Módulo dentro del Layout (con menú lateral)
    // Nota: Los módulos ahora devuelven el HTML completo ya procesado por Layout.render
    // O si el módulo usa Layout internamente, lo llamamos.
    
    // Ejecutamos el render del módulo
    contentDiv.innerHTML = await module.render();
    
    // Inicializamos la lógica del módulo (listeners, gráficas, etc.)
    if (module.init) {
        await module.init();
    }
};

// Escuchar navegación
window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);

// Exponer navegación global para los enlaces del menú
document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
        e.preventDefault();
        Router.navigateTo(e.target.href);
        router(); // Forzar actualización manual
    }
    // Soporte para clics dentro de iconos SVG en los enlaces
    else if (e.target.closest('[data-link]')) {
        e.preventDefault();
        Router.navigateTo(e.target.closest('[data-link]').href);
        router();
    }
});

// Escuchar evento de Login/Logout para recargar la vista
import { PubSub } from './core/pubsub.js';
PubSub.subscribe('AUTH_CHANGED', () => {
    router();
});