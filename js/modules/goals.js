import { Modal } from '../components/Modal.js';
import { GoalsService } from '../services/goals.service.js';
import { Formatters } from '../utils/formatters.js';

// ❌ SIN IMPORTAR LAYOUT (SOLUCIÓN DOBLE COLUMNA APLICADA)

export const GoalsModule = {
    render: async () => {
        const content = `
            <style>
                /* --- LIBRERÍA VISUAL PRO --- */
                :root {
                    --pro-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
                    --pro-radius: 16px;
                    --pro-bg: #ffffff;
                }

                /* GRID */
                .goals-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
                    gap: 24px; 
                    margin-top: 20px;
                }
                
                /* TARJETAS PREMIUM */
                .goal-card { 
                    background: var(--pro-bg); 
                    padding: 32px; 
                    border-radius: var(--pro-radius); 
                    border: 1px solid rgba(226, 232, 240, 0.8); 
                    box-shadow: var(--pro-shadow);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                }
                .goal-card:hover { 
                    transform: translateY(-4px); 
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                
                /* Decoración sutil en el top de la tarjeta */
                .goal-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, var(--primary), #60A5FA);
                    opacity: 0.8;
                }

                /* HEADER MODERNO */
                .goals-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 30px; 
                }

                .goals-title-group h2 {
                    font-size: 1.75rem; 
                    font-weight: 800; 
                    color: #0F172A;
                    margin: 0;
                    letter-spacing: -0.025em;
                }
                .goals-title-group p {
                    color: #64748B;
                    margin: 4px 0 0 0;
                    font-size: 0.95rem;
                }

                /* BOTÓN PRO (Glassmorphism sutil) */
                #btnEditGoals {
                    background: white;
                    color: #0F172A;
                    border: 1px solid #E2E8F0;
                    padding: 10px 20px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border-radius: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                #btnEditGoals:hover {
                    background: #F8FAFC;
                    border-color: #CBD5E1;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                #btnEditGoals svg { width: 18px; height: 18px; color: var(--primary); }

                /* GRÁFICOS REFINADOS */
                .progress-wrapper {
                    position: relative;
                    width: 160px;
                    height: 160px;
                    margin: 25px 0;
                }
                .circle-bg { fill: none; stroke: #F1F5F9; stroke-width: 6; }
                .circle-fill { 
                    fill: none; 
                    stroke-width: 6; 
                    stroke-linecap: round; /* Bordes redondeados en la línea */
                    transform: rotate(-90deg); 
                    transform-origin: 50% 50%; 
                    transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .center-stats {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }
                .percent-text { 
                    font-size: 2.2rem; 
                    font-weight: 800; 
                    color: #0F172A; 
                    line-height: 1;
                }
                .percent-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #94A3B8;
                    margin-top: 4px;
                    font-weight: 600;
                }

                /* ETIQUETAS Y METADATA */
                .card-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-weight: 700;
                    color: #64748B;
                    margin-bottom: 5px;
                }

                .stats-row {
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    margin-top: 15px;
                    padding-top: 20px;
                    border-top: 1px solid #F1F5F9;
                }
                .stat-item { text-align: center; flex: 1; }
                .stat-value { display: block; font-weight: 700; color: #334155; font-size: 1rem; }
                .stat-desc { font-size: 0.75rem; color: #94A3B8; font-weight: 500; }

                /* --- MÓVIL OPTIMIZADO --- */
                @media (max-width: 600px) {
                    .goals-header {
                        flex-direction: row; 
                        align-items: center;
                        margin-bottom: 20px;
                    }
                    .goals-title-group h2 { font-size: 1.4rem; }
                    .goals-title-group p { display: none; } /* Ocultar subtítulo en móvil para ahorrar espacio */
                    
                    #btnEditGoals {
                        padding: 8px 14px;
                        font-size: 0.85rem;
                    }
                    #btnEditGoals span { display: none; } /* Ocultar texto "Ajustar", dejar solo icono si es necesario o viceversa */
                    
                    .goal-card { padding: 24px; }
                    .progress-wrapper { width: 130px; height: 130px; }
                    .percent-text { font-size: 1.8rem; }
                }
            </style>

            <div class="goals-header">
                <div class="goals-title-group">
                    <h2>Metas Mensuales</h2>
                    <p>Rendimiento vs Objetivos</p>
                </div>
                <button id="btnEditGoals">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>Configurar</span>
                </button>
            </div>

            <div id="goalsContainer" class="goals-grid">
                <div class="loader"></div>
            </div>

            ${Modal.render('Ajustar Objetivos', `
                <form id="goalsForm" style="display:flex; flex-direction:column; gap:20px; padding: 10px 0;">
                    <div>
                        <label style="display:block; font-weight:600; color:#334155; font-size:0.9rem; margin-bottom:8px;">💰 Meta de Facturación ($)</label>
                        <input type="number" name="sales" id="inputGoalSales" class="form-input" style="width:100%; padding:12px; border:1px solid #CBD5E1; border-radius:10px; font-size:1rem; outline:none; transition:border 0.2s;">
                    </div>
                    <div>
                        <label style="display:block; font-weight:600; color:#334155; font-size:0.9rem; margin-bottom:8px;">👥 Meta de Leads (Cantidad)</label>
                        <input type="number" name="leads" id="inputGoalLeads" class="form-input" style="width:100%; padding:12px; border:1px solid #CBD5E1; border-radius:10px; font-size:1rem; outline:none; transition:border 0.2s;">
                    </div>
                    <button type="submit" class="btn-3d" style="justify-content:center; padding:14px; font-size:1rem; margin-top:10px;">Guardar Cambios</button>
                </form>
            `, 'modalGoals')}
        `;
        
        return content;
    },

    init: async () => {
        Modal.initEvents('modalGoals');
        await GoalsModule.loadGoals();

        const btnEdit = document.getElementById('btnEditGoals');
        if(btnEdit) {
            btnEdit.addEventListener('click', () => {
                Modal.open('modalGoals');
            });
        }

        const form = document.getElementById('goalsForm');
        if(form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const sales = document.getElementById('inputGoalSales').value;
                const leads = document.getElementById('inputGoalLeads').value;
                await GoalsService.updateGoals(sales, leads);
                Modal.close('modalGoals');
                await GoalsModule.loadGoals();
            });
        }
    },

    loadGoals: async () => {
        const container = document.getElementById('goalsContainer');
        if(!container) return;

        try {
            const data = await GoalsService.getCurrentMonthGoals();
            
            const goals = data && data.length > 0 ? data : [
                { type: 'sales', target: 1000, current: 0, label: 'Facturación', icon: '💰' },
                { type: 'leads', target: 50, current: 0, label: 'Nuevos Leads', icon: '👥' }
            ];

            container.innerHTML = goals.map(g => {
                const percent = Math.min(100, Math.round((g.current / g.target) * 100)) || 0;
                const radius = 55;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (percent / 100) * circumference;
                
                // Color dinámico PRO (Gradient-like logic)
                const color = percent >= 100 ? '#10B981' : '#3B82F6'; 

                return `
                    <div class="goal-card">
                        <div class="card-label">${g.label}</div>
                        
                        <div class="progress-wrapper">
                            <svg width="100%" height="100%" viewBox="0 0 140 140">
                                <circle class="circle-bg" cx="70" cy="70" r="${radius}"></circle>
                                <circle class="circle-fill" cx="70" cy="70" r="${radius}" 
                                        style="stroke: ${color}; stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset};"></circle>
                            </svg>
                            <div class="center-stats">
                                <div class="percent-text">${percent}%</div>
                                <div class="percent-label">LOGRADO</div>
                            </div>
                        </div>

                        <div class="stats-row">
                            <div class="stat-item">
                                <span class="stat-desc">ACTUAL</span>
                                <span class="stat-value">${g.current}</span>
                            </div>
                            <div class="stat-item" style="border-left:1px solid #F1F5F9;">
                                <span class="stat-desc">META</span>
                                <span class="stat-value">${g.target}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            const salesG = goals.find(g => g.type === 'sales');
            const leadsG = goals.find(g => g.type === 'leads');
            
            const inputSales = document.getElementById('inputGoalSales');
            const inputLeads = document.getElementById('inputGoalLeads');
            
            if(salesG && inputSales) inputSales.value = salesG.target;
            if(leadsG && inputLeads) inputLeads.value = leadsG.target;

        } catch (e) {
            container.innerHTML = '<p style="text-align:center; width:100%; color:#94A3B8;">No se pudieron cargar las metas.</p>';
        }
    },

    destroy: () => {}
};
