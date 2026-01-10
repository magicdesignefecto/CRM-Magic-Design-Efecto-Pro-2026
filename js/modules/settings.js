import { UsersService } from '../services/users.service.js';
import { Store } from '../core/store.js';

export const SettingsModule = {
    render: async () => {
        // Verificar si soy Admin (Seguridad visual)
        const user = Store.getState().user;
        const isAdmin = user?.role === 'Admin' || user?.email === 'diego.gonzales7891@gmail.com'; // <--- Tu correo maestro

        if (!isAdmin) {
            return `
                <div style="text-align:center; padding:50px;">
                    <i class="fas fa-lock" style="font-size:3rem; color:#CBD5E1;"></i>
                    <h3 style="color:#64748B; margin-top:20px;">Acceso Restringido</h3>
                    <p>Solo los administradores pueden ver esta sección.</p>
                </div>
            `;
        }

        // Cargamos los usuarios pendientes
        const pendingUsers = await UsersService.getPendingUsers();
        
        // HTML de la tabla
        let usersHtml = '';
        
        if (pendingUsers.length === 0) {
            usersHtml = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <p>¡Todo al día! No hay solicitudes pendientes.</p>
                </div>
            `;
        } else {
            usersHtml = pendingUsers.map(u => `
                <div class="user-card">
                    <div class="u-info">
                        <div class="u-avatar">${u.name.charAt(0)}</div>
                        <div>
                            <h4>${u.name}</h4>
                            <p>${u.email}</p>
                            <span class="badge-role">${u.role || 'Sin cargo'}</span>
                            <div class="u-contact">
                                <i class="fab fa-whatsapp"></i> ${u.phone || 'Sin cel'}
                            </div>
                        </div>
                    </div>
                    <div class="u-actions">
                        <button class="btn-approve" onclick="approveUser('${u.id}', '${u.name}')">
                            <i class="fas fa-check"></i> Aprobar
                        </button>
                        <button class="btn-deny" onclick="denyUser('${u.id}')">
                            <i class="fas fa-times"></i> Denegar
                        </button>
                    </div>
                </div>
            `).join('');
        }

        return `
            <style>
                .settings-container { max-width: 900px; margin: 0 auto; }
                .section-header { margin-bottom: 25px; border-bottom: 1px solid #E2E8F0; padding-bottom: 15px; }
                .section-header h3 { margin: 0; color: #1E293B; font-size: 1.2rem; }
                .section-header p { margin: 5px 0 0; color: #64748B; font-size: 0.9rem; }

                /* User Card Style */
                .user-card { background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.02); transition: 0.2s; }
                .user-card:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
                
                .u-info { display: flex; gap: 15px; align-items: center; }
                .u-avatar { width: 45px; height: 45px; background: #3B82F6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; }
                .u-info h4 { margin: 0; color: #0F172A; }
                .u-info p { margin: 2px 0; color: #64748B; font-size: 0.9rem; }
                .badge-role { background: #EEF2FF; color: #4F46E5; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
                .u-contact { font-size: 0.85rem; color: #10B981; margin-top: 4px; display:flex; align-items:center; gap:5px; }

                .u-actions { display: flex; gap: 10px; }
                .btn-approve { background: #10B981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 5px; transition: 0.2s; }
                .btn-approve:hover { background: #059669; }
                
                .btn-deny { background: #FEE2E2; color: #EF4444; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 5px; transition: 0.2s; }
                .btn-deny:hover { background: #DC2626; color: white; }

                .empty-state { text-align: center; padding: 40px; color: #94A3B8; }
                .empty-state i { font-size: 3rem; margin-bottom: 15px; color: #CBD5E1; }
                
                @media (max-width: 600px) {
                    .user-card { flex-direction: column; text-align: center; gap: 20px; }
                    .u-info { flex-direction: column; }
                    .u-actions { width: 100%; justify-content: center; }
                }
            </style>

            <div class="settings-container">
                <div class="section-header">
                    <h3>Solicitudes de Acceso</h3>
                    <p>Aprueba o deniega el acceso a nuevos usuarios del CRM.</p>
                </div>

                <div id="usersList">
                    ${usersHtml}
                </div>
            </div>
        `;
    },

    init: async () => {
        // Funciones Globales para los botones (Window scope)
        window.approveUser = async (uid, name) => {
            const result = await Swal.fire({
                title: `¿Aprobar a ${name}?`,
                text: "Podrá acceder al CRM inmediatamente.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10B981',
                confirmButtonText: 'Sí, aprobar'
            });

            if (result.isConfirmed) {
                try {
                    await UsersService.updateStatus(uid, 'approved');
                    Swal.fire('¡Aprobado!', 'El usuario ya tiene acceso.', 'success');
                    // Recargar módulo
                    document.querySelector('a[href="#/settings"]').click();
                } catch (e) {
                    Swal.fire('Error', 'No se pudo actualizar.', 'error');
                }
            }
        };

        window.denyUser = async (uid) => {
            const result = await Swal.fire({
                title: '¿Denegar acceso?',
                text: "El usuario quedará bloqueado.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#EF4444',
                confirmButtonText: 'Sí, denegar'
            });

            if (result.isConfirmed) {
                try {
                    await UsersService.updateStatus(uid, 'rejected');
                    Swal.fire('Denegado', 'Solicitud rechazada.', 'info');
                    document.querySelector('a[href="#/settings"]').click();
                } catch (e) {
                    Swal.fire('Error', 'No se pudo actualizar.', 'error');
                }
            }
        };
    }
};
