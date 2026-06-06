# **Product Requirement Document (PRD) — VÖRA**

## **1\. Visão Geral do Produto**

O **VÖRA** é um estúdio boutique de Lash Design (extensão de cílios) focado em proporcionar uma experiência premium, segura e personalizada. O objetivo deste site é servir como uma vitrine digital sofisticada e de alta conversão, facilitando a descoberta dos serviços, a educação da cliente sobre os cuidados e, principalmente, a conversão direta de agendamentos através da integração com o widget da **Slotty**.

### **1.1 Objetivos de Negócio**

* **Conversão:** Tornar o processo de agendamento o mais fluido possível.  
* **Autoridade & Confiança:** Demonstrar alto padrão de biossegurança, profissionalismo e sofisticação técnica.  
* **Educação do Cliente:** Sanar dúvidas frequentes para reduzir barreiras e atritos antes do agendamento.

## **2\. Escopo e Funcionalidades (Funcionais & Não-Funcionais)**

### **2.1 Requisitos Funcionais**

* **Apresentação Interativa de Serviços:** Exibição clara das técnicas com descrições, tempos e preços estimados.  
* **Galeria Antes/Depois:** Exibição visual de alta qualidade do portfólio com slider de arraste interativo e fluido.  
* **Integração com Slotty:** Widget de agendamento embutido de forma nativa e acessível em múltiplos pontos de conversão (CTAs).  
* **Guia de Cuidados Interativo:** Seção dinâmica mostrando os cuidados pós-extensão em formato de checklist interativo.  
* **Seção de FAQ (Dúvidas Frequentes):** Accordions expansíveis com transições suaves para sanar dores de clientes de primeira viagem.

### **2.2 Requisitos Não-Funcionais**

* **Performance Elevada:** Carregamento ultra rápido, otimizando o peso das animações e imagens para dispositivos móveis (90% do tráfego desse nicho é mobile).  
* **Responsividade Excepcional:** Design adaptável para celulares de telas variadas, tablets e desktops (Mobile-First).  
* **Estética Visual Premium:** Layout minimalista, limpo, transmitindo elegância, limpeza e luxo acessível. A cor principal é o bege quente \#bba387.

## **3\. Estrutura de Páginas e Seções (Single Page)**

O site será construído no formato de **Landing Page (Single Page Application)** com navegação contínua e rica em feedback visual.

### **Seção 1: Hero (Abertura / Primeiro Impacto)**

* **Headline:** Frase curta, poética e impactante (ex: *"O poder de um olhar marcante, a praticidade que você merece."*). Centralizada na hero em cor branca, com a fonte serifada **Elsie**, e uma breve sombra desfocada dando contraste com o fundo.  
* **Subheadline:** Breve contextualização da marca VÖRA.  
* **Call-to-Action (CTA) Principal:** Botão em destaque "Agendar Meu Horário", disparando para a sessão de agendamento do widget Slotty.  
* **Fundo:** Vídeo sutil de alta qualidade transmitindo delicadeza e luxo.  
* **Dinâmica de Entrada:** Animação de revelação suave por camadas (staggered fade-in) para o título, subtítulo e botão ao carregar a página.

### **Seção 2: Menu de Serviços (Técnicas)**

* **Estilo:** Estilo carrossel horizontal que se move para a lateral apenas com interação (arraste do mouse/toque ou botões de navegação).  
* **Parallax Horizontal:** Cada card possui uma imagem interna de alta qualidade que se move levemente no sentido oposto ao movimento do scroll do carrossel, criando profundidade tridimensional.  
* **Efeito de Foco:** Ao passar o mouse (hover) sobre um card, ele sofre uma sutil elevação e expansão de sombra, enquanto os outros sofrem um leve fade-out visual.

### **Seção 3: O Manifesto VÖRA (Sobre)**

