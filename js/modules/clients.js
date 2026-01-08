import { Store } from '../core/store.js';

export const ClientsModule = {
    render: async () => {
        return `
            <div class="page-content">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div>
                        <h2 style="margin:0; color:#1e293b;">Clientes</h2>
                        <p style="color:#64748b;">Base de datos de clientes activos</p>
                    </div>
                    <button style="background:#2563EB; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer;">
                        + Nuevo Cliente
                    </button>
                </div>

                <div style="background:white; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 2px 15px rgba(0,0,0,0.03);">
                    <table style="width:100%; border-collapse:collapse; text-align:left;">
                        <thead style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
                            <tr>
                                <th style="padding:15px; color:#475569; font-size:0.85rem; font-weight:600;">CLIENTE</th>
                                <th style="padding:15px; color:#475569; font-size:0.85rem; font-weight:600;">SERVICIOS ACTIVOS</th>
                                <th style="padding:15px; color:#475569; font-size:0.85rem; font-weight:600;">VALOR MENSUAL</th>
                                <th style="padding:15px; color:#475569; font-size:0.85rem; font-weight:600;">ESTADO</th>
                                <th style="padding:15px; color:#475569; font-size:0.85rem; font-weight:600;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom:1px solid #F1F5F9;">
                                <td style="padding:15px;">
                                    <div style="font-weight:600; color:#1e293b;">Gym Force</div>
                                    <div style="font-size:0.8rem; color:#64748b;">Desde Ene 2025</div>
                                </td>
                                <td style="padding:15px; color:#64748b;">Meta Ads, Diseño Gráfico</td>
                                <td style="padding:15px; font-weight:600; color:#1e293b;">$800</td>
                                <td style="padding:15px;"><span style="background:#DCFCE7; color:#15803D; padding:4px 10px; border-radius:20px; font-size:0.8rem; font-weight:600;">Activo</span></td>
                                <td style="padding:15px;">
                                    <button style="border:none; background:none; color:#2563EB; cursor:pointer; font-weight:500;">Ver Ficha</button>
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
