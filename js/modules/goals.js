import { Modal } from '../components/Modal.js';
import { GoalsService } from '../services/goals.service.js';
import { Formatters } from '../utils/formatters.js';

// ❌ AQUÍ BORRAMOS EL IMPORT DE LAYOUT

export const GoalsModule = {
    render: async () => {
        const content = `
            <style>
                .goals-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .goals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
                .goal-card { background: white; padding: 25px; border-radius: 16px; border: 1px solid #E2E8F0; text-align: center; }
                
                .progress-circle { width: 120px; height: 120px; margin: 20px auto; position: relative; display: flex; align-items: center; justify-content: center; }
                .circle-bg { fill: none; stroke: #F1F5F9; stroke-width: 10; }
                .circle-fill { fill: none; stroke-width: 10; stroke-linecap: round; transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 1s ease; }
                .percent-text { font-size: 1.8rem; font-weight: 800; color: #1E293B; }
            </style>

            <div class="goals-header">
                <h2 style="font-size:1.5rem; font-weight:700;">Metas Mensuales</h2>
                <button class="btn-3d" id="btnEditGoals">🎯 Ajustar</button>
            </div>

            <div id="goalsContainer" class="goals-grid">
                <div class="loader"></div>
            </div>

            ${Modal.render('Ajustar Objetivos', `
                <form id="goalsForm" style="display:flex; flex-direction:column; gap:15px;">
                    <div>
                        <label>Meta Facturación ($)</label>
                        <input type="number" name="sales" id="inputGoalSales" class="form-input" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:6px;">
                    </div>
                    <div>
                        <label>Meta Leads (Cantidad)</label>
                        <input type="number" name="leads" id="inputGoalLeads" class="form-input" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:6px;">
                    </div>
                    <button type="submit" class="btn-3d" style="justify-content:center;">Guardar</button>
                </form>
            `, 'modalGoals')}
        `;
        
        // ❌ CAMBIO IMPORTANTE: Quitamos "Layout.render()"
        return content;
    },

    init: async () => {
        // ❌ CAMBIO IMPORTANTE: Quitamos "Layout.init()"
        
        Modal.initEvents('modalGoals');
        
        await GoalsModule.loadGoals();

        // Botón Ajustar
        const btnEdit = document.getElementById('btnEditGoals');
        if(btnEdit) {
            btnEdit.addEventListener('click', () => {
                Modal.open('modalGoals');
            });
        }

        // Guardar
        const form = document.getElementById('goalsForm');
        if(form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const sales = document.getElementById('inputGoalSales').value;
                const leads = document.getElementById('inputGoalLeads').value;
                await GoalsService.updateGoals(sales, leads);
                Modal.close('modalGoals');
                await GoalsModule.loadGoals(); // Recargar
            });
        }
    },

    loadGoals: async () => {
        const container = document.getElementById('goalsContainer');
        if(!container) return;

        try {
            const data = await GoalsService.getCurrentMonthGoals();
            
            // Si viene vacío (sin backend), simulamos estructura en 0 para que no rompa
            const goals = data && data.length > 0 ? data : [
                { type: 'sales', target: 1000, current: 0, label: 'Facturación', icon: '💰' },
                { type: 'leads', target: 50, current: 0, label: 'Nuevos Leads', icon: '👥' }
            ];

            container.innerHTML = goals.map(g => {
                const percent = Math.min(100, Math.round((g.current / g.target) * 100)) || 0;
                const radius = 45;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (percent / 100) * circumference;
                const color = percent >= 100 ? '#10B981' : '#3B82F6';

                return `
                    <div class="goal-card">
                        <h3 style="color:#64748B; font-size:0.9rem; text-transform:uppercase;">${g.icon} ${g.label}</h3>
                        
                        <div class="progress-circle">
                            <svg width="120" height="120">
                                <circle class="circle-bg" cx="60" cy="60" r="${radius}"></circle>
                                <circle class="circle-fill" cx="60" cy="60" r="${radius}" 
                                        style="stroke: ${color}; stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset};"></circle>
                            </svg>
                            <div style="position:absolute;">
                                <span class="percent-text">${percent}%</span>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:#333; margin-top:10px; border-top:1px solid #f0f0f0; padding-top:10px;">
                            <span>Actual: <strong>${g.current}</strong></span>
                            <span>Meta: <strong>${g.target}</strong></span>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Pre-llenar inputs del modal
            const salesG = goals.find(g => g.type === 'sales');
            const leadsG = goals.find(g => g.type === 'leads');
            
            const inputSales = document.getElementById('inputGoalSales');
            const inputLeads = document.getElementById('inputGoalLeads');
            
            if(salesG && inputSales) inputSales.value = salesG.target;
            if(leadsG && inputLeads) inputLeads.value = leadsG.target;

        } catch (e) {
            container.innerHTML = '<p>Error cargando metas.</p>';
        }
    },

    destroy: () => {}
};
