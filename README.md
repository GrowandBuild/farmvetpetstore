# 🐾 FarmVet Pet Store - Site Premium

> **Uma obra-prima dos deuses da programação** - Pet shop com arquitetura moderna, performance de elite e experiência de usuário excepcional.

## 🚀 Características

### ✨ **Design System Profissional**
- **CSS Custom Properties** para consistência visual
- **Sistema de cores** com variáveis semânticas
- **Tipografia escalável** com Inter + Poppins
- **Sistema de espaçamento** baseado em 8px
- **Sombras e bordas** padronizadas
- **Componentes reutilizáveis** e modulares

### ⚡ **Performance de Elite**
- **Critical CSS inline** para renderização rápida
- **Lazy loading** de imagens e recursos
- **Debounced scroll events** para otimização
- **Throttled animations** para 60fps
- **Preload de recursos críticos**
- **Service Worker** para cache inteligente

### 🎯 **Acessibilidade Completa**
- **WCAG 2.1 AA** compliance
- **Navegação por teclado** completa
- **Screen reader** friendly
- **Skip links** para navegação rápida
- **ARIA labels** e roles apropriados
- **Contraste** otimizado
- **Reduced motion** support

### 📱 **Responsividade Perfeita**
- **Mobile-first** approach
- **Breakpoints semânticos**
- **Grid + Flexbox** para layouts
- **Touch-friendly** interfaces
- **Viewport optimization**

### 🔧 **Arquitetura Moderna**
- **JavaScript modular** com classes ES6+
- **Event-driven** architecture
- **Performance monitoring** integrado
- **Error tracking** automático
- **Core Web Vitals** tracking

## 🏗️ Estrutura do Projeto

```
contador/
├── index.html              # HTML semântico e acessível
├── styles.css              # CSS moderno com design system
├── script.js               # JavaScript modular
├── SVG/                    # Logos em SVG
│   ├── LOGOPBRANCA.svg
│   └── LOGOPRETA.svg
├── *.png                   # Imagens otimizadas
└── README.md              # Documentação
```

## 🎨 Design System

### Cores
```css
/* Primárias */
--color-primary: #2c2c2c
--color-accent: #a0522d
--color-secondary: #8b7355

/* Estados */
--color-success: #10b981
--color-danger: #ef4444
--color-warning: #f59e0b

/* Texto */
--color-text: #1a1a1a
--color-text-light: #6b7280
--color-text-white: #ffffff
```

### Tipografia
```css
/* Fontes */
--font-sans: 'Inter', system-ui, sans-serif
--font-display: 'Poppins', system-ui, sans-serif

/* Tamanhos */
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
--text-3xl: 1.875rem
--text-4xl: 2.25rem
--text-5xl: 3rem
--text-6xl: 3.75rem
```

### Espaçamento
```css
/* Sistema baseado em 8px */
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
--space-20: 5rem     /* 80px */
```

## 🔧 Funcionalidades

### 🎠 Carousel Hero
- **Auto-play** com pausa no hover
- **Navegação por teclado** (setas)
- **Indicadores** clicáveis
- **Transições suaves**
- **Acessibilidade** completa

### 📱 Navegação Mobile
- **Menu hambúrguer** animado
- **Overlay** responsivo
- **Smooth scroll** para seções
- **Header sticky** com blur

### 📝 Formulário de Contato
- **Validação em tempo real**
- **Máscara de telefone**
- **Feedback visual** de erros
- **Loading states**
- **Notificações** toast

### 🎭 Animações
- **Intersection Observer** para scroll
- **Fade in/up** effects
- **Hover animations**
- **Reduced motion** support
- **Performance otimizada**

## 📊 Performance

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Otimizações
- **Critical CSS** inline
- **Lazy loading** de imagens
- **Debounced events**
- **Throttled animations**
- **Preload** de recursos críticos

## 🚀 Como Usar

### 1. Clone o projeto
```bash
git clone [url-do-repositorio]
cd contador
```

### 2. Abra no navegador
```bash
# Simplesmente abra o index.html
# Ou use um servidor local:
python -m http.server 8000
# ou
npx serve .
```

### 3. Desenvolvimento
```bash
# Para desenvolvimento local
# Recomendo usar Live Server (VS Code extension)
# ou qualquer servidor local
```

## 🎯 Seções do Site

### 🏠 Hero Section
- **Gradient background** dinâmico
- **Carousel** de imagens
- **Call-to-action** buttons
- **Horários** de funcionamento

### 🛍️ Produtos
- **Grid responsivo** de cards
- **Ícones** temáticos
- **Hover effects**
- **Informações** detalhadas

### 🏥 Serviços
- **Cards visuais** com imagens
- **Overlay effects** no hover
- **Lista de benefícios**
- **Animações** suaves

### 💬 Depoimentos
- **Grid de feedback**
- **Sistema de rating**
- **Cards destacados**
- **Avatares** temáticos

### 📍 Lojas
- **Localização** das unidades
- **Imagens** das lojas
- **Informações** de contato
- **Links** diretos

### 📞 Contato
- **Formulário** completo
- **Validação** em tempo real
- **Informações** de contato
- **Horários** detalhados

## 🔧 Customização

### Cores
Edite as variáveis CSS em `styles.css`:
```css
:root {
  --color-primary: #sua-cor;
  --color-accent: #sua-cor-destaque;
  /* ... outras cores */
}
```

### Conteúdo
Modifique o HTML em `index.html`:
- Textos e descrições
- Imagens e logos
- Informações de contato
- Links e URLs

### Funcionalidades
Ajuste o JavaScript em `script.js`:
- Configurações do carousel
- Validações do formulário
- Animações e transições
- Performance settings

## 📱 Responsividade

### Breakpoints
```css
/* Mobile: < 768px */
/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */
```

### Adaptações
- **Grid layouts** flexíveis
- **Tipografia** escalável
- **Espaçamentos** responsivos
- **Imagens** otimizadas

## ♿ Acessibilidade

### Navegação
- **Skip links** para conteúdo principal
- **Menu** navegável por teclado
- **Focus indicators** visíveis
- **ARIA labels** apropriados

### Conteúdo
- **Alt text** em todas as imagens
- **Semantic HTML** structure
- **Color contrast** adequado
- **Screen reader** friendly

### Interações
- **Keyboard navigation** completa
- **Reduced motion** support
- **Error messages** claros
- **Loading states** informativos

## 🚀 Deploy

### Opções de Hosting
- **Netlify** (recomendado)
- **Vercel**
- **GitHub Pages**
- **Qualquer servidor web**

### Otimizações para Produção
1. **Comprima imagens** (WebP)
2. **Minifique CSS/JS**
3. **Configure cache headers**
4. **Habilite gzip**
5. **Configure HTTPS**

## 📈 Analytics

### Métricas Incluídas
- **Page Load Time**
- **Core Web Vitals**
- **Error Tracking**
- **Performance Monitoring**

### Integração
Para adicionar Google Analytics:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🤝 Contribuição

### Padrões de Código
- **ESLint** para JavaScript
- **Prettier** para formatação
- **BEM** para CSS
- **Semantic commits**

### Processo
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- **Inter** e **Poppins** fonts
- **Font Awesome** icons
- **Google Fonts** CDN
- **Comunidade** de desenvolvedores

---

**Desenvolvido com ❤️ para pets e seus tutores**

*Uma obra-prima dos deuses da programação* 🚀 