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
