import { Modal } from '../components/Modal.js';
import { GoalsService } from '../services/goals.service.js';
import { Formatters } from '../utils/formatters.js';

// ❌ AQUÍ BORRAMOS EL IMPORT DE LAYOUT

export const GoalsModule = {
    render: async () => {
        const content = `
            <style>
                /* --- ESTILOS GENERALES --- */
                .goals-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                    gap: 20px; 
                }
                
                .goal-card { 
                    background: white; 
                    padding: 25px; 
                    border-radius: 16px; 
                    border: 1px solid #E2E8F0; 
                    text-align: center; 
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    transition: transform 0.2s;
                }
                .goal-card:hover { transform: translateY(-2px); }

                /* --- ENCABEZADO MEJORADO --- */
                .goals-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 25px; 
                    padding-bottom: 15px;
                    border-bottom: 1px solid #F1F5F9;
                }

                .goals-title {
                    font-size: 1.5rem; 
                    font-weight: 800; 
                    color: #1E293B;
                    margin: 0;
                    letter-spacing: -0.5px;
                }

                /* Botón Ajustar más elegante en PC */
                #btnEditGoals {
                    padding: 8px 20px; /* Menos relleno vertical */
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    height: fit-content;
                    box-shadow: 0 2px 5px rgba(37, 99, 235, 0.2);
                }

                /* --- GRÁFICOS CIRCULARES --- */
                .progress-circle { width: 140px; height: 140px; margin: 25px auto; position: relative; display: flex; align-items: center; justify-content: center; }
                .circle-bg { fill: none; stroke: #F1F5F9; stroke-width: 8; }
                .circle-fill { fill: none; stroke-width: 8; stroke-linecap: round; transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 1.5s ease-out; }
                .percent-text { font-size: 2rem; font-weight: 800; color: #0F172A; }

                /* --- OPTIMIZACIÓN MÓVIL (UX/UI) --- */
                @media (max-width: 480px) {
                    .goals-header {
                        flex-direction: row; /* Mantener en fila si es posible */
                        align-items: center;
                        gap: 15px;
                    }

                    .goals-title {
                        font-size: 1.25rem; /* Texto un poco más pequeño para que quepa */
                        line-height: 1.2;
                    }

                    /* Botón compacto en móvil */
                    #btnEditGoals {
                        padding: 6px 12px;
                        font-size: 0.85rem;
                        white-space: nowrap; /* Evita que el texto se rompa */
                    }
                    
                    .goal-card { padding: 20px; }
                    .progress-circle { width: 120px; height: 120px; }
                    .percent-text { font-size: 1.5rem; }
                }
            </style>

            <div class="goals-header">
                <h2 class="goals-title">Metas Mensuales</h2>
                <button class="btn-3d" id="btnEditGoals">
                    <span>⚙️</span> Ajustar
                </button>
            </div>

            <div id="goalsContainer" class="goals-grid">
                <div class="loader"></div>
            </div>

            ${Modal.render('Ajustar Objetivos', `
                <form id="goalsForm" style="display:flex; flex-direction:column; gap:20px;">
                    <div>
                        <label style="font-weight:600; color:#334155; font-size:0.9rem;">💰 Meta Facturación ($)</label>
                        <input type="number" name="sales" id="inputGoalSales" class="form-input" style="width:100%; padding:12px; border:1px solid #CBD5E1; border-radius:8px; margin-top:5px; font-size:1rem;">
                    </div>
                    <div>
                        <label style="font-weight:600; color:#334155; font-size:0.9rem;">👥 Meta Leads (Cantidad)</label>
                        <input type="number" name="leads" id="inputGoalLeads" class="form-input" style="width:100%; padding:12px; border:1px solid #CBD5E1; border-radius:8px; margin-top:5px; font-size:1rem;">
                    </div>
                    <button type="submit" class="btn-3d" style="justify-content:center; padding:12px;">Guardar Cambios</button>
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
                const radius = 55; // Radio ajustado para el viewBox
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (percent / 100) * circumference;
                const color = percent >= 100 ? '#10B981' : '#3B82F6';

                return `
                    <div class="goal-card">
                        <div style="font-weight:700; color:#64748B; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                            ${g.icon} ${g.label}
                        </div>
                        
                        <div class="progress-circle">
                            <svg width="140" height="140" viewBox="0 0 140 140">
                                <circle class="circle-bg" cx="70" cy="70" r="${radius}"></circle>
                                <circle class="circle-fill" cx="70" cy="70" r="${radius}" 
                                        style="stroke: ${color}; stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset};"></circle>
                            </svg>
                            <div style="position:absolute; display:flex; flex-direction:column; align-items:center;">
                                <span class="percent-text">${percent}%</span>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:#333; margin-top:15px; border-top:1px solid #F1F5F9; padding-top:15px;">
                            <div style="text-align:left;">
                                <div style="font-size:0.75rem; color:#94A3B8;">ACTUAL</div>
                                <div style="font-weight:700; color:#1E293B;">${g.current}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:0.75rem; color:#94A3B8;">META</div>
                                <div style="font-weight:700; color:#1E293B;">${g.target}</div>
                            </div>
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
