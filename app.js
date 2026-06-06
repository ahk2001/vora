/* Compilado automaticamente em 06/06/2026, 19:12:44 */
// js/global.js

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initMagneticButtons();
});

/**
 * Efeito de Revelação Gradual no Scroll (Scroll-Triggered Reveals)
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-fade-in');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Para de observar após revelar (animação de entrada única)
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.10, // Ativa quando 10% do elemento entra na tela
        rootMargin: "0px 0px -50px 0px" // Dispara um pouco antes de aparecer totalmente
    });
    
    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

/**
 * Efeito Magnético nos Botões Principais (Magnetic Feel)
 */
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(element => {
        // Envolvemos em um container invisível maior se quisermos aumentar a área de atração
        element.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        
        const innerText = element.querySelector('.btn-text-magnetic');
        if (innerText) {
            innerText.style.display = 'inline-block';
            innerText.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
        }
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            // Ponto central do botão
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Distância do cursor ao centro do botão
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            // Suaviza a transição durante o movimento removendo temporariamente o delay
            element.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
            if (innerText) {
                innerText.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
            }
            
            // Move o botão em 30% da distância
            element.style.transform = `translate(${deltaX * 0.3}px, ${deltaY * 0.3}px)`;
            
            // Move o texto em 15% adicionais no mesmo sentido (efeito paralaxe 3D)
            if (innerText) {
                innerText.style.transform = `translate(${deltaX * 0.15}px, ${deltaY * 0.15}px)`;
            }
        });
        
        element.addEventListener('mouseleave', () => {
            // Restaura transição de retorno suave e reseta posições
            element.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            element.style.transform = 'translate(0px, 0px)';
            
            if (innerText) {
                innerText.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                innerText.style.transform = 'translate(0px, 0px)';
            }
        });
    });
}


/* --- Seção: preloader --- */
// preloader.js

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const logo = document.querySelector('.preloader-logo');
    const body = document.body;
    
    // Trava rolagem do body no início
    body.style.overflow = 'hidden';
    
    // 1. Mostrar palavra VÖRA
    setTimeout(() => {
        if (logo) logo.classList.add('show');
    }, 300);
    
    // 2. Sumir com a palavra VÖRA
    setTimeout(() => {
        if (logo) {
            logo.classList.remove('show');
            logo.classList.add('fade-out');
        }
    }, 1800);
    
    // 3. Deslizar preloader para cima e liberar o site
    setTimeout(() => {
        if (preloader) {
            preloader.style.transform = 'translateY(-100%)';
        }
        body.classList.add('loaded');
        body.style.overflow = '';
        
        // Dispara uma vez os reveladores do scroll logo após carregar (para a Hero section)
        setTimeout(() => {
            const initialReveals = document.querySelectorAll('.reveal, .reveal-fade-in');
            initialReveals.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('active');
                }
            });
        }, 300);
    }, 2800);
    
    // 4. Remover preloader do DOM após a animação de deslize
    setTimeout(() => {
        if (preloader) {
            preloader.style.display = 'none';
        }
    }, 4000);
});


/* --- Seção: hero --- */
// hero.js

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
});

/**
 * Controla a cor e desfoque do header flutuante com base na rolagem
 */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Dispara no carregamento inicial caso a página já inicie rolada
    handleScroll();
    window.addEventListener('scroll', handleScroll);
}

/**
 * Menu móvel hambúrguer interativo
 */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (!toggleBtn || !nav) return;
    
    const toggleMenu = () => {
        const isOpen = toggleBtn.classList.toggle('open');
        nav.classList.toggle('open');
        
        // Altera o ícone do hambúrguer para um X
        const spans = toggleBtn.querySelectorAll('span');
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Bloqueia scroll do site com menu aberto
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
        } else {
            document.body.style.overflow = '';
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    };
    
    toggleBtn.addEventListener('click', toggleMenu);
    
    // Fecha o menu ao clicar em qualquer item
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
}


/* --- Seção: services --- */
// services.js

document.addEventListener('DOMContentLoaded', () => {
    initServicesCarousel();
});

