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
