export const PipelineModule = {
    render: async () => {
        return `
            <div class="pipeline-container" style="height: 100%; display: flex; flex-direction: column;">
                <div class="header" style="margin-bottom: 20px;">
                    <h2 style="margin:0; color:#1e293b;">Pipeline de Ventas</h2>
                    <p style="color:#64748b;">Arrastra tus oportunidades para avanzar</p>
                </div>

                <div class="kanban-board" style="display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px; height: 100%;">
                    
                    <div class="kanban-column" style="min-width: 300px; background: #F8FAFC; border-radius: 12px; padding: 15px; border: 1px solid #E2E8F0; display:flex; flex-direction:column;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-weight:700; color:#334155;">
                            <span>Nuevo</span>
                            <span style="background:#E2E8F0; px:8px; padding:2px 8px; border-radius:12px; font-size:0.8rem;">0</span>
                        </div>
                        <div style="height:3px; background:#3B82F6; width:100%; margin-bottom:15px;"></div>
                        
                        <div style="flex:1; display:flex; align-items:center; justify-content:center; color:#94A3B8; font-size:0.9rem; border:2px dashed #E2E8F0; border-radius:8px;">
                            -
                        </div>
                    </div>

                    <div class="kanban-column" style="min-width: 300px; background: #F8FAFC; border-radius: 12px; padding: 15px; border: 1px solid #E2E8F0; display:flex; flex-direction:column;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-weight:700; color:#334155;">
                            <span>Propuesta</span>
                            <span style="background:#E2E8F0; px:8px; padding:2px 8px; border-radius:12px; font-size:0.8rem;">0</span>
                        </div>
                        <div style="height:3px; background:#8B5CF6; width:100%; margin-bottom:15px;"></div>
                        <div style="flex:1; display:flex; align-items:center; justify-content:center; color:#94A3B8; font-size:0.9rem; border:2px dashed #E2E8F0; border-radius:8px;">
                            -
                        </div>
                    </div>

                    <div class="kanban-column" style="min-width: 300px; background: #F8FAFC; border-radius: 12px; padding: 15px; border: 1px solid #E2E8F0; display:flex; flex-direction:column;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-weight:700; color:#334155;">
                            <span>Negociación</span>
                            <span style="background:#E2E8F0; px:8px; padding:2px 8px; border-radius:12px; font-size:0.8rem;">0</span>
                        </div>
                        <div style="height:3px; background:#F59E0B; width:100%; margin-bottom:15px;"></div>
                        <div style="flex:1; display:flex; align-items:center; justify-content:center; color:#94A3B8; font-size:0.9rem; border:2px dashed #E2E8F0; border-radius:8px;">
                            -
                        </div>
                    </div>

                </div>
            </div>
        `;
    },
    init: async () => {}
};