function initServicesCarousel() {
    const container = document.querySelector('.carousel-container');
    if (!container) return;
    
    const viewport = container.querySelector('.carousel-viewport');
    const track = container.querySelector('.carousel-track');
    const originalCards = Array.from(track.querySelectorAll('.service-card'));
    if (originalCards.length === 0) return;
    
    const originalCount = originalCards.length;
    
    // Clonando os cards 3 vezes de cada lado para criar uma margem ampla de arraste sem reinicio
    const repeatCount = 3;
    
    // Anexa clones 3 vezes
    for (let r = 0; r < repeatCount; r++) {
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone-appended');
            track.appendChild(clone);
        });
    }
    
    // Prepara clones 3 vezes no início (mantendo a ordem sequencial reversa para inserção correta)
    for (let r = 0; r < repeatCount; r++) {
        originalCards.slice().reverse().forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone-prepended');
            track.insertBefore(clone, track.firstChild);
        });
    }
    
    const cards = container.querySelectorAll('.service-card');
    
    let isDragging = false;
    let startX = 0;
    
    // Posições e física do carrossel (controle via LERP)
    let currentTranslate = 0;
    let targetTranslate = 0;
    let prevTranslate = 0;
    let velocity = 0;
    let lastX = 0;
    
    // Cache de variáveis de layout para performance
    let cardWidth = 0;
    let gap = 0;
    let paddingLeft = 0;
    
    // Configurações do Carrossel
    const parallaxStrength = 110; // amplitude do movimento parallax em px
    
    const updateLayoutCache = () => {
        const card = track.querySelector('.service-card');
        if (!card) return;
        cardWidth = card.getBoundingClientRect().width;
        const style = window.getComputedStyle(track);
        gap = parseFloat(style.gap) || 0;
        paddingLeft = parseFloat(style.paddingLeft) || 0;
    };
    
    updateLayoutCache();
    
    const getSetWidth = () => {
        return (cardWidth + gap) * originalCount;
    };
    
    // Limites absolutos de arraste
    const getMinTranslate = () => {
        const viewportWidth = viewport.offsetWidth;
        const trackWidth = track.scrollWidth;
        if (trackWidth <= viewportWidth) return 0;
        return -(trackWidth - viewportWidth);
    };
    
    const getMaxTranslate = () => {
        return 0;
    };
    
    // Posiciona inicialmente no começo do conjunto original de cards (após as 3 repetições iniciais)
    const initialSetWidth = getSetWidth();
    currentTranslate = -initialSetWidth * repeatCount;
    targetTranslate = currentTranslate;
    prevTranslate = currentTranslate;
    
    // Eventos de Mouse e Toque para Arraste
    viewport.addEventListener('mousedown', dragStart);
    viewport.addEventListener('touchstart', dragStart, { passive: true });
    
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('touchmove', dragMove, { passive: false });
    
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    
    // Redimensionamento da Tela
    window.addEventListener('resize', () => {
        updateLayoutCache();
        const currentSetWidth = getSetWidth();
        currentTranslate = -currentSetWidth * repeatCount;
        targetTranslate = currentTranslate;
        prevTranslate = currentTranslate;
    });

    function dragStart(e) {
        isDragging = true;
        startX = getPositionX(e);
        lastX = startX;
        velocity = 0;
    }

    function dragMove(e) {
        if (!isDragging) return;
        
        if (e.cancelable) {
            e.preventDefault();
        }
        
        const currentX = getPositionX(e);
        const diff = currentX - startX;
        let target = prevTranslate + diff;
        
        // Efeito Elástico nos limites absolutos da lista estendida
        const minTrans = getMinTranslate();
        const maxTrans = getMaxTranslate();
        
        if (target > maxTrans) {
            const overflow = target - maxTrans;
            target = maxTrans + overflow * 0.35;
        } else if (target < minTrans) {
            const overflow = target - minTrans;
            target = minTrans + overflow * 0.35;
        }
        
        targetTranslate = target;
        
        // Calcula a velocidade do arraste
        velocity = currentX - lastX;
        lastX = currentX;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        // Adiciona inércia/glide baseada na velocidade do arraste
        targetTranslate += velocity * 8;
        
        // Garante os limites ao soltar
        const minTrans = getMinTranslate();
        const maxTrans = getMaxTranslate();
        if (targetTranslate > maxTrans) {
            targetTranslate = maxTrans;
        } else if (targetTranslate < minTrans) {
            targetTranslate = minTrans;
        }
        
        prevTranslate = targetTranslate;
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }
    
    function updateTrackPosition() {
        track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    }
    
    // Atualiza o efeito de Parallax Horizontal das imagens internas e aplica o deslocamento diagonal dos cards
    function updateParallax() {
        const viewportRect = viewport.getBoundingClientRect();
        const viewportCenter = viewportRect.left + viewportRect.width / 2;
        
        cards.forEach((cardEl, index) => {
            // Posição física exata do card calculada matematicamente baseada no translate do trilho e no índice do card
            const cardLeft = viewportRect.left + paddingLeft + currentTranslate + index * (cardWidth + gap);
            const cardCenter = cardLeft + cardWidth / 2;
            
            // Distância relativa do centro do card ao centro do viewport (-2.0 a 2.0)
            let relativeDist = (cardCenter - viewportCenter) / (viewportRect.width / 2);
            relativeDist = Math.max(-2.0, Math.min(2.0, relativeDist));
            
            // Força do deslocamento da imagem (Parallax)
            const parallaxOffset = -relativeDist * parallaxStrength;
            
            const img = cardEl.querySelector('.service-card-img');
            if (img) {
                img.style.transform = `translate3d(${parallaxOffset}px, 0, 0)`;
            }
            
            // Movimento Diagonal: os cards sobem/descem conforme se movem lateralmente
            const distFromCenter = cardCenter - viewportCenter;
            // Modificado para 0.055 positivo para que o lado esquerdo seja alto e o direito baixo
            const diagonalSlope = 0.055; 
            const diagonalY = distFromCenter * diagonalSlope;
            
            // Aplica a translação vertical diretamente no card
            cardEl.style.transform = `translate3d(0, ${diagonalY}px, 0)`;
        });
    }
    
    // Loop de Animação Principal (60fps/120fps via RAF)
    function animate() {
        const damping = isDragging ? 0.22 : 0.09; // liquid drag ao puxar, glide suave ao soltar
        currentTranslate += (targetTranslate - currentTranslate) * damping;
        
        // Garante limites no LERP
        const minTrans = getMinTranslate();
        const maxTrans = getMaxTranslate();
        if (!isDragging) {
            if (currentTranslate > maxTrans) currentTranslate = maxTrans;
            if (currentTranslate < minTrans) currentTranslate = minTrans;
        }
        
        updateTrackPosition();
        updateParallax();
        
        requestAnimationFrame(animate);
    }
    
    // Inicia o loop
    requestAnimationFrame(animate);

    // Cria um IntersectionObserver dedicado para controlar a animação de entrada e saída repetitiva.
    // Sempre que o carrossel entra na tela, ativa as classes de reveal e remove após 2.2s.
    // Sempre que sai da tela, remove as classes para que a animação reinicie no próximo scroll.
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                container.classList.add('active');
                container.classList.remove('revealed');
                
                // Aguarda a conclusão da animação de entrada para liberar o hover
                setTimeout(() => {
                    if (container.classList.contains('active')) {
                        container.classList.add('revealed');
                    }
                }, 2200);
            } else {
                container.classList.remove('active');
                container.classList.remove('revealed');
            }
        });
    }, {
        root: null,
        threshold: 0.05, // Dispara com 5% de visibilidade
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealObserver.observe(container);
}


