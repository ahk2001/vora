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
