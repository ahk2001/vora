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
