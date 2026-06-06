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
