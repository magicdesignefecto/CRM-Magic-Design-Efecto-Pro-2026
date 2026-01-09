import { Table } from '../components/Table.js';
import { Modal } from '../components/Modal.js';
import { ProjectsService } from '../services/projects.service.js';
import { ClientsService } from '../services/clients.service.js'; // Para listar clientes
import { SettingsService } from '../services/settings.service.js'; // Para servicios
import { Formatters } from '../utils/formatters.js';

// ❌ AQUÍ BORRAMOS EL IMPORT DE LAYOUT

export const ProjectsModule = {
    render: async () => {
        // 1. Cargar datos necesarios (Clientes y Servicios Globales)
        const [clients, availableServices] = await Promise.all([
            ClientsService.getAll(),
            SettingsService.getServices()
        ]);

        // Generar opciones de Clientes
        const clientOptions = clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('');

        // Generar checkboxes de Servicios (Dropdown)
        const servicesCheckboxesHTML = availableServices.map(svc => `
            <label class="service-option" style="display:flex;">
                <input type="checkbox" class="service-chk" value="${svc}">
                <span class="svc-name" style="margin-left:10px;">${svc}</span>
            </label>
        `).join('');

        const formHTML = `
            <style>
                .form-section { background: #F9FAFB; padding: 15px; border-radius: 8px; border: 1px solid #E5E7EB; margin-bottom: 15px; }
                .input-group { display: flex; flex-direction: column; gap: 12px; }
                .input-row { display: flex; gap: 10px; }
                .form-input, .form-select { width: 100%; padding: 10px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.95rem; box-sizing: border-box; background:white; }
                
                /* Estilos Dropdown Servicios (Reutilizado) */
                .dropdown-wrapper { position: relative; width: 100%; }
                .dropdown-trigger { width: 100%; padding: 10px; background: white; border: 1px solid #D1D5DB; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 0.95rem; color: #374151; }
                .dropdown-content { display: none; position: absolute; top: 105%; left: 0; right: 0; background: white; border: 1px solid #D1D5DB; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); z-index: 100; padding: 10px; }
                .dropdown-content.active { display: block; }
                .services-list-scroll { max-height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
                .service-option { padding: 8px; border-radius: 4px; cursor: pointer; transition: background 0.1s; }
                .service-option:hover { background: #F3F4F6; }

                /* Tabs de Gestión */
                .tabs-header { display: flex; border-bottom: 1px solid #E5E7EB; margin-bottom: 20px; }
                .tab-btn { padding: 10px 20px; border: none; background: none; cursor: pointer; color: #64748B; font-weight: 600; border-bottom: 2px solid transparent; }
                .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
                .tab-content { display: none; }
                .tab-content.active { display: block; animation: fadeIn 0.3s; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                /* Finanzas */
                .finance-card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 8px; margin-bottom: 10px; }
                .finance-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9rem; }
                .finance-total { border-top: 1px dashed #CBD5E1; padding-top: 10px; margin-top: 10px; font-weight: 700; font-size: 1.1rem; display: flex; justify-content: space-between; }

                @media (max-width: 480px) {
                    .input-row { flex-direction: column; }
                }
            </style>

            <form id="createProjectForm">
                <div class="form-section">
                    <label style="font-weight:700; font-size:0.9rem; display:block; margin-bottom:5px;">Datos Principales</label>
                    <div class="input-group">
                        <input type="text" name="name" class="form-input" placeholder="Nombre del Proyecto *" required>
                        
                        <select name="client" class="form-select" required>
                            <option value="" disabled selected>-- Seleccionar Cliente --</option>
                            ${clientOptions}
                        </select>

                        <div class="input-row">
                            <div style="flex:1;">
                                <label style="font-size:0.75rem; color:#666;">Estado Inicial</label>
                                <select name="status" class="form-select">
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="En Progreso">En Progreso</option>
                                </select>
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:0.75rem; color:#666;">Moneda</label>
                                <select name="currency" class="form-select">
                                    <option value="USD">USD</option>
                                    <option value="BOB">BOB</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <label style="font-weight:700; font-size:0.9rem; display:block; margin-bottom:5px;">Planificación</label>
                    <div class="input-group">
                        <div class="input-row">
                            <div style="flex:1;">
                                <label style="font-size:0.75rem; color:#666;">Fecha Inicio</label>
                                <input type="date" name="startDate" class="form-input" required>
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:0.75rem; color:#666;">Fecha Entrega (Fin)</label>
                                <input type="date" name="endDate" class="form-input" required>
                            </div>
                        </div>

                        <label style="font-size:0.8rem; color:#666;">Objetivo del Proyecto</label>
                        <textarea name="objective" class="form-input" rows="3" placeholder="Ej: Rediseñar el sitio web para aumentar conversiones..."></textarea>
                    </div>
                </div>

                <div class="form-section">
                    <label style="font-weight:700; font-size:0.9rem; display:block; margin-bottom:5px;">🛠️ Servicios Incluidos</label>
                    <div class="dropdown-wrapper">
                        <div class="dropdown-trigger" id="projServicesTrigger">
                            <span id="projServicesText">-- Seleccionar Servicios --</span>
                        </div>
                        <div class="dropdown-content" id="projServicesContent">
                            <div class="services-list-scroll" id="projServicesList">
                                ${servicesCheckboxesHTML}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-section" style="background:#F0FDF4; border-color:#BBF7D0;">
                    <label style="font-weight:700; color:#15803D; font-size:0.9rem;">💰 Presupuesto de Venta</label>
                    <input type="number" name="budget" class="form-input" placeholder="0.00" style="font-size:1.2rem; font-weight:700; color:#15803D; margin-top:5px;">
                </div>

                <button type="submit" class="btn-3d" style="width: 100%; justify-content: center;">Crear Proyecto</button>
            </form>
        `;

        // Modal de Creación
        const modalHTML = Modal.render('Nuevo Proyecto', formHTML, 'modalNewProject');
        // Modal de Gestión (Vacio por ahora, se llena dinámicamente)
        const manageModalHTML = Modal.render('Gestión de Proyecto', '<div id="manageProjectContent"></div>', 'modalManageProject');

        const pageContent = `
            <div class="page-header" style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                    <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 5px;">Proyectos</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Control de ejecución y rentabilidad</p>
                </div>
                <button class="btn-3d" id="btnOpenProjectModal">+ Nuevo</button>
            </div>
            
            <div id="projectsTableContainer" style="overflow-x: auto;">
                <div style="text-align:center; padding:40px; color:#9CA3AF;">No hay proyectos activos.</div>
            </div>
            
            ${modalHTML}
            ${manageModalHTML}
        `;
        
        // ❌ CAMBIO IMPORTANTE: Quitamos "Layout.render()"
        return pageContent;
    },

    init: async () => {
        // ❌ CAMBIO IMPORTANTE: Quitamos "Layout.init()"
        
        Modal.initEvents('modalNewProject');
        Modal.initEvents('modalManageProject');
        await ProjectsModule.loadTable();

        const btnOpen = document.getElementById('btnOpenProjectModal');
        if(btnOpen) btnOpen.addEventListener('click', () => {
            // Pre-seleccionar fechas hoy
            const d = new Date();
            const dateStr = d.toISOString().split('T')[0];
            const startIn = document.querySelector('input[name="startDate"]');
            if(startIn) startIn.value = dateStr;
            Modal.open('modalNewProject');
        });

        // --- Lógica Dropdown Servicios (Igual a Leads/Quotes) ---
        const trigger = document.getElementById('projServicesTrigger');
        const content = document.getElementById('projServicesContent');
        const list = document.getElementById('projServicesList');
        const text = document.getElementById('projServicesText');

        if(trigger && content) {
            trigger.addEventListener('click', () => content.classList.toggle('active'));
            list.addEventListener('change', () => {
                const count = list.querySelectorAll('.service-chk:checked').length;
                text.innerText = count > 0 ? `${count} Servicios seleccionados` : "-- Seleccionar Servicios --";
            });
            // Cerrar al clic fuera
            document.addEventListener('click', (e) => {
                if(!content.contains(e.target) && !trigger.contains(e.target)) content.classList.remove('active');
            });
        }

        // Submit Crear Proyecto
        const form = document.getElementById('createProjectForm');
        if(form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                // Aquí irá la lógica de guardado a Firebase
                alert('Guardado simulado. Esperando backend.');
                Modal.close('modalNewProject');
            });
        }
    },

    loadTable: async () => {
        // Por ahora vacío hasta tener Firebase
    },

    // --- LÓGICA DE GESTIÓN (TABS) ---
    manageProject: async (id) => {
        // Simulamos obtener el proyecto completo (esto vendrá de Firebase)
        const project = { 
            id: id, 
            name: "Proyecto Demo", 
            client: "Cliente Ejemplo", 
            budget: 5000, 
            currency: 'USD',
            startDate: '2026-01-01',
            endDate: '2026-02-01',
            objective: "Desarrollar la nueva plataforma de ecommerce.",
            services: ["Diseño Web", "SEO"],
            tasks: [], // Tareas vacías inicialmente
            costs: 1200 // Costos simulados
        };

        const container = document.getElementById('manageProjectContent');
        
        // Renderizamos las pestañas
        container.innerHTML = `
            <div style="margin-bottom:15px;">
                <h3 style="margin:0; color:var(--primary);">${project.name}</h3>
                <span style="font-size:0.9rem; color:#666;">${project.client}</span>
            </div>

            <div class="tabs-header">
                <button class="tab-btn active" onclick="openTab('tabResumen')">Resumen</button>
                <button class="tab-btn" onclick="openTab('tabTareas')">Tareas</button>
                <button class="tab-btn" onclick="openTab('tabFinanzas')">Finanzas</button>
            </div>

            <div id="tabResumen" class="tab-content active">
                <div class="form-section">
                    <label style="font-weight:700; display:block;">Objetivo:</label>
                    <p style="margin-top:5px; color:#333;">${project.objective}</p>
                    
                    <div style="display:flex; gap:20px; margin-top:15px;">
                        <div><small style="color:#666;">Inicio:</small> <strong>${project.startDate}</strong></div>
                        <div><small style="color:#666;">Entrega:</small> <strong>${project.endDate}</strong></div>
                    </div>

                    <div style="margin-top:15px;">
                        <label style="font-weight:700; display:block;">Servicios:</label>
                        <div style="display:flex; gap:5px; flex-wrap:wrap; margin-top:5px;">
                            ${project.services.map(s => `<span style="background:#EFF6FF; padding:4px 8px; border-radius:4px; font-size:0.85rem; color:#1E40AF;">${s}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div id="tabTareas" class="tab-content">
                <div style="background:#F9FAFB; padding:10px; border-radius:6px; margin-bottom:15px;">
                    <h5 style="margin:0 0 10px 0;">Nueva Tarea</h5>
                    <input type="text" placeholder="Descripción de la tarea" class="form-input" style="margin-bottom:5px;">
                    <div style="display:flex; gap:5px;">
                        <input type="date" class="form-input">
                        <input type="date" class="form-input">
                        <button class="btn-3d" style="padding:5px 15px;">+</button>
                    </div>
                </div>
                <div style="text-align:center; color:#999; padding:20px;">
                    No hay tareas registradas.
                </div>
            </div>

            <div id="tabFinanzas" class="tab-content">
                <div class="finance-card">
                    <div class="finance-row">
                        <span>Presupuesto (Venta):</span>
                        <span style="color:#10B981; font-weight:700;">${Formatters.toCurrency(project.budget, project.currency)}</span>
                    </div>
                    <div class="finance-row">
                        <span>Costos Ejecutados:</span>
                        <span style="color:#EF4444; font-weight:700;">- ${Formatters.toCurrency(project.costs, project.currency)}</span>
                    </div>
                    <div class="finance-total">
                        <span>Rentabilidad (Margen):</span>
                        <span style="color:${(project.budget - project.costs) >= 0 ? '#10B981' : '#EF4444'}">
                            ${Formatters.toCurrency(project.budget - project.costs, project.currency)}
                        </span>
                    </div>
                </div>

                <div style="margin-top:15px;">
                    <h5 style="margin:0 0 5px 0;">Registrar Costo/Gasto Extra</h5>
                    <div style="display:flex; gap:5px;">
                        <input type="text" placeholder="Concepto (ej: Hosting)" class="form-input" style="flex:2;">
                        <input type="number" placeholder="Monto" class="form-input" style="flex:1;">
                        <button class="btn-3d" style="background:#EF4444; border-color:#EF4444;">Restar</button>
                    </div>
                </div>
            </div>
        `;
        
        // Exponer función global para tabs (truco rápido para SPA)
        window.openTab = (tabId) => {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            // Activar botón visualmente (busca por texto o index, simplificado aquí)
            event.target.classList.add('active');
        };

        Modal.open('modalManageProject');
    },

    destroy: () => {
        delete window.openTab; // Limpieza
    }

};
