import { AuthService } from './services/auth.service.js';
import { Layout } from './components/Layout.js';

// Módulos
import { LoginModule } from './modules/login.js';
import { DashboardModule } from './modules/dashboard.js'; // Asegúrate que se llame así en el export
import { LeadsModule } from './modules/leads.js';
import { ClientsModule } from './modules/clients.js';
import { PipelineModule } from './modules/pipeline.js';
import { QuotesModule } from './modules/quotes.js';
import { ProjectsModule } from './modules/projects.js';
import { CalendarModule } from './modules/calendar.js';
import { ReportsModule } from './modules/reports.js';
import { GoalsModule } from './modules/goals.js';
import { SettingsModule } from './modules/settings.js';

// Mapeo de rutas a módulos
const routes = {
    '/': DashboardModule,
    '/dashboard': DashboardModule,
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

// Función principal del Router
const router = async () => {
    const contentDiv = document.getElementById('app');
    
    // 1. Detectar Ruta limpia (para GitHub Pages o Local)
    // Tomamos solo la parte final después del último /
    let path = window.location.hash.replace('#', '') || '/';
    
    // Si la ruta está vacía, vamos al dashboard
    if (path === '') path = '/';

    console.log("📍 Navegando a:", path);

    // 2. Verificar Sesión con Firebase (AuthService ya tiene el estado guardado)
    // Nota: La redirección inicial la manejamos en el evento onAuthStateChanged abajo
    
    // 3. Selección del Módulo
    // Si estamos en login/register, renderizamos LoginModule directamente
    if (path === '/login' || path === '/register') {
        contentDiv.innerHTML = await LoginModule.render();
        if (LoginModule.init) await LoginModule.init();
        return;
    }

    // Si no es login, buscamos el módulo correspondiente
    const module = routes[path] || DashboardModule;

    // 4. Renderizado Seguro (Layout + Módulo)
    try {
        const moduleContent = await module.render();
        const pageTitle = path.replace('/', '').toUpperCase() || 'DASHBOARD';
        
        // Aquí envolvemos el contenido en el Layout (Sidebar + Header)
        contentDiv.innerHTML = Layout.render(moduleContent, pageTitle);
        
        // Inicializamos interactividad
        if (Layout.init) await Layout.init();
        if (module.init) await module.init();

    } catch (error) {
        console.error("❌ Error cargando módulo:", error);
        contentDiv.innerHTML = `<div style="padding:20px; text-align:center;"><h2>Error cargando la página</h2><p>${error.message}</p></div>`;
    }
};

// --- INICIALIZACIÓN DE LA APP ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Iniciando Magic CRM...");

    // Escuchamos cambios en la autenticación de Firebase
    AuthService.onAuthStateChanged((user) => {
        if (user) {
            console.log("✅ Usuario detectado:", user.email);
            // Si el usuario está en login, lo mandamos al dashboard
            if (window.location.hash === '#/login' || window.location.hash === '' || !window.location.hash) {
                window.location.hash = '#/dashboard';
            }
            // Ejecutamos el router
            router();
        } else {
            console.log("⚠️ No hay sesión, redirigiendo a Login");
            // Si no hay usuario, forzamos la ruta de login
            window.location.hash = '#/login';
            router();
        }
    });

    // Escuchar cambios de navegación (Atrás/Adelante)
    window.addEventListener('popstate', router);
    window.addEventListener('hashchange', router);
});