/* --- Seção: manifesto --- */
// manifesto.js

document.addEventListener('DOMContentLoaded', () => {
    initManifestoParallax();
});

function initManifestoParallax() {
    const manifestoSection = document.getElementById('manifesto');
    if (!manifestoSection) return;
    
    const parallaxImages = manifestoSection.querySelectorAll('.manifesto-image-wrapper');
    
    let isTicking = false;
    
    const handleScroll = () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                applyParallax();
                isTicking = false;
            });
            isTicking = true;
        }
    };
    
    function applyParallax() {
        // Desativa parallax em telas mobile (991px ou menor)
        if (window.innerWidth < 992) {
            parallaxImages.forEach(img => {
                img.style.transform = '';
            });
            return;
        }
        
        const rect = manifestoSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Verifica se a seção está visível na tela
        if (rect.top < viewportHeight && rect.bottom > 0) {
            // Calcula o centro da seção e o centro da tela
            const sectionCenter = rect.top + rect.height / 2;
            const screenCenter = viewportHeight / 2;
            
            // Distância em pixels entre o centro da seção e o centro da tela
            const relativeOffset = sectionCenter - screenCenter;
            
            parallaxImages.forEach(img => {
                const speed = parseFloat(img.getAttribute('data-parallax-speed')) || 0;
                
                // Aplica a translação vertical baseada no scroll e na velocidade definida
                const yOffset = relativeOffset * speed;
                
                // Mantém o alinhamento da imagem e move no eixo Y
                img.style.transform = `translate3d(0, ${yOffset}px, 0)`;
            });
        }
    }
    
    // Inicia ouvintes de scroll e resize
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', applyParallax);
    
    // Executa uma vez no início
    applyParallax();
}


/* --- Seção: portfolio --- */
// portfolio.js

document.addEventListener('DOMContentLoaded', () => {
    initPortfolioSlider();
});

function initPortfolioSlider() {
    const sliderContainer = document.querySelector('.comparison-slider');
    if (!sliderContainer) return;
    
    const input = sliderContainer.querySelector('.slider-input');
    if (!input) return;
    
    let targetValue = 50;
    let currentValue = 50;
    const damping = 0.14; // Fator de amortecimento (menor = mais lento/elástico)
    let animationID = null;
    
    // Atualiza o valor alvo com base na rolagem/arraste do input
    input.addEventListener('input', (e) => {
        targetValue = parseFloat(e.target.value);
        
        // Garante que o loop de animação esteja rodando
        if (!animationID) {
            animate();
        }
    });
    
    function animate() {
        // Diferença entre o valor atual e o alvo
        const diff = targetValue - currentValue;
        
        // Se a diferença for minúscula, interrompe o loop para economizar CPU
        if (Math.abs(diff) < 0.01) {
            currentValue = targetValue;
            sliderContainer.style.setProperty('--value', `${currentValue}%`);
            animationID = null;
            return;
        }
        
        // Interpolação linear (LERP) para suavidade física analógica
        currentValue += diff * damping;
        
        // Atualiza a variável CSS no elemento
        sliderContainer.style.setProperty('--value', `${currentValue}%`);
        
        // Continua o loop de animação
        animationID = requestAnimationFrame(animate);
    }
    
    // Dispara a animação inicial para alinhar na posição 50%
    animate();
}


