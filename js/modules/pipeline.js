import { Store } from '../core/store.js';

export const PipelineModule = {
    render: async () => {
        return `
            <div class="pipeline-container" style="height: 100%; display: flex; flex-direction: column;">
                <div class="header" style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h2 style="margin:0; color:#1e293b;">Pipeline de Ventas</h2>
                        <p style="color:#64748b;">Arrastra tus oportunidades para avanzar</p>
                    </div>
                    <button style="background:#2563EB; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer;">
                        + Nueva Oportunidad
                    </button>
                </div>

                <div class="kanban-board" style="display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px; height: 100%;">
                    
                    <div class="kanban-column" style="min-width: 300px; background: #F8FAFC; border-radius: 12px; padding: 15px; border: 1px solid #E2E8F0; display:flex; flex-direction:column;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-weight:700; color:#334155;">
                            <span>Nuevo</span>
                            <span style="background:#E2E8F0; padding:2px 8px; border-radius:12px; font-size:0.8rem;">3</span>
                        </div>
                        <div style="height:3px; background:#3B82F6; width:100%; margin-bottom:15px;"></div>
                        
                        <div style="background:white; padding:15px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.05); margin-bottom:10px; cursor:grab; border:1px solid #E2E8F0;">
                            <div style="font-weight:600; color:#1E293B;">Diseño Web - Clínica Dental</div>
                            <div style="font-size:0.85rem; color:#64748B; margin-top:5px;">Dr. Roberto Pérez</div>
                            <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
                                <span style="background:#DBEAFE; color:#1E40AF; font-size:0.75rem; padding:2px 8px; border-radius:4px;">$1,200</span>
                                <span style="font-size:0.75rem; color:#94A3B8;">Hace 2h</span>
                            </div>
                        </div>

                        <div style="background:white; padding:15px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.05); margin-bottom:10px; cursor:grab; border:1px solid #E2E8F0;">
                            <div style="font-weight:600; color:#1E293B;">Campaña Ads - Gym Force</div>
                            <div style="font-size:0.85rem; color:#64748B; margin-top:5px;">María Luján</div>
                            <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
                                <span style="background:#DBEAFE; color:#1E40AF; font-size:0.75rem; padding:2px 8px; border-radius:4px;">$800/mes</span>
                                <span style="font-size:0.75rem; color:#94A3B8;">Ayer</span>
                            </div>
                        </div>
                    </div>

                    <div class="kanban-column" style="min-width: 300px; background: #F8FAFC; border-radius: 12px; padding: 15px; border: 1px solid #E2E8F0; display:flex; flex-direction:column;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-weight:700; color:#334155;">
                            <span>En Propuesta</span>
                            <span style="background:#E2E8F0; padding:2px 8px; border-radius:12px; font-size:0.8rem;">1</span>
                        </div>
                        <div style="height:3px; background:#8B5CF6; width:100%; margin-bottom:15px;"></div>
                        
                        <div style="background:white; padding:15px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.05); margin-bottom:10px; cursor:grab; border:1px solid #E2E8F0;">
                            <div style="font-weight:600; color:#1E293B;">Rebranding - Café Central</div>
                            <div style="font-size:0.85rem; color:#64748B; margin-top:5px;">Carlos Ruiz</div>
                            <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
                                <span style="background:#F3E8FF; color:#6B21A8; font-size:0.75rem; padding:2px 8px; border-radius:4px;">$2,500</span>
                                <span style="font-size:0.75rem; color:#94A3B8;">Hace 3d</span>
                            </div>
                        </div>
                    </div>

                    <div class="kanban-column" style="min-width: 300px; background: #F8FAFC; border-radius: 12px; padding: 15px; border: 1px solid #E2E8F0; display:flex; flex-direction:column;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-weight:700; color:#334155;">
                            <span>Negociación / Cierre</span>
                            <span style="background:#E2E8F0; padding:2px 8px; border-radius:12px; font-size:0.8rem;">0</span>
                        </div>
                        <div style="height:3px; background:#F59E0B; width:100%; margin-bottom:15px;"></div>
                        <div style="flex:1; display:flex; align-items:center; justify-content:center; color:#94A3B8; font-size:0.9rem; border:2px dashed #E2E8F0; border-radius:8px;">
                            Arrastra aquí para cerrar
                        </div>
                    </div>

                </div>
            </div>
        `;
    },
    init: async () => {}
};
