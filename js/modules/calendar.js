import { Modal } from '../components/Modal.js';
import { ProjectsService } from '../services/projects.service.js';
import { Formatters } from '../utils/formatters.js';

// ❌ REMOVED IMPORT OF LAYOUT TO FIX DOUBLE COLUMN ISSUE

export const CalendarModule = {
    currentDate: new Date(),

    render: async () => {
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const monthOptions = monthNames.map((m, i) => `<option value="${i}">${m}</option>`).join('');

        const pageContent = `
            <style>
                /* HEADER CON SELECTORES */
                .cal-top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 12px;
                    border: 1px solid #F1F5F9;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .cal-controls-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .cal-nav-buttons {
                    display: flex; 
                    gap: 10px;
                }

                /* Selectores elegantes */
                .cal-select {
                    padding: 8px 12px;
                    border: 1px solid #E2E8F0;
                    border-radius: 8px;
                    font-weight: 700;
                    color: #1E293B;
                    font-size: 1rem;
                    cursor: pointer;
                    background-color: white;
                    outline: none;
                }
                .cal-select:hover { border-color: var(--primary); }

                .cal-year-input {
                    width: 80px;
                    padding: 8px 10px;
                    border: 1px solid #E2E8F0;
                    border-radius: 8px;
                    font-weight: 700;
                    color: #1E293B;
                    font-size: 1rem;
                    outline: none;
                }
                .cal-year-input:focus { border-color: var(--primary); }

                .nav-btn {
                    background: transparent;
                    border: 1px solid #E2E8F0;
                    border-radius: 8px;
                    width: 32px; height: 32px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: #64748B; transition: all 0.2s;
                }
                .nav-btn:hover { background: #F8FAFC; color: var(--primary); border-color: var(--primary); }

                /* GRILLA - FIX FOR MISSING LINES */
                .calendar-wrapper { background: white; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .days-header { display: grid; grid-template-columns: repeat(7, 1fr); background: #F8FAFC; border-bottom: 1px solid #E2E8F0; }
                .day-name { padding: 12px 0; text-align: center; font-size: 0.75rem; font-weight: 700; color: #94A3B8; text-transform: uppercase; }
                
                /* FIX: Use explicit borders instead of gap for lines */
                .calendar-grid { 
                    display: grid; 
                    grid-template-columns: repeat(7, 1fr); 
                    background: white; 
                    border-top: 1px solid #E2E8F0;
                    border-left: 1px solid #E2E8F0;
                }

                .cal-cell { 
                    background: white; 
                    min-height: 100px; 
                    padding: 8px; 
                    cursor: pointer; 
                    transition: background 0.2s; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 4px;
                    border-right: 1px solid #E2E8F0; /* Right border */
                    border-bottom: 1px solid #E2E8F0; /* Bottom border */
                }
                .cal-cell:hover { background: #F8FAFC; }
                
                .cell-number { font-size: 0.9rem; font-weight: 600; color: #475569; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
                .cell-number.today { background: var(--primary); color: white; box-shadow: 0 2px 5px rgba(59, 130, 246, 0.4); }

                /* Píldoras */
                .task-pill { font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: #EFF6FF; color: #1D4ED8; border-left: 2px solid #3B82F6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
                .delivery-pill { background: #ECFDF5; color: #047857; border-left: 2px solid #10B981; }

                /* --- AJUSTES MÓVIL --- */
                @media (max-width: 480px) {
                    .cal-cell { min-height: 70px; padding: 4px; align-items: center; }
                    .cell-number { font-size: 0.8rem; width: 24px; height: 24px; }
                    .task-pill { font-size: 0px; height: 6px; width: 6px; padding: 0; border-radius: 50%; background: #3B82F6; border: none; }
                    .delivery-pill { background: #10B981; }
                    
                    .cal-controls-left { width: 100%; justify-content: space-between; }
                    .cal-select { flex: 1; }
                    .cal-nav-buttons { width: 100%; justify-content: center; margin-top: 5px; }
                }
            </style>

            <div class="page-header">
                <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);">Calendario</h2>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Agenda y Entregas</p>
            </div>

            <div class="cal-top-bar">
                <div class="cal-controls-left">
                    <select id="calMonthSelect" class="cal-select">
                        ${monthOptions}
                    </select>
                    <input type="number" id="calYearInput" class="cal-year-input" value="${new Date().getFullYear()}" min="2020" max="2030">
                </div>

                <div class="cal-nav-buttons">
                    <button id="btnPrevMonth" class="nav-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button id="btnToday" class="nav-btn" style="width:auto; padding:0 15px; font-size:0.8rem; font-weight:600;">Hoy</button>
                    <button id="btnNextMonth" class="nav-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>

            <div class="calendar-wrapper">
                <div class="days-header">
                    <div class="day-name">Lun</div><div class="day-name">Mar</div><div class="day-name">Mié</div>
                    <div class="day-name">Jue</div><div class="day-name">Vie</div><div class="day-name">Sáb</div>
                    <div class="day-name">Dom</div>
                </div>
                <div id="calendarGrid" class="calendar-grid"></div>
            </div>
            
            ${Modal.render('Agenda del Día', '<div id="dayDetailsContent"></div>', 'modalCalendar')}
        `;
        
        // ❌ REMOVED Layout.render() WRAPPER
        return pageContent;
    },

    init: async () => {
        // ❌ REMOVED Layout.init() CALL
        
        Modal.initEvents('modalCalendar');

        CalendarModule.currentDate = new Date();
        await CalendarModule.updateCalendarView();

        const monthSelect = document.getElementById('calMonthSelect');
        const yearInput = document.getElementById('calYearInput');

        if(monthSelect) {
            monthSelect.addEventListener('change', (e) => {
                CalendarModule.currentDate.setMonth(parseInt(e.target.value));
                CalendarModule.updateCalendarView();
            });
        }

        if(yearInput) {
            yearInput.addEventListener('change', (e) => {
                CalendarModule.currentDate.setFullYear(parseInt(e.target.value));
                CalendarModule.updateCalendarView();
            });
        }

        const btnPrev = document.getElementById('btnPrevMonth');
        if(btnPrev) btnPrev.addEventListener('click', () => {
            CalendarModule.currentDate.setMonth(CalendarModule.currentDate.getMonth() - 1);
            CalendarModule.updateCalendarView();
        });

        const btnNext = document.getElementById('btnNextMonth');
        if(btnNext) btnNext.addEventListener('click', () => {
            CalendarModule.currentDate.setMonth(CalendarModule.currentDate.getMonth() + 1);
            CalendarModule.updateCalendarView();
        });

        const btnToday = document.getElementById('btnToday');
        if(btnToday) btnToday.addEventListener('click', () => {
            CalendarModule.currentDate = new Date();
            CalendarModule.updateCalendarView();
        });
    },

    updateCalendarView: async () => {
        const mSelect = document.getElementById('calMonthSelect');
        const yInput = document.getElementById('calYearInput');
        
        if(mSelect) mSelect.value = CalendarModule.currentDate.getMonth();
        if(yInput) yInput.value = CalendarModule.currentDate.getFullYear();
        
        await CalendarModule.loadCalendar(CalendarModule.currentDate);
    },

    loadCalendar: async (date) => {
        const grid = document.getElementById('calendarGrid');
        
        let allTasks = [];
        
        try {
            const projects = await ProjectsService.getAll(); 
            projects.forEach(p => {
                if(p.tasks && p.tasks.length > 0) {
                    p.tasks.forEach(t => {
                        allTasks.push({ ...t, type: 'task', projectName: p.name, clientName: p.client, clientPhone: "59170000000" });
                    });
                }
                if(p.endDate) {
                    allTasks.push({ description: `Entrega: ${p.name}`, date: p.endDate, type: 'delivery', projectName: p.name, clientName: p.client, clientPhone: "59170000000" });
                }
            });
        } catch (error) {
            console.warn("No se pudieron cargar los proyectos para el calendario", error);
        }

        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; 

        let html = '';
        for (let i = 0; i < startDayOfWeek; i++) { html += `<div class="cal-cell" style="background:#F9FAFB; cursor:default;"></div>`; }

        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDayStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const isToday = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
            const dayTasks = allTasks.filter(t => t.date === currentDayStr);
            const dots = dayTasks.map(t => `<div class="task-pill ${t.type === 'delivery' ? 'delivery-pill' : ''}">${t.description}</div>`).join('');

            html += `
                <div class="cal-cell" onclick="window.openDayDetail('${currentDayStr}')">
                    <span class="cell-number ${isToday ? 'today' : ''}">${day}</span>
                    <div style="display:flex; flex-direction:column; gap:2px; width:100%;">${dots}</div>
                </div>
            `;
        }
        grid.innerHTML = html;

        window.openDayDetail = (dateStr) => {
            const tasks = allTasks.filter(t => t.date === dateStr);
            const container = document.getElementById('dayDetailsContent');
            const dateObj = new Date(dateStr + 'T00:00:00');
            const datePretty = dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
            
            let htmlContent = `<div style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;"><h3 style="margin:0; color:var(--primary); text-transform:capitalize;">${datePretty}</h3></div>`;

            if(tasks.length === 0) {
                htmlContent += `<div style="text-align:center; padding:20px;"><div style="font-size:2rem;">☕</div><p style="color:#64748B;">Sin actividad.</p></div>`;
            } else {
                htmlContent += tasks.map(t => `
                    <div style="background:#F8FAFC; padding:12px; border-radius:8px; border:1px solid #E2E8F0; border-left:4px solid ${t.type === 'delivery' ? '#10B981' : '#3B82F6'}; margin-bottom:10px;">
                        <h4 style="margin:0; color:#1E293B;">${t.description}</h4>
                        <div style="font-size:0.85rem; color:#64748B;">📂 ${t.projectName} | 👤 ${t.clientName}</div>
                        <div style="margin-top:10px;">
                            <a href="https://wa.me/${t.clientPhone}?text=Consulta sobre: ${encodeURIComponent(t.description)}" target="_blank" class="btn-3d" style="background:#22C55E; color:white; padding:5px 10px; border-radius:4px; font-size:0.8rem; text-decoration:none;">💬 WhatsApp</a>
                        </div>
                    </div>`).join('');
            }
            container.innerHTML = htmlContent;
            Modal.open('modalCalendar');
        };
    },

    destroy: () => { delete window.openDayDetail; }
};
