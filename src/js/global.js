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
