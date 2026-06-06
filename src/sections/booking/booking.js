// booking.js

document.addEventListener('DOMContentLoaded', () => {
    initBookingWidget();
});

function initBookingWidget() {
    const widget = document.getElementById('booking-widget-container');
    if (!widget) return;
    
    const panes = widget.querySelectorAll('.widget-pane');
    const steps = widget.querySelectorAll('.widget-steps-indicator .step');
    const nextBtns = widget.querySelectorAll('.btn-next-pane');
    const backBtns = widget.querySelectorAll('.btn-back-pane');
    const submitBtn = document.getElementById('btn-finish-booking');
    
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('btn-close-success-modal');
    
    // Elementos de Entrada & Escolhas
    const techniqueInputs = widget.querySelectorAll('input[name="booking-technique"]');
    const days = widget.querySelectorAll('.calendar-dates-grid .day:not(.disabled)');
    const timeslots = widget.querySelectorAll('.timeslot');
    const nameInput = document.getElementById('client-name');
    const whatsappInput = document.getElementById('client-whatsapp');
    
    // Elementos de Resumo do Modal
    const summaryTechnique = document.getElementById('summary-technique');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    
    // Estado do Agendamento Atual
    let currentPaneIndex = 0;
    let selectedTechniqueName = "Clássico Fio a Fio"; // Default inicial
    let selectedDateText = "Terça-feira, 09 de Junho"; // Default inicial
    let selectedTimeText = "11:00"; // Default inicial
    
    // --- 1. Navegação de Painéis ---
    const showPane = (index) => {
        panes.forEach((pane, i) => {
            pane.classList.toggle('active', i === index);
        });
        
        steps.forEach((step, i) => {
            step.classList.toggle('active', i <= index);
        });
        
        currentPaneIndex = index;
    };
    
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentPaneIndex < panes.length - 1) {
                // Validações antes de avançar se necessário
                if (currentPaneIndex === 1 && !selectedTimeText) {
                    alert("Por favor, selecione um horário para prosseguir.");
                    return;
                }
                showPane(currentPaneIndex + 1);
            }
        });
    });
    
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentPaneIndex > 0) {
                showPane(currentPaneIndex - 1);
            }
        });
    });
    
    // --- 2. Escolha da Técnica ---
    techniqueInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.checked) {
                const card = e.target.closest('.technique-option-card');
                const nameSpan = card.querySelector('.option-name');
                if (nameSpan) {
                    selectedTechniqueName = nameSpan.textContent.trim();
                }
            }
        });
    });
    
    // --- 3. Calendário (Seleção de Dia) ---
    days.forEach(day => {
        day.addEventListener('click', () => {
            days.forEach(d => d.classList.remove('active'));
            day.classList.add('active');
            
            const dayNum = day.textContent.trim();
            // Mock simples de formatação da data baseada no dia clicado
            selectedDateText = `${getDayOfWeekName(dayNum)}, ${dayNum.padStart(2, '0')} de Junho`;
            
            // Corrige subtítulo de horários
            const timeslotHeader = widget.querySelector('.timeslots-container .pane-subtitle');
            if (timeslotHeader) {
                timeslotHeader.textContent = `Horários Disponíveis (${getDayOfWeekShort(dayNum)}, ${dayNum.padStart(2, '0')}/06):`;
            }
        });
    });
    
    // Helper de dias da semana mockado
    function getDayOfWeekName(day) {
        const d = parseInt(day);
        const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        // Dia 9/06/2026 é uma Terça-feira (2)
        const dayIdx = (d - 9 + 2 + 35) % 7;
        return daysOfWeek[dayIdx];
    }
    
    function getDayOfWeekShort(day) {
        const d = parseInt(day);
        const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const dayIdx = (d - 9 + 2 + 35) % 7;
        return daysOfWeek[dayIdx];
    }
    
    // --- 4. Horários ---
    timeslots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeslots.forEach(s => s.classList.remove('active'));
            slot.classList.add('active');
            selectedTimeText = slot.textContent.trim();
        });
    });
    
    // --- 5. Validação Reativa de Campos (Inputs) ---
    const validateField = (input) => {
        const wrapper = input.closest('.input-wrapper');
        if (!wrapper) return;
        
        if (input.value.trim().length >= 3) {
            // Se for whatsapp, valida celular (mínimo 10 dígitos)
            if (input.type === 'tel') {
                const digits = input.value.replace(/\D/g, '');
                if (digits.length >= 10) {
                    wrapper.classList.add('success');
                    return true;
                } else {
                    wrapper.classList.remove('success');
                    return false;
                }
            }
            wrapper.classList.add('success');
            return true;
        } else {
            wrapper.classList.remove('success');
            return false;
        }
    };
    
    [nameInput, whatsappInput].forEach(input => {
        if (!input) return;
        
        input.addEventListener('input', () => {
            validateField(input);
        });
        
        input.addEventListener('blur', () => {
            validateField(input);
        });
    });
    
    // Máscara simples de celular/whatsapp
    if (whatsappInput) {
        whatsappInput.addEventListener('keypress', (e) => {
            // Apenas números
            if (e.key !== 'Enter' && isNaN(e.key)) {
                e.preventDefault();
            }
        });
        
        whatsappInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }
    
    // --- 6. Finalização do Agendamento & Modal ---
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Valida campos finais
            const isNameVal = validateField(nameInput);
            const isWhatsappVal = validateField(whatsappInput);
            
            if (!isNameVal || !isWhatsappVal) {
                alert("Por favor, preencha seus dados de contato corretamente antes de finalizar.");
                return;
            }
            
            // Preenche resumo do modal
            if (summaryTechnique) summaryTechnique.textContent = selectedTechniqueName;
            if (summaryDate) summaryDate.textContent = selectedDateText;
            if (summaryTime) summaryTime.textContent = selectedTimeText;
            
            // Abre modal animado
            if (successModal) {
                successModal.classList.add('open');
                document.body.style.overflow = 'hidden'; // Bloqueia scroll do site
            }
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            // Fecha modal
            if (successModal) {
                successModal.classList.remove('open');
                document.body.style.overflow = ''; // Libera scroll
            }
            
            // Reseta formulário e estados
            const form = document.getElementById('booking-form');
            if (form) form.reset();
            
            const wrappers = widget.querySelectorAll('.input-wrapper');
            wrappers.forEach(w => w.classList.remove('success'));
            
            // Reseta de volta para o passo 1
            showPane(0);
        });
    }
}
