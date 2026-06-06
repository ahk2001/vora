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
