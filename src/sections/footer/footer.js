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
