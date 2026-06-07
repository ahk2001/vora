/* Compilado automaticamente em 07/06/2026, 15:00:49 */
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
    let startY = 0;
    let isScrolling = false;
    let isDragStarted = false;
    
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
    
    // Configurações do Carrossel (calculadas dinamicamente)
    let parallaxStrength = 110; // amplitude do movimento parallax em px
    
    const updateLayoutCache = () => {
        const card = track.querySelector('.service-card');
        if (!card) return;
        cardWidth = card.getBoundingClientRect().width;
        const style = window.getComputedStyle(track);
        gap = parseFloat(style.gap) || 0;
        paddingLeft = parseFloat(style.paddingLeft) || 0;
        
        // Ajusta a força do parallax com base na largura do card para evitar que a imagem saia das bordas
        if (window.innerWidth <= 600) {
            parallaxStrength = cardWidth * 0.32; // Limita a força do parallax no mobile
        } else if (window.innerWidth <= 991) {
            parallaxStrength = cardWidth * 0.35; // Limita no tablet
        } else {
            parallaxStrength = 110;
        }
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
        // Permite arrastar apenas se o clique/toque for em cima de um card
        const card = e.target.closest('.service-card');
        if (!card) return;

        isDragging = true;
        isScrolling = false;
        isDragStarted = false;
        startX = getPositionX(e);
        startY = getPositionY(e);
        lastX = startX;
        velocity = 0;
    }

    function dragMove(e) {
        if (!isDragging) return;
        
        const currentX = getPositionX(e);
        const currentY = getPositionY(e);
        
        const diffX = currentX - startX;
        const diffY = currentY - startY;
        
        // Determina se é um scroll vertical ou arraste lateral nos primeiros pixels de movimento
        if (!isDragStarted && !isScrolling) {
            const absX = Math.abs(diffX);
            const absY = Math.abs(diffY);
            
            if (absY > absX && absY > 5) {
                isScrolling = true;
                isDragging = false;
                return;
            } else if (absX > absY && absX > 5) {
                isDragStarted = true;
            } else {
                return;
            }
        }
        
        if (isScrolling) {
            isDragging = false;
            return;
        }
        
        if (e.cancelable) {
            e.preventDefault();
        }
        
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

    function getPositionY(e) {
        return e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
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

    // Função para tratar a posição do arraste e toque
    function handleMove(clientX) {
        const rect = sliderContainer.getBoundingClientRect();
        const positionX = clientX - rect.left;
        let percent = (positionX / rect.width) * 100;
        
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        
        targetValue = percent;
        input.value = percent; // Atualiza o input invisível por acessibilidade
        
        if (!animationID) {
            animate();
        }
    }

    // Eventos de toque diretos para iOS / Android
    sliderContainer.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
            handleMove(e.touches[0].clientX);
        }
    }, { passive: true });

    sliderContainer.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
            handleMove(e.touches[0].clientX);
            if (e.cancelable) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    // Eventos de mouse diretos para melhor responsividade no desktop (opcional, mas complementa o input)
    let isDragging = false;
    
    sliderContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        handleMove(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
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
            const nameParts = val.split(/\s+/).filter(part => part.length >= 2);
            isValid = nameParts.length >= 2;
        } else if (input.id === 'client-whatsapp') {
            const digits = val.replace(/\D/g, '');
            isValid = digits.length === 10 || digits.length === 11;
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
                const isLocal = !window.location.hostname || 
                                window.location.hostname === 'localhost' || 
                                window.location.hostname === '127.0.0.1' ||
                                window.location.hostname.endsWith('.vercel.app');
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

