import { Table } from '../components/Table.js';
import { Modal } from '../components/Modal.js';
import { QuotesService } from '../services/quotes.service.js';
import { SettingsService } from '../services/settings.service.js'; // Conexión a Configuración Global
import { Formatters } from '../utils/formatters.js';

// ❌ AQUÍ BORRAMOS EL IMPORT DE LAYOUT

export const QuotesModule = {
    render: async () => {
        // 1. Obtener servicios globales
        const availableServices = await SettingsService.getServices();
        
        const servicesCheckboxesHTML = availableServices.map(svc => `
            <label class="service-option" style="display:flex;">
                <input type="checkbox" class="service-chk" value="${svc}">
                <span class="svc-name" style="margin-left:10px;">${svc}</span>
            </label>
        `).join('');

        const formHTML = `
            <style>
                .form-section { background: #F9FAFB; padding: 15px; border-radius: 8px; border: 1px solid #E5E7EB; margin-bottom: 15px; }
                .input-group { display: flex; flex-direction: column; gap: 12px; }
                .input-row { display: flex; gap: 10px; }
                .form-input, .form-select { width: 100%; padding: 10px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.95rem; box-sizing: border-box; }
                
                /* Estilos Dropdown (Igual a Leads) */
                .dropdown-wrapper { position: relative; width: 100%; }
                .dropdown-trigger { width: 100%; padding: 10px; background: white; border: 1px solid #D1D5DB; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 0.95rem; color: #374151; }
                .dropdown-trigger:after { content: '▼'; font-size: 0.7rem; color: #6B7280; }
                .dropdown-content { display: none; position: absolute; top: 105%; left: 0; right: 0; background: white; border: 1px solid #D1D5DB; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); z-index: 100; padding: 10px; }
                .dropdown-content.active { display: block; }
                .search-box { position: relative; margin-bottom: 8px; }
                .search-input { width: 100%; padding: 8px 8px 8px 30px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 0.9rem; outline: none; }
                .search-icon { position: absolute; left: 8px; top: 8px; font-size: 0.9rem; color: #9CA3AF; }
                .services-list-scroll { max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
                .service-option { padding: 8px; border-radius: 4px; cursor: pointer; transition: background 0.1s; }
                .service-option:hover { background: #F3F4F6; }

                /* Caja Verde Financiera */
                .total-box { background: #F0FDF4; border: 1px dashed #16A34A; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center; }
                .total-amount { color: #15803D; font-size: 1.8rem; font-weight: 800; display: block; }

                @media (max-width: 480px) {
                    .input-row { flex-direction: column; }
                    .money-row { flex-direction: row; }
                }
            </style>

            <form id="createQuoteForm">
                <div class="form-section">
                    <label style="font-weight:700; color:var(--primary); font-size:0.9rem;">Cliente</label>
                    <input type="text" name="client" class="form-input" placeholder="Nombre del cliente o empresa" required style="margin-top:5px;">
                    
                    <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:0.85rem; color:#666;">
                        <span>Fecha: <strong>${new Date().toLocaleDateString()}</strong></span>
                        <span>Cotización #: <strong>Auto (1)</strong></span>
                    </div>
                </div>

                <div class="form-section">
                    <label style="font-weight:700; color:var(--primary); font-size:0.9rem; display:block; margin-bottom:5px;">🛠️ Servicios a Cotizar</label>
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
                    
                    <textarea name="description" class="form-input" rows="3" placeholder="Descripción detallada o notas adicionales..." style="margin-top:10px;"></textarea>
                </div>

                <div class="form-section" style="border-color:#BBF7D0; background:#F0FDF4;">
                    <h4 style="margin:0 0 10px 0; color:#15803D; font-size:0.9rem; font-weight:700;">💰 Detalles Financieros</h4>
                    <div class="input-group">
                        <div class="input-row money-row">
                            <div style="flex: 2;"><label style="font-size:0.7rem;">Inversión</label><input type="number" id="inputInvest" class="form-input" placeholder="0.00"></div>
                            <div style="flex: 1;"><label style="font-size:0.7rem;">Moneda</label><select name="currency" id="inputCurrency" class="form-select" style="background:white;"><option value="BOB">BOB</option><option value="USD">USD</option></select></div>
                        </div>
                        <div class="input-row money-row">
                            <div style="flex: 1;"><label style="font-size:0.7rem;">Descuento</label><input type="number" id="inputDiscount" class="form-input" placeholder="0"></div>
                            <div style="flex: 1;"><label style="font-size:0.7rem;">Tipo</label><select id="discountType" class="form-select" style="background:white;"><option value="amount">Monto ($)</option><option value="percent">Porcentaje (%)</option></select></div>
                        </div>
                    </div>
                    <div class="total-box"><span class="total-label">Total Cotizado</span><span id="displayTotal" class="total-amount">0.00</span></div>
                </div>

                <div style="display:flex; gap:10px; margin-top:15px;">
                    <button type="button" id="btnPreviewPDF" class="btn-3d" style="flex:1; background:white; color:#333; border:1px solid #ccc;">📄 Ver PDF</button>
                    <button type="submit" class="btn-3d" style="flex:2; justify-content: center;">Guardar Cotización</button>
                </div>
            </form>
        `;

        const modalHTML = Modal.render('Nueva Cotización', formHTML, 'modalNewQuote');

        const pageContent = `
            <div class="page-header" style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                    <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 5px;">Cotizaciones</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Gestión de propuestas comerciales</p>
                </div>
                <button class="btn-3d" id="btnOpenQuoteModal">+ Nueva</button>
            </div>
            
            <div id="quotesTableContainer" style="overflow-x: auto;">
                <div style="text-align:center; padding:40px; color:#9CA3AF;">No hay cotizaciones registradas.</div>
            </div>
            
            ${modalHTML}
        `;
        
        // ❌ CAMBIO IMPORTANTE: Quitamos "Layout.render()"
        return pageContent;
    },

    init: async () => {
        // ❌ CAMBIO IMPORTANTE: Quitamos "Layout.init()"
        
        Modal.initEvents('modalNewQuote');
        await QuotesModule.loadTable();

        const btnOpen = document.getElementById('btnOpenQuoteModal');
        if(btnOpen) btnOpen.addEventListener('click', () => Modal.open('modalNewQuote'));

        // --- LÓGICA DROPDOWN (Igual a Leads) ---
        const trigger = document.getElementById('servicesDropdownTrigger');
        const content = document.getElementById('servicesDropdownContent');
        const searchInput = document.getElementById('serviceSearchInput');
        const selectedText = document.getElementById('servicesSelectedText');
        const listContainer = document.getElementById('servicesListContainer');

        if(trigger && content) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                content.classList.toggle('active');
                if(content.classList.contains('active')) searchInput.focus();
            });

            document.addEventListener('click', (e) => {
                if (!content.contains(e.target) && !trigger.contains(e.target)) content.classList.remove('active');
            });

            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                listContainer.querySelectorAll('.service-option').forEach(item => {
                    item.style.display = item.innerText.toLowerCase().includes(term) ? 'flex' : 'none';
                });
            });

            listContainer.addEventListener('change', () => {
                const count = listContainer.querySelectorAll('.service-chk:checked').length;
                selectedText.innerText = count > 0 ? `${count} Servicios seleccionados` : "-- Seleccionar Servicios --";
                selectedText.style.fontWeight = count > 0 ? 'bold' : 'normal';
                selectedText.style.color = count > 0 ? 'var(--primary)' : '#374151';
            });
        }

        // --- LÓGICA FINANCIERA (Igual a Leads) ---
        const inputInvest = document.getElementById('inputInvest');
        const inputDiscount = document.getElementById('inputDiscount');
        const discountType = document.getElementById('discountType');
        const displayTotal = document.getElementById('displayTotal');
        const inputCurrency = document.getElementById('inputCurrency');

        const calculateTotal = () => {
            const inv = Number(inputInvest.value) || 0;
            const discVal = Number(inputDiscount.value) || 0;
            const type = discountType.value;
            let finalDiscount = type === 'percent' ? inv * (discVal / 100) : discVal;
            const total = Math.max(0, inv - finalDiscount);
            displayTotal.innerText = `${inputCurrency.value} ${total.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
            return { total, finalDiscount };
        };

        if(inputInvest) {
            [inputInvest, inputDiscount, discountType, inputCurrency].forEach(el => {
                el.addEventListener('input', calculateTotal);
                el.addEventListener('change', calculateTotal);
            });
        }

        // --- GENERACIÓN PDF ---
        const btnPDF = document.getElementById('btnPreviewPDF');
        if(btnPDF) {
            btnPDF.addEventListener('click', () => {
                QuotesModule.generatePDF();
            });
        }

        // Guardar
        const form = document.getElementById('createQuoteForm');
        if(form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                alert('Guardado simulado. Esperando backend.');
                Modal.close('modalNewQuote');
            });
        }
    },

    loadTable: async () => {
        // Tabla vacía por limpieza
    },

    // --- FUNCIÓN PDF RENOVADA ---
    generatePDF: () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Datos del Formulario
        const form = document.getElementById('createQuoteForm');
        const clientName = form.client.value || "Cliente General";
        const desc = form.description.value;
        const currency = document.getElementById('inputCurrency').value;
        const invest = Number(document.getElementById('inputInvest').value) || 0;
        
        // Calcular totales nuevamente para asegurar
        const discVal = Number(document.getElementById('inputDiscount').value) || 0;
        const discType = document.getElementById('discountType').value;
        let discountAmount = discType === 'percent' ? invest * (discVal / 100) : discVal;
        const total = Math.max(0, invest - discountAmount);

        // Servicios seleccionados
        const selectedServices = [];
        document.querySelectorAll('.service-chk:checked').forEach(chk => selectedServices.push(chk.value));

        // --- DISEÑO PDF ---
        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59);
        doc.text("COTIZACIÓN", 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Nº Cotización: #001`, 20, 35); // Simulamos el #1

        // Cliente
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Cliente:", 20, 50);
        doc.setFontSize(12);
        doc.text(clientName, 20, 58);

        // Línea divisoria
        doc.setDrawColor(200);
        doc.line(20, 65, 190, 65);

        // Lista de Servicios
        doc.setFontSize(14);
        doc.text("Servicios:", 20, 75);
        
        let yPos = 85;
        doc.setFontSize(11);
        if(selectedServices.length > 0) {
            selectedServices.forEach(svc => {
                doc.text(`• ${svc}`, 25, yPos);
                yPos += 8;
            });
        } else {
            doc.text("(Sin servicios seleccionados)", 25, yPos);
            yPos += 8;
        }

        if(desc) {
            yPos += 5;
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Notas:", 20, yPos);
            yPos += 5;
            doc.text(desc, 20, yPos);
            yPos += 15;
        } else {
            yPos += 10;
        }

        // Totales (Caja financiera en PDF)
        yPos += 10;
        doc.setDrawColor(0);
        doc.setFillColor(240, 253, 244); // Color verdoso muy claro
        doc.rect(120, yPos, 70, 40, 'F'); // Caja de fondo

        doc.setTextColor(0);
        doc.setFontSize(10);
        doc.text(`Subtotal:`, 125, yPos + 10);
        doc.text(`${Formatters.toCurrency(invest, currency)}`, 185, yPos + 10, { align: 'right' });

        doc.setTextColor(220, 38, 38); // Rojo
        doc.text(`Descuento:`, 125, yPos + 20);
        doc.text(`- ${Formatters.toCurrency(discountAmount, currency)}`, 185, yPos + 20, { align: 'right' });

        doc.setFontSize(14);
        doc.setTextColor(21, 128, 61); // Verde oscuro
        doc.setFont(undefined, 'bold');
        doc.text(`TOTAL:`, 125, yPos + 32);
        doc.text(`${Formatters.toCurrency(total, currency)}`, 185, yPos + 32, { align: 'right' });

        // Guardar PDF
        doc.save(`Cotizacion_${clientName.replace(/\s+/g, '_')}.pdf`);
    },

    destroy: () => {}
};
