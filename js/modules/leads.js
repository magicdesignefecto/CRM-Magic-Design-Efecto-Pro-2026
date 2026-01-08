import { Store } from '../core/store.js';

export const LeadsModule = {
    render: async () => {
        return `
            <div class="page-content">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div>
                        <h2 style="margin:0; color:#1e293b;">Leads</h2>
                        <p style="color:#64748b;">Gestión de prospectos</p>
                    </div>
                    <button style="background:#2563EB; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer;">
                        + Nuevo Lead
                    </button>
                </div>

                <div style="background:white; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 2px 15px rgba(0,0,0,0.03);">
                    <table style="width:100%; border-collapse:collapse; text-align:left;">
                        <thead style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
                            <tr>
                                <th style="padding:15px; color:#475569; font-size:0.85rem; font-weight:600;">NOMBRE</th>
                                <th style="padding:15px; color:#475569; font-size:0.85rem; font-weight:600;">CONTACTO</th>
                                <th style="padding:15px; color:#475569; font-size:0.85rem; font-weight:600;">INTERÉS</th>
                                <th style="padding:15px; color:#475569; font-size:0.85rem; font-weight:600;">ESTADO</th>
                                <th style="padding:15px; color:#475569; font-size:0.85rem; font-weight:600;">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom:1px solid #F1F5F9;">
                                <td style="padding:15px;">
                                    <div style="font-weight:600; color:#1e293b;">Juan Pérez</div>
                                    <div style="font-size:0.8rem; color:#64748b;">Empresa ABC</div>
                                </td>
                                <td style="padding:15px; color:#64748b;">juan@empresa.com<br>+591 70000000</td>
                                <td style="padding:15px;"><span style="background:#EFF6FF; color:#1D4ED8; padding:2px 8px; border-radius:4px; font-size:0.8rem;">Diseño Web</span></td>
                                <td style="padding:15px;"><span style="background:#DBEAFE; color:#1E40AF; padding:4px 10px; border-radius:20px; font-size:0.8rem; font-weight:600;">Nuevo</span></td>
                                <td style="padding:15px;">
                                    <button style="background:#F1F5F9; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">📞</button>
                                    <button style="background:#F1F5F9; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">📧</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },
    init: async () => {}
};
