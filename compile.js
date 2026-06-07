// compile.js
const fs = require('fs');
const path = require('path');

const SECTIONS = [
    'preloader',
    'hero',
    'services',
    'manifesto',
    'portfolio',
    'care',
    'booking',
    'faq',
    'footer'
];

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = __dirname;

function compile() {
    console.log('--- Iniciando Compilação do Site VÖRA ---');
    
    // 1. Compilar HTML
    let templatePath = path.join(SRC_DIR, 'template.html');
    if (!fs.existsSync(templatePath)) {
        console.error('Erro: Arquivo src/template.html não encontrado.');
        return;
    }
    let htmlContent = fs.readFileSync(templatePath, 'utf8');
    
    // 2. Compilar CSS
    let globalCssPath = path.join(SRC_DIR, 'styles', 'global.css');
    let cssContent = `/* Compilado automaticamente em ${new Date().toLocaleString()} */\n`;
    if (fs.existsSync(globalCssPath)) {
        cssContent += fs.readFileSync(globalCssPath, 'utf8') + '\n';
    } else {
        console.warn('Aviso: src/styles/global.css não encontrado.');
    }
    
    // 3. Compilar JS
    let globalJsPath = path.join(SRC_DIR, 'js', 'global.js');
    let jsContent = `/* Compilado automaticamente em ${new Date().toLocaleString()} */\n`;
    if (fs.existsSync(globalJsPath)) {
        jsContent += fs.readFileSync(globalJsPath, 'utf8') + '\n';
    } else {
        console.warn('Aviso: src/js/global.js não encontrado.');
    }
    
    // Processar cada seção
    SECTIONS.forEach(section => {
        const secDir = path.join(SRC_DIR, 'sections', section);
        
        console.log(`Processando seção: [${section}]`);
        
        // HTML
        const htmlFile = path.join(secDir, `${section}.html`);
        let sectionHtml = '';
        if (fs.existsSync(htmlFile)) {
            sectionHtml = fs.readFileSync(htmlFile, 'utf8');
        } else {
            console.warn(`  [HTML] Aviso: ${section}.html não encontrado.`);
        }
        // Injetar HTML no template
        const placeholder = `<!-- SECTION: ${section} -->`;
        htmlContent = htmlContent.replace(placeholder, sectionHtml);
        
        // CSS
        const cssFile = path.join(secDir, `${section}.css`);
        if (fs.existsSync(cssFile)) {
            cssContent += `\n/* --- Seção: ${section} --- */\n`;
            cssContent += fs.readFileSync(cssFile, 'utf8') + '\n';
        } else {
            console.log(`  [CSS] Info: ${section}.css não encontrado.`);
        }
        
        // JS
        const jsFile = path.join(secDir, `${section}.js`);
        if (fs.existsSync(jsFile)) {
            jsContent += `\n/* --- Seção: ${section} --- */\n`;
            jsContent += fs.readFileSync(jsFile, 'utf8') + '\n';
        } else {
            console.log(`  [JS] Info: ${section}.js não encontrado.`);
        }
    });
    
    // Salvar arquivos na raiz (Distribuição) com cache-busting dinâmico para ambiente local/desenvolvimento
    const timestamp = Date.now();
    const finalHtml = htmlContent
        .replace('href="style.css"', `href="style.css?v=${timestamp}"`)
        .replace('src="app.js"', `src="app.js?v=${timestamp}"`);

    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), finalHtml, 'utf8');
    fs.writeFileSync(path.join(DIST_DIR, 'style.css'), cssContent, 'utf8');
    fs.writeFileSync(path.join(DIST_DIR, 'app.js'), jsContent, 'utf8');
    
    console.log('--- Compilação Finalizada com Sucesso! ---');
    console.log(`Arquivos gerados na raiz:`);
    console.log(`- index.html (${fs.statSync(path.join(DIST_DIR, 'index.html')).size} bytes)`);
    console.log(`- style.css (${fs.statSync(path.join(DIST_DIR, 'style.css')).size} bytes)`);
    console.log(`- app.js (${fs.statSync(path.join(DIST_DIR, 'app.js')).size} bytes)`);
}

// Executar compilação se rodar diretamente
if (require.main === module) {
    compile();
}

module.exports = compile;
