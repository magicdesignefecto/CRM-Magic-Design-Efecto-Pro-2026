import { Layout } from '../components/Layout.js';
import { Store } from '../core/store.js';
import { Formatters } from '../utils/formatters.js';

export const Dashboard = {
    render: async () => {
        const user = Store.getState().user || { name: 'Usuario' };
        
        const styles = `
            <style>
                .welcome-section { margin-bottom: 24px; }
                .welcome-section h2 { font-size: 1.25rem; color: #1E293B; margin: 0; font-weight: 700; }
                .welcome-section p { color: #64748B; margin: 4px 0 0 0; font-size: 0.9rem; }

                /* KPI GRID */
                .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
                .kpi-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid #E2E8F0; display: flex; align-items: center; gap: 15px; }
                .icon-box { width: 45px; height: 45px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
                .icon-blue { background: #EFF6FF; color: #3B82F6; }
                .icon-green { background: #F0FDF4; color: #22C55E; }
                .icon-purple { background: #FAF5FF; color: #A855F7; }
                .icon-orange { background: #FFF7ED; color: #F97316; }
                .kpi-data h3 { margin: 0; font-size: 0.7rem; color: #64748B; font-weight: 600; text-transform: uppercase; }
                .kpi-data .value { font-size: 1.4rem; font-weight: 800; color: #0F172A; margin-top: 2px; }

                /* CHARTS GRID */
                .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
                .chart-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #E2E8F0; width: 100%; box-sizing: border-box; min-height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
                .chart-placeholder { color: #94A3B8; font-size: 0.9rem; }

                @media (max-width: 480px) {
                    .charts-grid { grid-template-columns: 1fr; }
                    .kpi-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
                }
            </style>
        `;

        const content = `
            ${styles}
            <div class="welcome-section">
                <h2>Resumen General</h2>
                <p>Bienvenido al panel de control, ${user.name}.</p>
            </div>

            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="icon-box icon-blue">👥</div>
                    <div class="kpi-data">
                        <h3>Total Leads</h3>
                        <span class="value" id="kpiLeads">0</span>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="icon-box icon-green">✅</div>
                    <div class="kpi-data">
                        <h3>Clientes Nuevos</h3>
                        <span class="value" id="kpiClients">0</span>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="icon-box icon-purple">💰</div>
                    <div class="kpi-data">
                        <h3>Ingresos Mes</h3>
                        <span class="value" id="kpiIncome">0</span>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="icon-box icon-orange">🎯</div>
                    <div class="kpi-data">
                        <h3>Conversión</h3>
                        <span class="value" id="kpiConversion">0%</span>
                    </div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-card">
                    <span class="chart-placeholder">📊 Gráfica de Rendimiento<br>(Esperando datos...)</span>
                </div>
                <div class="chart-card">
                    <span class="chart-placeholder">🔔 Actividad Reciente<br>(Sin notificaciones nuevas)</span>
                </div>
            </div>
        `;
        
        return Layout.render(content, 'Dashboard');
    },

    init: async () => {
        Layout.init();
        // Aquí conectaremos Firebase para llenar los IDs: kpiLeads, kpiClients, etc.
    },

    destroy: () => {}
};