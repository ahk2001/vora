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
