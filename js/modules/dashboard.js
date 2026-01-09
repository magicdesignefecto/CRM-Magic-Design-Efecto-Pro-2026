import { DashboardService } from '../services/dashboard.service.js';
import { Formatters } from '../utils/formatters.js';

// ❌ SIN IMPORTAR LAYOUT

export const DashboardModule = {
    render: async () => {
        const data = await DashboardService.getData();
        const { stats, recentLeads } = data;

        const content = `
            <style>
                .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .kpi-card { background: white; padding: 25px; border-radius: 12px; border: 1px solid #E2E8F0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; }
                .kpi-title { font-size: 0.9rem; color: #64748B; font-weight: 600; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
                .kpi-value { font-size: 2rem; font-weight: 800; color: #1E293B; }
                .kpi-trend { font-size: 0.8rem; margin-top: 5px; font-weight: 500; }
                .trend-up { color: #10B981; }
                .trend-neutral { color: #94A3B8; }

                .dash-section { background: white; border-radius: 12px; border: 1px solid #E2E8F0; padding: 25px; margin-bottom: 30px; }
                .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .section-title { font-size: 1.1rem; font-weight: 700; color: #1E293B; margin: 0; }
                
                .activity-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F5F9; }
                .activity-item:last-child { border-bottom: none; }
                .act-icon { width: 40px; height: 40px; border-radius: 50%; background: #EFF6FF; color: #3B82F6; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 15px; }
                .act-info { flex: 1; }
                .act-title { font-weight: 600; font-size: 0.95rem; color: #334155; }
                .act-meta { font-size: 0.8rem; color: #94A3B8; }
                .act-amount { font-weight: 700; color: #10B981; font-size: 0.9rem; }
            </style>

            <div class="page-header" style="margin-bottom: 25px;">
                <h2 style="font-size: 1.75rem; font-weight: 800; color: #1E293B; margin:0;">Dashboard</h2>
                <p style="color: #64748B; margin-top:5px;">Resumen general de tu negocio</p>
            </div>

            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-title">Clientes Activos</div>
                    <div class="kpi-value">${stats.clients}</div>
                    <div class="kpi-trend trend-up">👥 Cartera Total</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Prospectos (Leads)</div>
                    <div class="kpi-value">${stats.leads}</div>
                    <div class="kpi-trend trend-neutral">📥 En seguimiento</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Proyectos Activos</div>
                    <div class="kpi-value">${stats.projects}</div>
                    <div class="kpi-trend trend-neutral">🔨 En desarrollo</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Estimación Ventas</div>
                    <div class="kpi-value" style="color:#10B981;">${Formatters.toCurrency(stats.revenue, 'USD')}</div>
                    <div class="kpi-trend trend-up">💰 Valor en Pipeline</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px;">
                
                <div class="dash-section">
                    <div class="section-header">
                        <h3 class="section-title">Últimos Leads</h3>
                        <a href="/leads" style="color:#3B82F6; font-size:0.85rem; font-weight:600; text-decoration:none;">Ver todos</a>
                    </div>
                    <div id="recentActivityList">
                        ${recentLeads.length > 0 ? recentLeads.map(l => `
                            <div class="activity-item">
                                <div class="act-icon">${l.name.charAt(0)}</div>
                                <div class="act-info">
                                    <div class="act-title">${l.name}</div>
                                    <div class="act-meta">${l.company || 'Particular'} • ${l.status}</div>
                                </div>
                                <div class="act-amount">${Formatters.toCurrency(l.total, l.currency)}</div>
                            </div>
                        `).join('') : '<p style="color:#94A3B8; text-align:center;">Sin actividad reciente</p>'}
                    </div>
                </div>

                <div class="dash-section" style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:300px; text-align:center;">
                    <div style="font-size:3rem; margin-bottom:10px;">📊</div>
                    <h3 style="color:#475569;">Análisis de Ventas</h3>
                    <p style="color:#94A3B8; font-size:0.9rem;">Próximamente con datos reales</p>
                </div>
            </div>
        `;
        
        return content;
    },

    init: async () => {
        // Lógica de inicialización si fuera necesaria
    }
};
