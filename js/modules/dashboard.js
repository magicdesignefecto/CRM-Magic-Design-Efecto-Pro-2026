import { Store } from '../core/store.js';

export const Dashboard = {
    render: async () => {
        // Obtenemos datos del usuario (o valores por defecto)
        const user = Store.getState().user || { name: 'Usuario' };

        // Devolvemos SOLO el contenido interno (sin barra lateral ni header, porque app.js ya los pone)
        return `
            <div class="dashboard-content">
                <div class="welcome-banner" style="margin-bottom: 30px;">
                    <h2 style="margin:0; color: #1e293b;">Resumen General</h2>
                    <p style="color: #64748b; margin-top:5px;">Bienvenido al panel de control, ${user.name}.</p>
                </div>

                <div class="kpi-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div class="kpi-card" style="background:white; padding:20px; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.03); border:1px solid #e2e8f0; display:flex; align-items:center; gap:15px;">
                        <div class="icon-box" style="width:50px; height:50px; background:#EFF6FF; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#3B82F6;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <div>
                            <div style="font-size:0.8rem; font-weight:600; color:#64748b; text-transform:uppercase;">Total Leads</div>
                            <div style="font-size:1.5rem; font-weight:800; color:#0f172a;">0</div>
                        </div>
                    </div>

                    <div class="kpi-card" style="background:white; padding:20px; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.03); border:1px solid #e2e8f0; display:flex; align-items:center; gap:15px;">
                        <div class="icon-box" style="width:50px; height:50px; background:#F0FDF4; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#22C55E;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <div>
                            <div style="font-size:0.8rem; font-weight:600; color:#64748b; text-transform:uppercase;">Clientes Nuevos</div>
                            <div style="font-size:1.5rem; font-weight:800; color:#0f172a;">0</div>
                        </div>
                    </div>

                    <div class="kpi-card" style="background:white; padding:20px; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.03); border:1px solid #e2e8f0; display:flex; align-items:center; gap:15px;">
                        <div class="icon-box" style="width:50px; height:50px; background:#FFF7ED; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#F59E0B;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <div>
                            <div style="font-size:0.8rem; font-weight:600; color:#64748b; text-transform:uppercase;">Ingresos Mes</div>
                            <div style="font-size:1.5rem; font-weight:800; color:#0f172a;">0</div>
                        </div>
                    </div>

                    <div class="kpi-card" style="background:white; padding:20px; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.03); border:1px solid #e2e8f0; display:flex; align-items:center; gap:15px;">
                        <div class="icon-box" style="width:50px; height:50px; background:#FFF1F2; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#F43F5E;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                        </div>
                        <div>
                            <div style="font-size:0.8rem; font-weight:600; color:#64748b; text-transform:uppercase;">Conversión</div>
                            <div style="font-size:1.5rem; font-weight:800; color:#0f172a;">0%</div>
                        </div>
                    </div>
                </div>

                <div class="charts-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div class="chart-card" style="background:white; padding:20px; border-radius:12px; border:1px solid #e2e8f0; height:300px; display:flex; align-items:center; justify-content:center; color:#94a3b8;">
                        <div>
                            <span style="display:block; font-size:2rem; margin-bottom:10px;">📊</span>
                            Gráfica de Rendimiento<br><small>(Esperando datos...)</small>
                        </div>
                    </div>
                    <div class="chart-card" style="background:white; padding:20px; border-radius:12px; border:1px solid #e2e8f0; height:300px; display:flex; align-items:center; justify-content:center; color:#94a3b8;">
                        <div>
                            <span style="display:block; font-size:2rem; margin-bottom:10px;">🔔</span>
                            Actividad Reciente<br><small>(Sin notificaciones nuevas)</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init: async () => {
        console.log("Dashboard cargado");
    }
};
