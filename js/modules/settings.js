import { Store } from '../core/store.js';

export const SettingsModule = {
    render: async () => {
        return `
            <div class="settings-content">
                <div class="section-header" style="margin-bottom: 25px;">
                    <h2 style="margin:0; color: #1e293b;">Configuración</h2>
                    <p style="color: #64748b;">Administración del sistema</p>
                </div>

                <div class="card" style="background:white; padding:25px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:25px;">
                    <h3 style="margin-top:0; color:#334155; display:flex; align-items:center; gap:10px;">
                        🛠️ Catálogo de Servicios
                    </h3>
                    
                    <div style="display:flex; gap:10px; margin-top:20px;">
                        <input type="text" placeholder="Ej: Consultoría SEO..." style="flex:1; padding:10px; border:1px solid #cbd5e1; border-radius:6px;">
                        <button style="background:#2563EB; color:white; border:none; padding:10px 20px; border-radius:6px; font-weight:600; cursor:pointer;">Agregar</button>
                    </div>

                    <div class="tags-container" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:20px;">
                        <span style="background:#F1F5F9; padding:5px 12px; border-radius:20px; font-size:0.9rem; color:#475569; border:1px solid #E2E8F0;">Gestión Redes Sociales ✕</span>
                        <span style="background:#F1F5F9; padding:5px 12px; border-radius:20px; font-size:0.9rem; color:#475569; border:1px solid #E2E8F0;">Facebook/IG Ads ✕</span>
                        <span style="background:#F1F5F9; padding:5px 12px; border-radius:20px; font-size:0.9rem; color:#475569; border:1px solid #E2E8F0;">Diseño Web ✕</span>
                        <span style="background:#F1F5F9; padding:5px 12px; border-radius:20px; font-size:0.9rem; color:#475569; border:1px solid #E2E8F0;">Google Ads ✕</span>
                    </div>
                </div>

                <div class="card" style="background:white; padding:25px; border-radius:12px; border:1px solid #e2e8f0;">
                    <h3 style="margin-top:0; color:#334155; display:flex; align-items:center; gap:10px;">
                        📂 Historial Completo del Cliente
                    </h3>
                    <p style="color:#64748b; font-size:0.9rem;">Selecciona un cliente para auditar:</p>
                    
                    <select style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; margin-top:10px; background:white;">
                        <option>-- Buscar Cliente --</option>
                    </select>

                    <button style="width:100%; margin-top:20px; background:white; border:1px solid #2563EB; color:#2563EB; padding:10px; border-radius:6px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                        📄 Descargar Reporte (Con Fechas y Horas)
                    </button>
                </div>
            </div>
        `;
    },

    init: async () => {
        console.log("Settings cargado");
    }
};
