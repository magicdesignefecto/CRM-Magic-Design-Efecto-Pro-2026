export const QuotesModule = {
    render: async () => {
        return `
            <div class="page-content">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div>
                        <h2 style="margin:0; color:#1e293b;">Cotizaciones</h2>
                        <p style="color:#64748b;">Gestión de propuestas comerciales</p>
                    </div>
                </div>

                <button style="width:100%; background:#2563EB; color:white; border:none; padding:12px; border-radius:8px; font-weight:600; cursor:pointer; margin-bottom:30px;">
                    + Nueva Cotización
                </button>

                <div style="text-align:center; padding:40px; background:white; border-radius:12px; border:1px solid #e2e8f0; color:#94a3b8;">
                    <div style="font-size:2rem; margin-bottom:10px;">📄</div>
                    No hay cotizaciones registradas.
                </div>
            </div>
        `;
    },
    init: async () => {}
};
