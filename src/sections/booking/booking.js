// booking.js

const SUPABASE_URL = 'https://lmkmgyxeqkkicywahhfs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxta21neXhlcWtraWN5d2FoaGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0OTE2MDcsImV4cCI6MjA5MzA2NzYwN30.MVk7zdKpBKmQ3Vgp9iyj6Yy9yK1k3q5xmhcvYSrmoRg';
const TENANT_SLUG = 'vora';

let supabaseClient = null;
let tenantId = null;
let timezone = 'America/Sao_Paulo';

// Estado do Agendamento Atual
const state = {
    currentPaneIndex: 0,
    selectedService: null,
    selectedStaffId: null, // ID do profissional ou 'any'
    selectedDate: '', // Format: YYYY-MM-DD
    selectedSlot: '',
    finalStaffId: null, // ID real do profissional que receberá a reserva no final
    viewDate: new Date(), // Para controle do calendário
    turnstileToken: '',
    turnstileRendered: false,
    slotsMap: {}, // Mapeia { '10:00': [staff_id1, staff_id2] }
    activeStaffList: [] // Lista de profissionais ativas qualificadas para o serviço atual
};

document.addEventListener('DOMContentLoaded', () => {
    initBookingWidget();
});

// Helper para sanitizar strings contra XSS
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Helpers de Fuso Horário
function getNowInTimezoneParts(tz) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz || 'America/Sao_Paulo',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const parts = formatter.formatToParts(now).reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
    }, {});
    return {
        date: `${parts.year}-${parts.month}-${parts.day}`,
        time: `${parts.hour}:${parts.minute}`
    };
}

