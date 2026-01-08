import { Layout } from '../components/Layout.js';
import { Table } from '../components/Table.js';
import { Modal } from '../components/Modal.js';
import { LeadsService } from '../services/leads.service.js';
import { SettingsService } from '../services/settings.service.js';
import { Formatters } from '../utils/formatters.js';
import { Store } from '../core/store.js';
import { Router } from '../core/router.js';

export const LeadsModule = {
    render: async () => {
        const availableServices = await SettingsService.getServices();
        
        // Generamos los checkboxes, pero inicialmente estarán ocultos dentro del dropdown
        const servicesCheckboxesHTML = availableServices.map(svc => `
            <label class="service-option" style="display:flex;">
                <input type="checkbox" class="service-chk" value="${svc}">
                <span class="svc-name" style="margin-left:10px;">${svc}</span>
            </label>
        `).join('');

        const formHTML = `
            <style>
                .form-section { background: #F9FAFB; padding: 15px; border-radius: 8px; border: 1px solid #E5E7EB; margin-bottom: 15px; }
                .section-title { margin: 0 0 10px 0; color: var(--primary); font-size: 0.9rem; font-weight: 700; }
                .input-group { display: flex; flex-direction: column; gap: 12px; }
                .input-row { display: flex; gap: 10px; }
                .form-input, .form-select { width: 100%; padding: 10px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.95rem; box-sizing: border-box; }
                
                /* --- ESTILOS DEL DROPDOWN CON BUSCADOR --- */
                .dropdown-wrapper {
                    position: relative;
                    width: 100%;
                }
                
                /* El botón que parece un Select */
                .dropdown-trigger {
                    width: 100%;
                    padding: 10px;
                    background: white;
                    border: 1px solid #D1D5DB;
                    border-radius: 6px;
                    display: flex; justify-content: space-between; align-items: center;
                    cursor: pointer;
                    font-size: 0.95rem;
                    color: #374151;
                }
                .dropdown-trigger:after { content: '▼'; font-size: 0.7rem; color: #6B7280; }

                /* El contenido que se despliega */
                .dropdown-content {
                    display: none; /* Oculto por defecto */
                    position: absolute;
                    top: 105%; left: 0; right: 0;
                    background: white;
                    border: 1px solid #D1D5DB;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    z-index: 100;
                    padding: 10px;
                }
                .dropdown-content.active { display: block; }

                /* Campo de búsqueda (Lupa) */
                .search-box {
                    position: relative;
                    margin-bottom: 8px;
                }
                .search-input {
                    width: 100%;
                    padding: 8px 8px 8px 30px; /* Espacio para icono */
                    border: 1px solid #E5E7EB;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    outline: none;
                }
                .search-icon {
                    position: absolute; left: 8px; top: 8px;
                    font-size: 0.9rem; color: #9CA3AF;
                }

                /* Lista con scroll */
                .services-list-scroll {
                    max-height: 200px;
                    overflow-y: auto;
                    display: flex; flex-direction: column; gap: 2px;
                }
                .service-option {
                    padding: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.1s;
                }
                .service-option:hover { background: #F3F4F6; }
                
                /* --- FIN DROPDOWN --- */

                .total-box { background: #F0FDF4; border: 1px dashed #16A34A; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center; }
                .total-amount { color: #15803D; font-size: 1.8rem; font-weight: 800; display: block; }

                @media (max-width: 480px) {
                    .input-row { flex-direction: column; }
                    .money-row { flex-direction: row; }
                }
            </style>

            <form id="createLeadForm">
                <div class="form-section">
                    <h4 class="section-title">👤 Contacto</h4>
                    <div class="input-group">
                        <input type="text" name="name" class="form-input" placeholder="Nombre Completo *" required>
                        <input type="text" name="company" class="form-input" placeholder="Empresa / Negocio">
                        <div class="input-row">
                            <input type="tel" name="phone" class="form-input" placeholder="📱 WhatsApp">
                            <input type="email" name="email" class="form-input" placeholder="✉️ Email">
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h4 class="section-title">📍 Detalles</h4>
                    <div class="input-group">
                        <div class="input-row">
                            <div style="flex:1;">
                                <label style="font-size:0.75rem; color:#666;">Fecha Registro</label>
                                <input type="date" name="date" class="form-input" required>
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:0.75rem; color:#666;">Estado</label>
                                <select name="status" class="form-select">
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Contactado">Contactado</option>
                                    <option value="Interesado">Interesado</option>
                                    <option value="Cerrado">Cerrado</option>
                                    <option value="Perdido">Perdido</option>
                                </select>
                            </div>
                        </div>
                        <input type="text" name="address" class="form-input" placeholder="Dirección del Negocio">
                        <select name="source" class="form-select">
                            <option value="" disabled selected>-- Fuente del Lead --</option>
                            <option value="Facebook Ads">Facebook Ads</option>
                            <option value="TikTok Ads">TikTok Ads</option>
                            <option value="Instagram Ads">Instagram Ads</option>
                            <option value="Referido">Referido</option>
                            <option value="Orgánico">Orgánico</option>
                        </select>
                    </div>
                </div>

                <div class="form-section">
                    <h4 class="section-title">🛠️ Servicios de Interés</h4>
                    
                    <div class="dropdown-wrapper">
                        <div class="dropdown-trigger" id="servicesDropdownTrigger">
                            <span id="servicesSelectedText">-- Seleccionar Servicios --</span>
                        </div>

                        <div class="dropdown-content" id="servicesDropdownContent">
                            <div class="search-box">
                                <span class="search-icon">🔍</span>
                                <input type="text" id="serviceSearchInput" class="search-input" placeholder="Buscar servicio...">
                            </div>
                            
                            <div class="services-list-scroll" id="servicesListContainer">
                                ${servicesCheckboxesHTML}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-section" style="border-color:#BBF7D0; background:#F0FDF4;">
                    <h4 class="section-title" style="color:#15803D;">💰 Cotización</h4>
                    <div class="input-group">
                        <div class="input-row money-row">
                            <div style="flex: 2;"><label style="font-size:0.7rem;">Inversión</label><input type="number" id="inputInvest" class="form-input" placeholder="0.00"></div>
                            <div style="flex: 1;"><label style="font-size:0.7rem;">Moneda</label><select name="currency" id="inputCurrency" class="form-select" style="background:white;"><option value="BOB">BOB</option><option value="USD">USD</option></select></div>
                        </div>
                        <div class="input-row money-row">
                            <div style="flex: 1;"><label style="font-size:0.7rem;">Descuento</label><input type="number" id="inputDiscount" class="form-input" placeholder="0"></div>
                            <div style="flex: 1;"><label style="font-size:0.7rem;">Tipo</label><select id="discountType" class="form-select" style="background:white;"><option value="amount">Monto ($)</option><option value="percent">Porcentaje (%)</option></select></div>
                        </div>
                        <input type="text" name="discountReason" class="form-input" placeholder="Motivo del descuento">
                    </div>
                    <div class="total-box"><span class="total-label">Total a Cobrar</span><span id="displayTotal" class="total-amount">0.00</span></div>
                </div>

                <button type="submit" class="btn-3d" style="width: 100%; justify-content: center; margin-top: 10px;">Guardar Prospecto</button>
            </form>
        `;

        const modalHTML = Modal.render('Nuevo Prospecto', formHTML, 'modalNewLead');
        const viewModalHTML = Modal.render('Ficha de Prospecto', '<div id="viewLeadContent"></div>', 'modalViewLead');

        const pageContent = `
            <div class="page-header" style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div><h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 5px;">Prospectos</h2><p style="color: var(--text-muted); font-size: 0.9rem;">Gestiona tus oportunidades</p></div>
                <button class="btn-3d" id="btnOpenLeadModal">+ Nuevo Lead</button>
            </div>
            <div id="leadsTableContainer" style="overflow-x: auto;"><div class="loader"></div></div>
            ${modalHTML} ${viewModalHTML}
        `;
        return Layout.render(pageContent, 'Leads');
    },

    init: async () => {
        Layout.init();
        Modal.initEvents('modalNewLead');
        Modal.initEvents('modalViewLead');
        await LeadsModule.loadTable();

        const btnOpen = document.getElementById('btnOpenLeadModal');
        if(btnOpen) btnOpen.addEventListener('click', () => {
            const dateInput = document.querySelector('input[name="date"]');
            if(dateInput) dateInput.valueAsDate = new Date();
            Modal.open('modalNewLead');
        });

        // --- LÓGICA DEL DROPDOWN DE SERVICIOS ---
        const trigger = document.getElementById('servicesDropdownTrigger');
        const content = document.getElementById('servicesDropdownContent');
        const searchInput = document.getElementById('serviceSearchInput');
        const selectedText = document.getElementById('servicesSelectedText');
        const listContainer = document.getElementById('servicesListContainer');

        if(trigger && content) {
            // Abrir/Cerrar
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = content.classList.contains('active');
                if (isVisible) content.classList.remove('active');
                else {
                    content.classList.add('active');
                    searchInput.focus(); // Poner foco en el buscador al abrir
                }
            });

            // Cerrar al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!content.contains(e.target) && !trigger.contains(e.target)) {
                    content.classList.remove('active');
                }
            });

            // Buscador (Filtro en tiempo real)
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const items = listContainer.querySelectorAll('.service-option');
                
                items.forEach(item => {
                    const text = item.querySelector('.svc-name').innerText.toLowerCase();
                    if(text.includes(term)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });

            // Actualizar texto del trigger al seleccionar
            listContainer.addEventListener('change', () => {
                const checked = listContainer.querySelectorAll('.service-chk:checked');
                if(checked.length === 0) {
                    selectedText.innerText = "-- Seleccionar Servicios --";
                    selectedText.style.fontWeight = 'normal';
                } else {
                    selectedText.innerText = `${checked.length} Servicios seleccionados`;
                    selectedText.style.fontWeight = 'bold';
                    selectedText.style.color = 'var(--primary)';
                }
            });
        }
        // ----------------------------------------

        // Lógica de cálculo (Igual que antes)
        const inputInvest = document.getElementById('inputInvest');
        const inputDiscount = document.getElementById('inputDiscount');
        const discountType = document.getElementById('discountType');
        const displayTotal = document.getElementById('displayTotal');
        const inputCurrency = document.getElementById('inputCurrency');

        const calculateTotal = () => {
            if(!inputInvest) return;
            const inv = Number(inputInvest.value) || 0;
            const discVal = Number(inputDiscount.value) || 0;
            const type = discountType.value;
            const curr = inputCurrency.value;
            let finalDiscount = type === 'percent' ? inv * (discVal / 100) : discVal;
            const total = Math.max(0, inv - finalDiscount);
            displayTotal.innerText = `${curr} ${total.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
        };

        if(inputInvest) {
            [inputInvest, inputDiscount, discountType, inputCurrency].forEach(el => {
                el.addEventListener('input', calculateTotal);
                el.addEventListener('change', calculateTotal);
            });
        }

        const form = document.getElementById('createLeadForm');
        if(form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                btn.innerText = 'Guardando...'; btn.disabled = true;
                
                // Recoger servicios
                const selectedServices = [];
                form.querySelectorAll('.service-chk:checked').forEach(chk => selectedServices.push(chk.value));
                
                try {
                    const inv = Number(inputInvest.value) || 0;
                    const discVal = Number(inputDiscount.value) || 0;
                    const type = discountType.value;
                    let finalDiscount = type === 'percent' ? (inv * (discVal / 100)) : discVal;
                    const total = Math.max(0, inv - finalDiscount);
                    const formData = {
                        name: form.name.value,
                        company: form.company.value,
                        phone: form.phone.value,
                        email: form.email.value,
                        date: form.date.value,
                        status: form.status.value,
                        address: form.address.value,
                        source: form.source.value,
                        services: selectedServices,
                        investment: inv,
                        discount: finalDiscount,
                        discountReason: form.discountReason.value + (type === 'percent' ? ` (${discVal}%)` : ''),
                        currency: inputCurrency.value,
                        total: total
                    };
                    await LeadsService.create(formData);
                    Modal.close('modalNewLead');
                    form.reset();
                    displayTotal.innerText = "0.00";
                    selectedText.innerText = "-- Seleccionar Servicios --"; // Reset dropdown text
                    await LeadsModule.loadTable();
                } catch (error) { alert('Error'); } finally { btn.innerText = 'Guardar Prospecto'; btn.disabled = false; }
            });
        }
    },
    loadTable: async () => { /* ... (Igual que antes) ... */ 
        const container = document.getElementById('leadsTableContainer');
        try {
            const leads = await LeadsService.getAll();
            const columns = [
                { header: 'NOMBRE', key: 'name', render: (row) => `<div><strong>${row.name}</strong><div style="font-size:0.75rem; color:#666;">${row.company || '-'}</div></div>` },
                { header: 'ESTADO', key: 'status', render: (row) => `<span style="background:#EFF6FF; color:#3B82F6; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:700;">${row.status}</span>` },
                { header: 'VALOR', key: 'total', render: (row) => `<span style="font-weight:700; color:#059669;">${Formatters.toCurrency(row.total, row.currency)}</span>` },
                { header: 'ACCIONES', key: 'id', render: (row) => `<button class="btn-view-lead" data-id="${row.id}" style="color:var(--primary); font-weight:600; border:none; background:none; cursor:pointer;">Ver</button>` }
            ];
            container.innerHTML = Table.render(columns, leads);
            const btns = container.querySelectorAll('.btn-view-lead');
            btns.forEach(btn => {
                btn.addEventListener('click', async () => { await LeadsModule.viewLead(btn.getAttribute('data-id')); });
            });
        } catch (e) { container.innerHTML = '<p>Error</p>'; }
    },
    viewLead: async (id) => { /* ... (Igual que antes) ... */ 
        const lead = await LeadsService.getById(id);
        if(!lead) return;
        const container = document.getElementById('viewLeadContent');
        const servicesBadges = lead.services && lead.services.length > 0 ? lead.services.map(s => `<span style="background:#EFF6FF; color:#2563EB; padding:4px 8px; border-radius:6px; font-size:0.75rem; border:1px solid #BFDBFE;">${s}</span>`).join('') : '<span style="color:#9CA3AF; font-size:0.8rem;">Sin servicios</span>';
        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div style="display:flex; gap:15px; align-items:center; border-bottom:1px solid #F3F4F6; padding-bottom:15px;">
                    <div style="width:50px; height:50px; background:#E0E7FF; color:#4338CA; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:700;">${lead.name.charAt(0)}</div>
                    <div><h3 style="margin:0; color:#1F2937; font-size:1.1rem;">${lead.name}</h3><p style="margin:2px 0 0 0; color:#6B7280; font-size:0.9rem;">${lead.company || 'Particular'}</p></div>
                </div>
                <div style="display:flex; gap:10px;">
                    <a href="https://wa.me/${lead.phone}" target="_blank" style="flex:1; text-align:center; background:#DCFCE7; color:#166534; padding:10px; border-radius:8px; text-decoration:none; font-weight:600; font-size:0.9rem;">💬 WhatsApp</a>
                    <a href="tel:${lead.phone}" style="flex:1; text-align:center; background:#F3F4F6; color:#374151; padding:10px; border-radius:8px; text-decoration:none; font-weight:600; font-size:0.9rem;">📞 Llamar</a>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; font-size:0.9rem;">
                    <div><small style="color:#9CA3AF;">Estado</small><div style="font-weight:600;">${lead.status}</div></div>
                    <div><small style="color:#9CA3AF;">Fuente</small><div style="font-weight:600;">${lead.source}</div></div>
                    <div><small style="color:#9CA3AF;">Email</small><div style="overflow:hidden; text-overflow:ellipsis;">${lead.email || '-'}</div></div>
                    <div><small style="color:#9CA3AF;">Fecha</small><div>${lead.date}</div></div>
                </div>
                <div><small style="color:#9CA3AF; display:block; margin-bottom:8px;">Intereses</small><div style="display:flex; flex-wrap:wrap; gap:8px;">${servicesBadges}</div></div>
                <div style="background:#F9FAFB; padding:15px; border-radius:8px; border:1px solid #E5E7EB;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.9rem;"><span>Subtotal:</span><span>${Formatters.toCurrency(lead.investment, lead.currency)}</span></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.9rem; color:#EF4444;"><span>Descuento:</span><span>- ${Formatters.toCurrency(lead.discount, lead.currency)}</span></div>
                    <div style="border-top:1px dashed #D1D5DB; padding-top:10px; display:flex; justify-content:space-between; align-items:center;"><span style="font-weight:700;">TOTAL FINAL</span><span style="font-size:1.3rem; font-weight:800; color:#059669;">${Formatters.toCurrency(lead.total, lead.currency)}</span></div>
                </div>
            </div>`;
        Modal.open('modalViewLead');
    },
    destroy: () => {}
};