/* --- Seção: care --- */
// care.js

document.addEventListener('DOMContentLoaded', () => {
    initCareScrollEffect();
});

/**
 * Efeito dinâmico no mobile para fazer os cartões sumirem em fade-out e blur-in
 * quando passam por trás das escritas fixas da coluna esquerda.
 */
function initCareScrollEffect() {
    const careSection = document.getElementById('cuidados');
    if (!careSection) return;

    const leftCol = careSection.querySelector('.care-left-col');
    const cards = careSection.querySelectorAll('.care-card');
    
    if (!leftCol || cards.length === 0) return;

    // Ativa/desativa o scroll listener dependendo se a seção está visível na tela
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                window.addEventListener('scroll', handleCareScroll, { passive: true });
                handleCareScroll(); // Executa o ajuste inicial
            } else {
                window.removeEventListener('scroll', handleCareScroll);
            }
        });
    }, { threshold: 0.05 });

    sectionObserver.observe(careSection);

    function handleCareScroll() {
        // Aplica o efeito somente em telas mobile (largura menor ou igual a 576px)
        if (window.innerWidth > 576) {
            cards.forEach(card => {
                card.style.opacity = '';
                card.style.filter = '';
                card.style.transform = '';
            });
            return;
        }

        const leftRect = leftCol.getBoundingClientRect();
        // O ponto de fade-out começa mais próximo da tag para evitar desfoque no estado inicial
        const fadeStart = leftRect.bottom + 35; 
        const fadeDistance = 65; // Transição mais rápida e precisa para sumir antes de cobrir o texto

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            
            // Distância em relação à base do cabeçalho fixado
            const distance = fadeStart - cardRect.top;

            if (distance > 0) {
                // O card está subindo para trás do cabeçalho
                const ratio = Math.max(0, 1 - (distance / fadeDistance)); // vai de 1 (visível) a 0 (invisível)
                
                card.style.opacity = ratio;
                card.style.filter = `blur(${(1 - ratio) * 8}px)`;
                card.style.transform = `scale(${0.96 + ratio * 0.04}) translateY(${-12 * (1 - ratio)}px)`;
            } else {
                // Estado normal
                card.style.opacity = 1;
                card.style.filter = 'blur(0px)';
                card.style.transform = 'scale(1) translateY(0px)';
            }
        });
    }

    // Garante o recálculo imediato do layout se a janela for redimensionada
    window.addEventListener('resize', handleCareScroll, { passive: true });
}


/* --- Seção: booking --- */
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


/* --- Seção: faq --- */
// faq.js

document.addEventListener('DOMContentLoaded', () => {
    initFaqAccordion();
});

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('[data-faq-item]');
    
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const body = item.querySelector('.faq-body');
        
        if (!trigger || !body) return;
        
        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // 1. Fechar todos os outros acordeões (Comportamento Exclusivo)
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('open')) {
                    otherItem.classList.remove('open');
                    const otherBody = otherItem.querySelector('.faq-body');
                    const otherTrigger = otherItem.querySelector('.faq-trigger');
                    if (otherBody) otherBody.style.height = '0px';
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                }
            });
            
            // 2. Alternar o estado do item atual
            if (isOpen) {
                item.classList.remove('open');
                body.style.height = '0px';
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                // Define a altura igual à altura real do conteúdo interno (scrollHeight)
                body.style.height = body.scrollHeight + 'px';
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
    
    // Recalcula a altura dos acordeões abertos caso a tela mude de tamanho
    window.addEventListener('resize', () => {
        faqItems.forEach(item => {
            if (item.classList.contains('open')) {
                const body = item.querySelector('.faq-body');
                if (body) {
                    body.style.height = body.scrollHeight + 'px';
                }
            }
        });
    });
}


/* --- Seção: footer --- */
// footer.js

document.addEventListener('DOMContentLoaded', () => {
    initFooterYear();
});

function initFooterYear() {
    const copyrightEl = document.querySelector('.main-footer-section .copyright');
    if (copyrightEl) {
        const currentYear = new Date().getFullYear();
        copyrightEl.innerHTML = `&copy; ${currentYear} VÖRA Lash Design. Todos os direitos reservados.`;
    }
}