function convertToISOInTimezone(dateStr, timeStr, tz) {
    const local = new Date(`${dateStr}T${timeStr}`);
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const parts = formatter.formatToParts(local).reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
    }, {});
    const tzDate = new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`);
    const diff = local.getTime() - tzDate.getTime();
    return new Date(local.getTime() + diff).toISOString();
}

// Carrega a biblioteca Supabase dinamicamente se necessário
async function loadSupabaseLib() {
    if (typeof supabase === 'undefined') {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }
}

// Carrega o script do Cloudflare Turnstile dinamicamente se necessário
function loadTurnstileLib() {
    if (!document.querySelector('script[src*="turnstile/v0/api.js"]')) {
        const turnstileScript = document.createElement('script');
        turnstileScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        turnstileScript.async = true;
        turnstileScript.defer = true;
        document.head.appendChild(turnstileScript);
    }
}

async function initBookingWidget() {
    const widget = document.getElementById('booking-widget-container');
    if (!widget) return;

    // Elementos da Interface VÖRA
    const panes = widget.querySelectorAll('.widget-pane');
    const steps = widget.querySelectorAll('.widget-steps-indicator .step');
    const btnPane1Next = document.getElementById('btn-pane1-next');
    const btnPane2Next = document.getElementById('btn-pane2-next');
    const btnPane3Next = document.getElementById('btn-pane3-next');
    const submitBtn = document.getElementById('btn-finish-booking');
    const backBtns = widget.querySelectorAll('.btn-back-pane');
    
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('btn-close-success-modal');
    
    // Inputs
    const nameInput = document.getElementById('client-name');
    const whatsappInput = document.getElementById('client-whatsapp');
    const emailInput = document.getElementById('client-email');
    
    // Resumo do Modal
    const summaryTechnique = document.getElementById('summary-technique');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');

    // Helper para scroll suave customizado de luxo
    const smoothScrollToElement = (element, duration = 900, offset = 0) => {
        const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeOutCubic(Math.min(timeElapsed / duration, 1));
            window.scrollTo(0, startPosition + distance * run);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    const updateStepStyles = () => {
        steps.forEach((step, index) => {
            let isEnabled = false;
            if (index === 0) {
                isEnabled = true;
            } else if (index === 1) {
                isEnabled = !!state.selectedService;
            } else if (index === 2) {
                isEnabled = !!state.selectedService && !!state.selectedStaffId;
            } else if (index === 3) {
                isEnabled = !!state.selectedService && !!state.selectedStaffId && !!state.selectedDate && !!state.selectedSlot;
            }
            step.classList.toggle('clickable', isEnabled);
        });
    };

    // Navegação entre painéis
    const showPane = (index) => {
        panes.forEach((pane, i) => {
            pane.classList.toggle('active', i === index);
        });
        steps.forEach((step, i) => {
            step.classList.toggle('active', i <= index);
        });
        state.currentPaneIndex = index;

        updateStepStyles();

        // Scroll suave automático para o topo do card (widget de agendamento)
        const widgetContainer = document.getElementById('booking-widget-container');
        if (widgetContainer) {
            smoothScrollToElement(widgetContainer, 400, 100); // 400ms de scroll com 100px de folga para o menu fixo
        }
    };

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            let canNavigate = false;
            if (index === 0) {
                canNavigate = true;
            } else if (index === 1) {
                canNavigate = !!state.selectedService;
            } else if (index === 2) {
                canNavigate = !!state.selectedService && !!state.selectedStaffId;
            } else if (index === 3) {
                canNavigate = !!state.selectedService && !!state.selectedStaffId && !!state.selectedDate && !!state.selectedSlot;
            }

            if (canNavigate) {
                showPane(index);
                if (index === 1) {
                    loadStaff();
                } else if (index === 2) {
                    renderCalendar();
                } else if (index === 3) {
                    initTurnstile();
                }
            }
        });
    });

    updateStepStyles();

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.currentPaneIndex > 0) {
                showPane(state.currentPaneIndex - 1);
            }
        });
    });

    btnPane1Next.addEventListener('click', () => {
        if (state.selectedService) {
            showPane(1);
            loadStaff();
        }
    });

    btnPane2Next.addEventListener('click', () => {
        if (state.selectedStaffId) {
            showPane(2);
            renderCalendar();
        }
    });

    btnPane3Next.addEventListener('click', () => {
        if (state.selectedDate && state.selectedSlot) {
            showPane(3);
            initTurnstile();
        }
    });

    // --- Inicialização do Supabase ---
    try {
        await loadSupabaseLib();
        loadTurnstileLib();

        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Buscar dados do Tenant
        const { data: tenantData, error: tenantError } = await supabaseClient
            .from('tenants')
            .select('id, timezone')
            .eq('slug', TENANT_SLUG)
            .single();

        if (tenantError || !tenantData) {
            console.error("Erro ao carregar tenant no Supabase da Slotty:", tenantError);
            return;
        }

        tenantId = tenantData.id;
        timezone = tenantData.timezone || 'America/Sao_Paulo';

        // Carregar os serviços reais da Slotty
        await loadServices();
    } catch (err) {
        console.error("Erro durante a inicialização do widget Slotty:", err);
    }

    async function loadServices() {
        const container = document.getElementById('technique-options-container');
        if (!container) return;

        const { data: services, error: servicesError } = await supabaseClient
            .from('services')
            .select('*')
            .eq('tenant_id', tenantId)
            .eq('is_active', true)
            .is('deleted_at', null)
            .order('name', { ascending: true });

        if (servicesError) {
            container.innerHTML = '<div style="text-align:center; padding:30px; color:#ff6b6b;">Erro ao carregar serviços.</div>';
            return;
        }

        if (!services || services.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:30px; color:rgba(31, 31, 31, 0.5);">Nenhum serviço disponível no momento.</div>';
            return;
        }

        container.innerHTML = '';
        services.forEach(svc => {
            const label = document.createElement('label');
            label.className = 'technique-option-card';
            
            const hrs = Math.floor(svc.duration_minutes / 60);
            const mins = svc.duration_minutes % 60;
            const durationText = hrs > 0 ? `${hrs}h${mins > 0 ? ` ${mins}min` : ''}` : `${mins}min`;

            label.innerHTML = `
                <input type="radio" name="booking-technique" value="${svc.id}">
                <span class="option-custom-radio"></span>
                <div class="option-info">
                    <span class="option-name">${escapeHTML(svc.name)}</span>
                    <span class="option-meta">${durationText} • R$ ${svc.price.toFixed(2)}</span>
                </div>
            `;

            label.addEventListener('click', () => {
                state.selectedService = svc;
                // Reseta escolhas subsequentes
                state.selectedStaffId = null;
                state.selectedDate = '';
                state.selectedSlot = '';
                state.finalStaffId = null;
                btnPane2Next.disabled = true;
                btnPane3Next.disabled = true;

                container.querySelectorAll('.technique-option-card').forEach(card => card.classList.remove('active-card'));
                label.classList.add('active-card');

                const radio = label.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;

                btnPane1Next.disabled = false;

                // Avanço automático com delay curtíssimo (80ms)
                setTimeout(() => {
                    showPane(1);
                    loadStaff();
                }, 80);
            });

            container.appendChild(label);
        });
    }

    // --- Carregamento Dinâmico de Profissionais ---
    async function loadStaff() {
        const container = document.getElementById('staff-options-container');
        if (!container) return;

        container.innerHTML = '<div style="text-align:center; padding:30px; color:rgba(31, 31, 31, 0.5); font-family:var(--font-body); font-size:0.95rem;">Carregando profissionais...</div>';

        try {
            // Buscar profissionais vinculadas ao serviço selecionado
            const { data: staffServices, error: staffSvcError } = await supabaseClient
                .from('staff_services')
                .select('staff:staff_id ( id, name, avatar_url, is_active, deleted_at )')
                .eq('service_id', state.selectedService.id)
                .eq('tenant_id', tenantId);

            if (staffSvcError) throw staffSvcError;

            state.activeStaffList = staffServices
                .map(item => item.staff)
                .filter(s => s && s.is_active && !s.deleted_at);

            if (state.activeStaffList.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding:30px; color:rgba(31, 31, 31, 0.5);">Nenhum profissional qualificado para este serviço.</div>';
                return;
            }

            container.innerHTML = '';

            // Adicionar cada profissional individual
            state.activeStaffList.forEach(stf => {
                const label = document.createElement('label');
                label.className = 'technique-option-card';

                const avatarHtml = stf.avatar_url 
                    ? `<img src="${stf.avatar_url}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; margin-right:1.2rem; flex-shrink:0;">`
                    : `<div style="width:40px; height:40px; border-radius:50%; background:rgba(187,163,135,0.12); color:var(--color-primary); display:flex; align-items:center; justify-content:center; font-weight:700; margin-right:1.2rem; flex-shrink:0;">${escapeHTML(stf.name).charAt(0)}</div>`;

                label.innerHTML = `
                    <input type="radio" name="booking-staff" value="${stf.id}">
                    <span class="option-custom-radio"></span>
                    ${avatarHtml}
                    <div class="option-info">
                        <span class="option-name">${escapeHTML(stf.name)}</span>
                        <span class="option-meta">Profissional Especialista</span>
                    </div>
                `;

                label.addEventListener('click', () => {
                    state.selectedStaffId = stf.id;
                    state.selectedDate = '';
                    state.selectedSlot = '';
                    btnPane3Next.disabled = true;

                    container.querySelectorAll('.technique-option-card').forEach(card => card.classList.remove('active-card'));
                    label.classList.add('active-card');

                    const radio = label.querySelector('input[type="radio"]');
                    if (radio) radio.checked = true;

                    btnPane2Next.disabled = false;

                    // Avanço automático com delay curtíssimo (80ms)
                    setTimeout(() => {
                        showPane(2);
                        renderCalendar();
                    }, 80);
                });

                container.appendChild(label);
            });

        } catch (err) {
            console.error(err);
            container.innerHTML = '<div style="text-align:center; padding:30px; color:#ff6b6b;">Erro ao carregar equipe.</div>';
        }
    }

    // --- Renderização Dinâmica do Calendário ---
    function renderCalendar() {
        const grid = document.getElementById('calendar-dates-grid');
        const monthYearSpan = document.getElementById('calendar-month-year');
        if (!grid || !monthYearSpan) return;

        const month = state.viewDate.getMonth();
        const year = state.viewDate.getFullYear();
        const monthNames = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        monthYearSpan.textContent = `${monthNames[month]} ${year}`;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const nowParts = getNowInTimezoneParts(timezone);
        const todayStr = nowParts.date;

        let html = '';

        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            html += `<span class="day disabled">${prevMonthDays - i}</span>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const isPast = dStr < todayStr;
            const isSelected = dStr === state.selectedDate;
            const isToday = dStr === todayStr;

            const classes = [];
            if (isPast) classes.push('disabled');
            if (isSelected) classes.push('active');
            if (isToday && !isSelected) classes.push('today');

            html += `<span class="day ${classes.join(' ')}" data-date="${dStr}">${day}</span>`;
        }

        grid.innerHTML = html;

        grid.querySelectorAll('.day:not(.disabled)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                grid.querySelectorAll('.day').forEach(el => el.classList.remove('active'));
                dayEl.classList.add('active');
                
                const clickedDate = dayEl.getAttribute('data-date');
                selectDate(clickedDate);
            });
        });
    }

    document.getElementById('cal-prev').onclick = (e) => {
        e.preventDefault();
        const now = new Date();
        const minDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const targetDate = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() - 1, 1);
        if (targetDate >= minDate) {
            state.viewDate.setMonth(state.viewDate.getMonth() - 1);
            renderCalendar();
        }
    };

    document.getElementById('cal-next').onclick = (e) => {
        e.preventDefault();
        state.viewDate.setMonth(state.viewDate.getMonth() + 1);
        renderCalendar();
    };

    async function selectDate(dStr) {
        state.selectedDate = dStr;
        state.selectedSlot = '';
        state.finalStaffId = null;
        btnPane3Next.disabled = true;

        const dateObj = new Date(`${dStr}T00:00:00`);
        const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        const dayName = dayNames[dateObj.getDay()];
        const formattedDate = dStr.split('-').reverse().slice(0, 2).join('/');

        const slotHeader = document.getElementById('timeslots-header');
        if (slotHeader) {
            slotHeader.textContent = `Horários Disponíveis (${dayName}, ${formattedDate}):`;
        }

        await updateAvailableSlots();
    }

    // --- Cálculo e Renderização dos Slots ---
    async function updateAvailableSlots() {
        const grid = document.getElementById('timeslots-grid');
        if (!grid) return;

        if (!state.selectedDate || !state.selectedService || !state.selectedStaffId) {
            grid.innerHTML = '<div style="text-align:center; padding:20px; color:rgba(31, 31, 31, 0.4);">Selecione uma data no calendário</div>';
            return;
        }

        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px;"><div style="display:inline-block; width:20px; height:20px; border:2px solid rgba(187,163,135,0.2); border-top-color:var(--color-primary); border-radius:50%; animation:spin 0.8s linear infinite;"></div></div>';

        try {
            const dateObj = new Date(`${state.selectedDate}T00:00:00`);
            const dayOfWeek = dateObj.getDay();
            const duration = state.selectedService.duration_minutes;

            // 1. Filtrar lista de profissionais de acordo com a seleção da cliente
            const staffToQuery = state.activeStaffList.filter(s => s.id === state.selectedStaffId);

            if (staffToQuery.length === 0) {
                grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px; color:rgba(31, 31, 31, 0.5);">Profissional não disponível.</div>';
                return;
            }

            // 2. Buscar horas de funcionamento
            const { data: bh, error: bhError } = await supabaseClient
                .from('business_hours')
                .select('*')
                .eq('tenant_id', tenantId)
                .eq('day_of_week', dayOfWeek)
                .single();

            if (bhError || !bh || bh.is_closed) {
                grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px; color:var(--color-primary);">O estabelecimento está fechado neste dia.</div>';
                return;
            }

            // 3. Obter slots por profissional
            const staffSlotsPromises = staffToQuery.map(async (stf) => {
                const [shRes, appRes] = await Promise.all([
                    supabaseClient.from('staff_working_hours').select('*').eq('tenant_id', tenantId).eq('staff_id', stf.id).eq('day_of_week', dayOfWeek).maybeSingle(),
                    supabaseClient.from('appointments').select('start_time, end_time, status').eq('tenant_id', tenantId).eq('staff_id', stf.id).gte('start_time', `${state.selectedDate}T00:00:00`).lte('start_time', `${state.selectedDate}T23:59:59`).is('deleted_at', null)
                ]);

                const sh = shRes.data;
                const appointments = (appRes.data || []).filter(app => app.status !== 'cancelled');

                if (sh && sh.is_closed) {
                    return { staffId: stf.id, slots: [], isClosed: true };
                }

                let openTime = bh.open_time || '09:00';
                let closeTime = bh.close_time || '18:00';
                if (sh) {
                    if (sh.open_time > openTime) openTime = sh.open_time;
                    if (sh.close_time < closeTime) closeTime = sh.close_time;
                }

                const nowParts = getNowInTimezoneParts(timezone);
                const isToday = state.selectedDate === nowParts.date;
                const currentTimeStr = nowParts.time;

                const slots = [];
                let current = new Date(`${state.selectedDate}T${openTime}`);
                const endLimit = new Date(`${state.selectedDate}T${closeTime}`);

                while (current < endLimit) {
                    const sStart = current.toTimeString().substring(0, 5);
                    const sEnd = new Date(current.getTime() + duration * 60000);
                    const sEndStr = sEnd.toTimeString().substring(0, 5);

                    if (sEnd <= endLimit) {
                        if (isToday && sStart <= currentTimeStr) {
                            current = new Date(current.getTime() + 30 * 60000);
                            continue;
                        }

                        const isBusy = appointments.some(app => {
                            const aStart = new Date(app.start_time).toTimeString().substring(0, 5);
                            const aEnd = new Date(app.end_time).toTimeString().substring(0, 5);
                            return (sStart < aEnd && sEndStr > aStart);
                        });

                        const isBreak = [...(bh.breaks || []), ...(sh?.breaks || [])].some(brk => (sStart < brk.end.substring(0, 5) && sEndStr > brk.start.substring(0, 5)));

                        if (!isBusy && !isBreak) {
                            slots.push(sStart);
                        }
                    }
                    current = new Date(current.getTime() + 30 * 60000);
                }
                return { staffId: stf.id, slots, isClosed: false };
            });

            const staffSlotsResults = await Promise.all(staffSlotsPromises);

            // 4. Consolidar os slots livres
            state.slotsMap = {};
            let isStaffClosed = false;
            staffSlotsResults.forEach(res => {
                if (!res) return;
                if (res.isClosed) {
                    isStaffClosed = true;
                }
                if (!res.slots) return;
                res.slots.forEach(slot => {
                    if (!state.slotsMap[slot]) state.slotsMap[slot] = [];
                    state.slotsMap[slot].push(res.staffId);
                });
            });

            const availableSlots = Object.keys(state.slotsMap).sort();

            grid.innerHTML = '';
            if (isStaffClosed) {
                grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px; color:var(--color-primary);">O profissional selecionado não trabalha nesse dia.</div>';
            } else if (availableSlots.length === 0) {
                grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px; color:rgba(31, 31, 31, 0.5);">Nenhum horário livre para este dia.</div>';
            } else {
                availableSlots.forEach(slot => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = `timeslot ${state.selectedSlot === slot ? 'active' : ''}`;
                    btn.textContent = slot;

                    btn.onclick = () => {
                        state.selectedSlot = slot;
                        // Habilitar a primeira profissional livre para este horário
                        state.finalStaffId = state.slotsMap[slot][0];

                        grid.querySelectorAll('.timeslot').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');

                        btnPane3Next.disabled = false;

                        // Avanço automático com delay curtíssimo (80ms)
                        setTimeout(() => {
                            showPane(3);
                            initTurnstile();
                        }, 80);
                    };

                    grid.appendChild(btn);
                });
            }

        } catch (e) {
            console.error(e);
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px; color:#ff6b6b;">Erro ao carregar horários.</div>';
        }
    }

    // --- Formulário & Validação Reativa ---
    const validateField = (input) => {
        const wrapper = input.closest('.input-wrapper');
        if (!wrapper) return false;

        const val = input.value.trim();
        let isValid = false;

        if (input.id === 'client-name') {
            isValid = val.length >= 3;
        } else if (input.id === 'client-whatsapp') {
            const digits = val.replace(/\D/g, '');
            isValid = digits.length >= 10;
        } else if (input.id === 'client-email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(val);
        }

        if (isValid) {
            wrapper.classList.add('success');
        } else {
            wrapper.classList.remove('success');
        }
        return isValid;
    };

    const validateForm = () => {
        const isNameVal = validateField(nameInput);
        const isWhatsappVal = validateField(whatsappInput);
        const isEmailVal = validateField(emailInput);
        const hasTurnstile = !!state.turnstileToken;

        submitBtn.disabled = !(isNameVal && isWhatsappVal && isEmailVal && hasTurnstile);
    };

    [nameInput, whatsappInput, emailInput].forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
            validateField(input);
            validateForm();
        });
        input.addEventListener('blur', () => {
            validateField(input);
            validateForm();
        });
    });

    // Máscara de telefone
    if (whatsappInput) {
        whatsappInput.addEventListener('keypress', (e) => {
            if (e.key !== 'Enter' && isNaN(e.key)) {
                e.preventDefault();
            }
        });
        whatsappInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    // --- Cloudflare Turnstile ---
    function initTurnstile() {
        if (state.turnstileRendered) return;

        setTimeout(() => {
            if (window.turnstile && document.getElementById('cf-turnstile-container')) {
                const isLocal = !window.location.hostname || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const sitekey = isLocal ? '1x00000000000000000000AA' : '0x4AAAAAADQxpMsRW9zFdvyn';

                window.turnstile.render('#cf-turnstile-container', {
                    sitekey: sitekey,
                    callback: function(token) {
                        state.turnstileToken = token;
                        validateForm();
                    },
                    'error-callback': function() {
                        state.turnstileToken = '';
                        validateForm();
                    },
                    'expired-callback': function() {
                        state.turnstileToken = '';
                        validateForm();
                    }
                });
                state.turnstileRendered = true;
            }
        }, 200);
    }

    // --- Envio Final ---
    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const isNameVal = validateField(nameInput);
            const isWhatsappVal = validateField(whatsappInput);
            const isEmailVal = validateField(emailInput);
            if (!isNameVal || !isWhatsappVal || !isEmailVal || !state.turnstileToken) {
                alert("Por favor, preencha todas as informações de forma correta.");
                return;
            }

            const origText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-text-magnetic">Processando...</span>';

            try {
                const startISO = convertToISOInTimezone(state.selectedDate, state.selectedSlot, timezone);
                const startDate = new Date(startISO);
                const endDate = new Date(startDate.getTime() + state.selectedService.duration_minutes * 60000);
                const endISO = endDate.toISOString();

                const fullName = nameInput.value.trim();
                const nameParts = fullName.split(' ');
                const fname = nameParts[0] || '';
                const lname = nameParts.slice(1).join(' ') || 'Lash';

                const rawWhatsapp = whatsappInput.value.replace(/\D/g, '');

                const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-booking`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({
                        tenant_slug: TENANT_SLUG,
                        staff_id: state.finalStaffId,
                        date: state.selectedDate,
                        start_time: startISO,
                        end_time: endISO,
                        service_ids: [state.selectedService.id],
                        customer_name: `${fname} ${lname}`,
                        customer_email: emailInput.value.trim().toLowerCase(),
                        customer_phone: rawWhatsapp,
                        turnstile_token: state.turnstileToken
                    })
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Erro na resposta do servidor.');
                }

                if (summaryTechnique) summaryTechnique.textContent = state.selectedService.name;
                
                const dateObj = new Date(`${state.selectedDate}T00:00:00`);
                const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
                const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
                const dayNum = dateObj.getDate();
                const monthName = monthNames[dateObj.getMonth()];
                if (summaryDate) {
                    summaryDate.textContent = `${dayNames[dateObj.getDay()]}, ${dayNum.toString().padStart(2, '0')} de ${monthName}`;
                }
                
                if (summaryTime) summaryTime.textContent = state.selectedSlot;

                if (successModal) {
                    successModal.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }

            } catch (err) {
                console.error("Falha ao salvar agendamento:", err);
                alert(`Não foi possível concluir a reserva: ${err.message || 'Erro inesperado'}. Por favor, tente novamente.`);
            } finally {
                submitBtn.innerHTML = origText;
                submitBtn.disabled = false;
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (successModal) {
                successModal.classList.remove('open');
                document.body.style.overflow = '';
            }

            const form = document.getElementById('booking-form');
            if (form) form.reset();

            const wrappers = widget.querySelectorAll('.input-wrapper');
            wrappers.forEach(w => w.classList.remove('success'));

            // Resetar estados
            state.selectedService = null;
            state.selectedStaffId = null;
            state.selectedDate = '';
            state.selectedSlot = '';
            state.finalStaffId = null;
            state.turnstileToken = '';
            
            btnPane1Next.disabled = true;
            btnPane2Next.disabled = true;
            btnPane3Next.disabled = true;
            
            widget.querySelectorAll('.technique-option-card').forEach(card => card.classList.remove('active-card'));
            
            const turnstileContainer = document.getElementById('cf-turnstile-container');
            if (turnstileContainer) turnstileContainer.innerHTML = '';
            state.turnstileRendered = false;

            showPane(0);
        });
    }

    // --- Lógica do Modal de Meus Agendamentos ---
    const showMyBookingsBtn = document.getElementById('btn-show-my-bookings');
    const myBookingsModal = document.getElementById('my-bookings-modal');
    const closeBookingsModalBtn = document.getElementById('btn-close-bookings-modal');
    const submitSearchBtn = document.getElementById('btn-submit-search');
    const searchInput = document.getElementById('search-identifier');
    const searchLoader = document.getElementById('search-loader');
    const myBookingsList = document.getElementById('my-bookings-list');
    const searchForm = document.getElementById('booking-search-form');
    const searchResetContainer = document.getElementById('search-reset-container');
    const resetSearchBtn = document.getElementById('btn-reset-search');
    
    // Função para resetar e mostrar o formulário de busca
    const showSearchForm = () => {
        if (searchForm) searchForm.style.display = 'block';
        if (searchResetContainer) searchResetContainer.style.display = 'none';
        if (myBookingsList) {
            myBookingsList.style.display = 'none';
            myBookingsList.innerHTML = '';
        }
        if (searchLoader) searchLoader.style.display = 'none';
        if (searchInput) {
            searchInput.value = '';
            const wrapper = searchInput.closest('.input-wrapper');
            if (wrapper) wrapper.classList.remove('success');
            searchInput.focus();
        }
        if (submitSearchBtn) {
            submitSearchBtn.disabled = true;
        }
    };

    const validateSearchInput = () => {
        if (!searchInput) return false;
        const val = searchInput.value.trim();
        const wrapper = searchInput.closest('.input-wrapper');
        if (!wrapper) return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(val);

        if (isValid) {
            wrapper.classList.add('success');
        } else {
            wrapper.classList.remove('success');
        }
        
        if (submitSearchBtn) {
            submitSearchBtn.disabled = !isValid;
        }
        return isValid;
    };

    if (searchInput) {
        searchInput.addEventListener('input', validateSearchInput);
        searchInput.addEventListener('blur', validateSearchInput);
    }

    if (showMyBookingsBtn && myBookingsModal) {
        showMyBookingsBtn.addEventListener('click', () => {
            myBookingsModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            showSearchForm();
        });
    }

    if (closeBookingsModalBtn && myBookingsModal) {
        closeBookingsModalBtn.addEventListener('click', () => {
            myBookingsModal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // Fechar ao clicar fora
    if (myBookingsModal) {
        myBookingsModal.addEventListener('click', (e) => {
            if (e.target === myBookingsModal) {
                myBookingsModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', showSearchForm);
    }

    if (submitSearchBtn && searchInput) {
        const handleSearch = async () => {
            const val = searchInput.value.trim();
            if (!val) {
                alert("Por favor, digite seu E-mail.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                alert("Por favor, digite um e-mail válido.");
                return;
            }

            // Oculta o formulário de busca e mostra o loader
            if (searchForm) searchForm.style.display = 'none';
            if (searchLoader) searchLoader.style.display = 'block';
            if (myBookingsList) {
                myBookingsList.style.display = 'none';
                myBookingsList.innerHTML = '';
            }
            submitSearchBtn.disabled = true;

            try {
                let query = supabaseClient
                    .from('appointments')
                    .select(`
                        id,
                        start_time,
                        status,
                        customer_name,
                        staff:staff_id ( name ),
                        appointment_services (
                            service:service_id ( name, price )
                        )
                    `)
                    .eq('tenant_id', tenantId)
                    .is('deleted_at', null)
                    .eq('customer_email', val.toLowerCase());

                const { data: appointments, error } = await query.order('start_time', { ascending: false });

                if (error) throw error;

                if (searchLoader) searchLoader.style.display = 'none';
                if (searchResetContainer) searchResetContainer.style.display = 'block';
                
                if (myBookingsList) {
                    myBookingsList.style.display = 'block';
                    if (!appointments || appointments.length === 0) {
                        myBookingsList.innerHTML = '<div class="no-bookings-message" style="text-align: center; color: rgba(31,31,31,0.5); font-family: var(--font-body); padding: 1rem 0;">Nenhum agendamento encontrado para os dados informados.</div>';
                    } else {
                        appointments.forEach(app => {
                            const dateObj = new Date(app.start_time);
                            
                            // Formatação no fuso horário do estúdio ou local
                            const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
                            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
                            
                            const dayName = dayNames[dateObj.getDay()];
                            const dayNum = dateObj.getDate().toString().padStart(2, '0');
                            const monthName = monthNames[dateObj.getMonth()];
                            const hours = dateObj.getHours().toString().padStart(2, '0');
                            const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                            
                            const formattedDate = `${dayName}, ${dayNum} de ${monthName} às ${hours}:${minutes}`;

                            const svcName = app.appointment_services?.[0]?.service?.name || 'Serviço Especial';
                            const staffName = app.staff?.name || 'Qualquer Profissional';
                            
                            let statusClass = 'status-pending';
                            let statusText = 'Pendente';
                            if (app.status === 'confirmed') {
                                statusClass = 'status-confirmed';
                                statusText = 'Confirmado';
                            } else if (app.status === 'cancelled') {
                                statusClass = 'status-cancelled';
                                statusText = 'Cancelado';
                            }

                            const card = document.createElement('div');
                            card.className = 'booking-item-card';
                            card.innerHTML = `
                                <div class="booking-item-header">
                                    <span class="booking-item-title">${escapeHTML(svcName)}</span>
                                    <span class="status-badge ${statusClass}">${statusText}</span>
                                </div>
                                <div class="booking-item-details">
                                    <div class="booking-item-detail-row">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        <span>${formattedDate}</span>
                                    </div>
                                    <div class="booking-item-detail-row">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        <span>Profissional: ${escapeHTML(staffName)}</span>
                                    </div>
                                </div>
                            `;
                            myBookingsList.appendChild(card);
                        });
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar agendamentos:", err);
                if (searchLoader) searchLoader.style.display = 'none';
                if (searchResetContainer) searchResetContainer.style.display = 'block';
                if (myBookingsList) {
                    myBookingsList.style.display = 'block';
                    myBookingsList.innerHTML = '<div style="text-align:center; padding:20px; color:#ff6b6b;">Não foi possível buscar os agendamentos. Tente novamente mais tarde.</div>';
                }
            } finally {
                submitSearchBtn.disabled = false;
            }
        };

        submitSearchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
}
