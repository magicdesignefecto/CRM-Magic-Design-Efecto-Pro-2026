import { Layout } from '../components/Layout.js';
import { SettingsService } from '../services/settings.service.js';
import { ClientsService } from '../services/clients.service.js';
import { Formatters } from '../utils/formatters.js';

export const SettingsModule = {
    render: async () => {
        const clients = await ClientsService.getAll();
        const clientOptions = clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

        const content = `
            <style>
                .settings-container { max-width: 900px; margin: 0 auto; }
                .config-card { background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); margin-bottom: 30px; }
                .card-header h3 { margin: 0; color: #1E293B; font-size: 1.1rem; }
                .add-service-box { display: flex; gap: 10px; margin-bottom: 20px; }
                .add-service-box input { flex: 1; padding: 12px; border: 1px solid #CBD5E1; border-radius: 8px; }
                .service-chip { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 12px; border-radius: 20px; display: inline-flex; gap: 8px; margin: 5px; }
                .client-select { padding: 12px; border: 1px solid #CBD5E1; border-radius: 8px; width: 100%; font-size: 1rem; background: white; }
                @media (max-width: 480px) { .add-service-box { flex-direction: column; } .btn-3d { width: 100%; } }
            </style>

            <div class="settings-container">
                <div class="page-header">
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main);">Configuración</h2>
                    <p style="color: var(--text-muted);">Administración del sistema</p>
                </div>

                <div class="config-card">
                    <div class="card-header" style="margin-bottom:15px;"><h3>🛠️ Catálogo de Servicios</h3></div>
                    <form id="addServiceForm" class="add-service-box">
                        <input type="text" id="newServiceInput" placeholder="Ej: Consultoría SEO..." required>
                        <button type="submit" class="btn-3d">Agregar</button>
                    </form>
                    <div id="servicesList"><div class="loader"></div></div>
                </div>

                <div class="config-card" style="border-left: 4px solid #3B82F6;">
                    <div class="card-header" style="margin-bottom:15px;"><h3>📂 Historial Completo del Cliente</h3></div>
                    <div style="display:flex; flex-direction:column; gap:15px;">
                        <label style="font-weight:600; color:#475569;">Selecciona un Cliente para auditar:</label>
                        <select id="historyClientSelect" class="client-select">
                            <option value="" disabled selected>-- Buscar Cliente --</option>
                            ${clientOptions}
                        </select>
                        <div style="text-align:right;">
                            <button id="btnDownloadHistory" class="btn-3d" style="background:white; color:#333; border:1px solid #CBD5E1;">
                                📄 Descargar Reporte (Con Fechas y Horas)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return Layout.render(content, 'Configuración');
    },

    init: async () => {
        Layout.init();
        await SettingsModule.loadServices();

        const form = document.getElementById('addServiceForm');
        if(form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const input = document.getElementById('newServiceInput');
                if(input.value.trim()) {
                    await SettingsService.addService(input.value);
                    input.value = '';
                    await SettingsModule.loadServices();
                }
            });
        }

        const btnDownload = document.getElementById('btnDownloadHistory');
        if(btnDownload) {
            btnDownload.addEventListener('click', async () => {
                const select = document.getElementById('historyClientSelect');
                if(!select.value) { alert('Selecciona un cliente.'); return; }
                const client = await ClientsService.getById(select.value);
                if(client) SettingsModule.generateClientHistoryPDF(client);
            });
        }
    },

    loadServices: async () => {
        const container = document.getElementById('servicesList');
        const services = await SettingsService.getServices();
        container.innerHTML = services.map(svc => `
            <div class="service-chip">
                ${svc} <button class="btn-delete" style="border:none; background:none; color:red; cursor:pointer;" data-service="${svc}">×</button>
            </div>
        `).join('');
        
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                if(confirm('¿Eliminar servicio?')) {
                    await SettingsService.removeService(btn.dataset.service);
                    await SettingsModule.loadServices();
                }
            });
        });
    },

    generateClientHistoryPDF: (client) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const date = new Date().toLocaleString(); // Fecha y HORA actual

        // Header
        doc.setFillColor(30, 41, 59);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("HISTORIAL DEL CLIENTE", 20, 20);
        doc.setFontSize(10);
        doc.text(`Generado: ${date}`, 20, 30); // Timestamp del reporte

        // Perfil
        let y = 55;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text("1. Perfil del Cliente", 20, y);
        doc.setFontSize(11);
        doc.setTextColor(80);
        y += 10; doc.text(`Nombre: ${client.name}`, 25, y);
        y += 8;  doc.text(`Empresa: ${client.company || '-'}`, 25, y);
        y += 8;  doc.text(`Contacto: ${client.phone || '-'}`, 25, y);

        y += 15; doc.setDrawColor(200); doc.line(20, y, 190, y);

        // Tabla de Actividad (Simulada para estructura)
        y += 15;
        doc.setFontSize(14); doc.setTextColor(0);
        doc.text("2. Registro de Actividad (Log)", 20, y);
        
        y += 10;
        doc.setFillColor(240, 240, 240);
        doc.rect(20, y, 170, 10, 'F');
        doc.setFontSize(10); doc.setFont(undefined, 'bold');
        doc.text("FECHA / HORA", 25, y + 7); // <--- COLUMNA CRÍTICA
        doc.text("ACTIVIDAD", 80, y + 7);
        doc.text("DETALLE", 140, y + 7);

        // Filas simuladas (se llenarán con Firebase)
        doc.setFont(undefined, 'normal');
        y += 18;
        doc.text("2026-01-08 09:30", 25, y);
        doc.text("Proyecto Creado", 80, y);
        doc.text("Inicio Web Corp.", 140, y);
        
        y += 10;
        doc.text("2026-01-05 14:15", 25, y);
        doc.text("Cotización Enviada", 80, y);
        doc.text("#102 - USD 1200", 140, y);

        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Reporte de auditoría generado por Magic CRM.", 20, 280);

        doc.save(`Historial_${client.name.replace(/\s+/g, '_')}.pdf`);
    },

    destroy: () => {}
};
