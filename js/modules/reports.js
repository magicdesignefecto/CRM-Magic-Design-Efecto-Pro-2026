import { Store } from '../core/store.js';

export const ReportsModule = {
    render: async () => {
        return `
            <div class="page-content">
                <div style="margin-bottom: 25px;">
                    <h2 style="margin:0; color: #1e293b;">Reportes Financieros</h2>
                    <p style="color: #64748b;">Análisis de rentabilidad real</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div style="background:white; padding:25px; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 2px 5px rgba(0,0,0,0.02);">
                        <div style="font-size:0.9rem; color:#64748b; font-weight:600; text-transform:uppercase;">Ventas Totales</div>
                        <div style="font-size:2rem; font-weight:800; color:#0f172a; margin-top:10px;">$2,450</div>
                        <div style="font-size:0.8rem; color:#10B981; margin-top:5px;">+12% vs mes anterior</div>
                    </div>
                    <div style="background:white; padding:25px; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 2px 5px rgba(0,0,0,0.02);">
                        <div style="font-size:0.9rem; color:#64748b; font-weight:600; text-transform:uppercase;">Costos Operativos</div>
                        <div style="font-size:2rem; font-weight:800; color:#EF4444; margin-top:10px;">$450</div>
                    </div>
                    <div style="background:white; padding:25px; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 2px 5px rgba(0,0,0,0.02);">
                        <div style="font-size:0.9rem; color:#64748b; font-weight:600; text-transform:uppercase;">Rentabilidad Neta</div>
                        <div style="font-size:2rem; font-weight:800; color:#22C55E; margin-top:10px;">$2,000</div>
                    </div>
                </div>

                <div style="background:white; padding:40px; border-radius:12px; border:1px solid #e2e8f0; text-align:center; color:#94a3b8;">
                    📊 Gráfica de Ingresos vs Gastos (Próximamente)
                </div>
            </div>
        `;
    },
    init: async () => {}
};
