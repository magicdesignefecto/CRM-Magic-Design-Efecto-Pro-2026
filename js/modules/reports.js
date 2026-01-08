import { Layout } from '../components/Layout.js';
import { ProjectsService } from '../services/projects.service.js';
import { Formatters } from '../utils/formatters.js';

export const ReportsModule = {
    render: async () => {
        const content = `
            <style>
                .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .summary-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #E2E8F0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                .summary-val { font-size: 1.8rem; font-weight: 800; color: #0F172A; display: block; margin-top: 5px; }
                .chart-container { background: white; padding: 20px; border-radius: 12px; border: 1px solid #E2E8F0; min-height: 200px; }
            </style>
            
            <div class="page-header">
                <h2>Reporte Financiero</h2>
                <p>Análisis de rentabilidad real</p>
            </div>

            <div class="summary-grid">
                <div class="summary-card">
                    <small>Ventas Totales</small>
                    <span class="summary-val" id="kpiSales">...</span>
                </div>
                <div class="summary-card">
                    <small>Costos Operativos</small>
                    <span class="summary-val" id="kpiCosts" style="color:#EF4444;">...</span>
                </div>
                <div class="summary-card">
                    <small>Rentabilidad Neta</small>
                    <span class="summary-val" id="kpiProfit">...</span>
                </div>
            </div>

            <div class="chart-container">
                <h4 style="margin-bottom:20px;">Rentabilidad por Proyecto</h4>
                <div id="projectsListReport" style="display:flex; flex-direction:column; gap:10px;">
                    <div class="loader"></div>
                </div>
            </div>
        `;
        return Layout.render(content, 'Reportes');
    },

    init: async () => {
        Layout.init();
        
        // 1. Obtener Datos Reales (Ahora vendrá vacío hasta backend)
        const projects = await ProjectsService.getAll();

        let totalSales = 0;
        let totalCosts = 0;

        // 2. Calcular Totales (Moneda base USD simplificada por ahora o mixta)
        projects.forEach(p => {
            // Nota: En un sistema real multimoneda, aquí se convertiría a una moneda base.
            // Por ahora sumamos valores nominales para mantener la lógica lista.
            totalSales += Number(p.budget || 0);
            totalCosts += Number(p.costs || 0);
        });

        const profit = totalSales - totalCosts;

        // 3. Renderizar KPIs
        document.getElementById('kpiSales').innerText = Formatters.toCurrency(totalSales, 'USD');
        document.getElementById('kpiCosts').innerText = Formatters.toCurrency(totalCosts, 'USD');
        const profitEl = document.getElementById('kpiProfit');
        profitEl.innerText = Formatters.toCurrency(profit, 'USD');
        profitEl.style.color = profit >= 0 ? '#10B981' : '#EF4444';

        // 4. Renderizar Lista de Proyectos (Barras)
        const listContainer = document.getElementById('projectsListReport');
        
        if(projects.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center; color:#999;">No hay datos financieros para mostrar.</p>';
        } else {
            listContainer.innerHTML = projects.map(p => {
                const pProfit = (p.budget || 0) - (p.costs || 0);
                const percent = p.budget > 0 ? Math.round((pProfit / p.budget) * 100) : 0;
                const color = percent > 30 ? '#10B981' : (percent > 0 ? '#F59E0B' : '#EF4444');
                
                return `
                    <div style="display:flex; align-items:center; gap:10px; font-size:0.9rem;">
                        <div style="width:30%; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.name}</div>
                        <div style="flex:1; background:#F1F5F9; height:8px; border-radius:4px; overflow:hidden;">
                            <div style="width:${Math.max(0, percent)}%; background:${color}; height:100%;"></div>
                        </div>
                        <div style="width:20%; text-align:right; font-weight:700; color:${color};">${percent}%</div>
                    </div>
                `;
            }).join('');
        }
    },

    destroy: () => {}
};