import { Store } from './core/store.js';
import { AuthService } from './services/auth.service.js';
import { Router } from './core/router.js';
import { Layout } from './components/Layout.js';

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

// --- CONFIGURACIÓN CRÍTICA ---
const REPO_NAME = '/CRM-Magic-Design-Efecto-Pro-2026'; // Nombre EXACTO

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

// --- EL CEREBRO DE LA APP (CON ESPÍA) ---
const router = async () => {
    // 1. ESPÍA: Diagnóstico inicial
    console.log("--- NAVEGACIÓN DETECTADA ---");
    console.log("URL Completa:", window.location.href);
    console.log("Pathname Bruto:", window.location.pathname);

    // 2. Auth Listener (Solo una vez)
    if (!window.authInitialized) {
        AuthService.initAuthListener();
        window.authInitialized = true;
    }

    const contentDiv = document.getElementById('app');
    Store.init();
    const user = Store.getState().user;

    // 3. LIMPIEZA DE RUTA (El corazón del arreglo)
    // Quitamos el nombre del repo de la ruta para saber qué módulo cargar
    let path = window.location.pathname;
    
    if (path.includes(REPO_NAME)) {
        path = path.replace(REPO_NAME, '');
    }
    // Quitamos slash final si existe (ej: /dashboard/ -> /dashboard)
    if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    // Si está vacío, es el home
    if (path === '') path = '/';

    console.log("Ruta Limpia (Interna):", path); // <--- ESTO ES LO QUE IMPORTA

    // 4. PROTECCIÓN DE SESIÓN
    if (!user) {
        console.log("Estado: Usuario NO logueado");
        if (path !== '/' && path !== '/index.html') {
            console.log("Redirigiendo al Login...");
            // Usamos replaceState para no dejar historial
            window.history.replaceState({}, '', REPO_NAME + '/');
            path = '/';
        }
        
        contentDiv.innerHTML = await LoginModule.render();
        if (LoginModule.init) await LoginModule.init();
        return;
    }

    // 5. CARGA DE MÓDULO
    console.log("Estado: Usuario Logueado -> Cargando módulo para:", path);
    const module = routes[path] || Dashboard;

    if (!routes[path]) {
        console.warn("¡ALERTA! Ruta no definida en el mapa:", path, "-> Cargando Dashboard por defecto");
    }

    // Renderizamos
    try {
        contentDiv.innerHTML = await module.render();
        if (module.init) await module.init();
    } catch (error) {
        console.error("ERROR CRÍTICO RENDERIZANDO MÓDULO:", error);
        contentDiv.innerHTML = "<h2>Error cargando la sección. Revisa la consola (F12).</h2>";
    }
};

// Escuchar navegación del navegador (atrás/adelante)
window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);

// --- INTERCEPTOR DE CLICS (Para navegar sin recargar) ---
document.body.addEventListener('click', e => {
    const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');

    if (link) {
        e.preventDefault();
        
        // Obtenemos el atributo href limpio (ej: "/leads")
        const targetRoute = link.getAttribute('href'); 
        console.log("Clic detectado hacia:", targetRoute);

        // Construimos la URL completa para el navegador
        // IMPORTANTE: Aquí agregamos el nombre del repo manualmente para que la URL se vea bien
        const fullUrl = REPO_NAME + targetRoute;
        
        window.history.pushState({}, "", fullUrl);
        router(); // Ejecutamos la lógica
    }
});