* **Texto Conceitual:** Sobre a filosofia e biossegurança do estúdio.  
* **Imagens Dispersas:** Fotos modernas, minimalistas e luxuosas espalhadas de maneira assimétrica pelas laterais da seção.  
* **Efeito Parallax de Scroll:** As fotos se movem em velocidades diferentes (eixos de profundidade distintos) enquanto o usuário rola a página, criando a sensação de um ambiente físico flutuante.

### **Seção 4: Portfólio de Transformações (Antes & Depois)**

* **Módulo Interativo:** Slider horizontal de arraste que revela a transformação real do olhar (revelando a foto "Depois" sob a foto "Antes" conforme o slider é guiado).  
* **Física do Arraste:** Movimento amortecido (elastic scrolling) no cursor central, simulando uma interação analógica premium.

### **Seção 5: Guia de Cuidados Pós-Extensão**

* **Checklist Dinâmico:** Ao clicar nos cartões de cuidados, o checkbox se preenche de forma animada e o card muda de estado visual de forma suave, incentivando a leitura.

### **Seção 6: Integração com Slotty Widget**

* **Sessão de Agendamento:** Integrada visualmente com o design da VÖRA e os padrões de segurança da Slotty. O formulário de agendamento reage dinamicamente aos inputs focados, com feedback instantâneo de preenchimento correto e abertura animada do modal de histórico.

### **Seção 7: FAQ (Perguntas Frequentes)**

* **Accordion Expansível:** Ao abrir uma resposta, a transição de altura é suave e calculada dinamicamente, evitando saltos bruscos na página. O ícone de seta gira e se transforma suavemente.

### **Seção 8: Rodapé (Footer)**

* Informações de contato (fictícias), endereço do estúdio, links de redes sociais e política de privacidade.

## **4\. Identidade Visual e Estilo (UI/UX)**

* **Paleta de Cores (Soft Luxury / Warm Minimalist):**  
  * *Fundo principal:* Bege sutil (\#F5EFEB)  
  * *Destaques/Textos:* Carvão Escuro (\#1F1F1F) para alta legibilidade.  
  * *Acentos quentes:* “bege” (\#bba387)  
* **Tipografia:**  
  * *Títulos:* Serifada elegante (**Elsie**) para passar ar de sofisticação e arte.  
  * *Textos de apoio:* Sem serifa limpa (**Plus Jakarta Sans**) para facilitar a leitura no celular.  
* **Elementos Gráficos:** Cantos arredondados suavizados (rounded-2xl), sombras delicadas para profundidade e amplo uso de espaços em branco (whitespace).

## **5\. Diretrizes de Animações e Micro-interações**

Para garantir que o site seja **minimalista, porém moderno e dinâmico**, aplicam-se as seguintes regras de transição:

### **5.1 Transições Globais (Ease & Timing)**

* Todas as transições de cor, sombra e escala devem utilizar a curva de velocidade cúbica de luxo: cubic-bezier(0.25, 1, 0.5, 1\) (suave no início, amortecida no final) com duração entre 300ms e 500ms.  
* **Sem saltos bruscos:** Elementos interativos nunca devem mudar de estado instantaneamente.

### **5.2 Efeito Magnético nos Botões (Magnetic Feel)**

* Os botões principais (como "Agendar Meu Horário") devem ter um efeito em que o texto ou o próprio botão segue levemente o cursor do mouse quando o usuário se aproxima, dando sensação de atratividade física.

### **5.3 Revelação Gradual (Scroll-Triggered Reveals)**

* Conforme o usuário navega pela página, títulos e blocos de texto devem surgir de baixo para cima com um leve fade-in (deslocamento de 20px no eixo Y e opacidade de 0 para 1), acionado apenas quando entram no campo de visão do navegador.

### **5.4 Efeito de Carregamento Inicial (Luxury Preloader)**

* Ao entrar no site, a página realiza um carregamento minimalista: a palavra **VÖRA** surge no centro da tela em um fade sutil e elegante, e então a tela se abre de baixo para cima, revelando a Hero Section já animada. Isso eleva instantaneamente o patamar de profissionalismo e requinte da marca.