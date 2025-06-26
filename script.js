/**
 * FarmVet Pet Store - JavaScript Moderno
 * Arquitetura modular com performance otimizada
 */

// ========================================
// CONFIGURAÇÕES GLOBAIS
// ========================================

const CONFIG = {
  // Performance
  THROTTLE_DELAY: 16, // ~60fps
  DEBOUNCE_DELAY: 150,
  
  // Carousel
  CAROUSEL_AUTO_PLAY: 5000,
  CAROUSEL_TRANSITION: 500,
  
  // Scroll
  SCROLL_THRESHOLD: 100,
  
  // Animations
  ANIMATION_DURATION: 600,
  ANIMATION_EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Breakpoints
  BREAKPOINTS: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  }
};

// ========================================
// UTILITÁRIOS
// ========================================

class Utils {
  /**
   * Debounce function para otimizar performance
   */
  static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
  /**
   * Throttle function para limitar execução
   */
  static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
    };
  }

  /**
   * Verifica se elemento está visível na viewport
   */
  static isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Verifica se elemento está parcialmente visível
   */
  static isElementPartiallyVisible(el, threshold = 0.1) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    return visibleHeight > rect.height * threshold;
  }

  /**
   * Detecta preferência de movimento reduzido
   */
  static prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Detecta se é dispositivo móvel
   */
  static isMobile() {
    return window.innerWidth <= CONFIG.BREAKPOINTS.mobile;
  }

  /**
   * Smooth scroll para elemento
   */
  static smoothScrollTo(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Formata telefone brasileiro
   */
  static formatPhone(phone) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  /**
   * Validação de email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// ========================================
// GESTOR DE EVENTOS
// ========================================

class EventManager {
  constructor() {
    this.events = new Map();
  }

  /**
   * Adiciona listener de evento
   */
  on(element, event, handler, options = {}) {
    if (!this.events.has(element)) {
      this.events.set(element, new Map());
    }
    
    const elementEvents = this.events.get(element);
    if (!elementEvents.has(event)) {
      elementEvents.set(event, []);
    }
    
    elementEvents.get(event).push(handler);
    element.addEventListener(event, handler, options);
  }

  /**
   * Remove listener de evento
   */
  off(element, event, handler) {
    const elementEvents = this.events.get(element);
    if (elementEvents && elementEvents.has(event)) {
      const handlers = elementEvents.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
        element.removeEventListener(event, handler);
      }
    }
  }

  /**
   * Remove todos os eventos de um elemento
   */
  destroy(element) {
    const elementEvents = this.events.get(element);
    if (elementEvents) {
      elementEvents.forEach((handlers, event) => {
        handlers.forEach(handler => {
          element.removeEventListener(event, handler);
        });
    });
      this.events.delete(element);
    }
  }
}

// ========================================
// NAVEGAÇÃO
// ========================================

class Navigation {
  constructor() {
    this.header = document.querySelector('.header');
    this.navToggle = document.querySelector('.nav__toggle');
    this.navMenu = document.querySelector('.nav__menu');
    this.navLinks = document.querySelectorAll('.nav__menu a');
    this.isMenuOpen = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Toggle menu mobile
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMenu());
    }

    // Fechar menu ao clicar em link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Scroll header
    window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), CONFIG.THROTTLE_DELAY));

    // Smooth scroll para âncoras
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    this.navToggle.classList.toggle('nav__toggle--open', this.isMenuOpen);
    this.navMenu.classList.toggle('nav__menu--open', this.isMenuOpen);
    
    // Acessibilidade
    this.navToggle.setAttribute('aria-expanded', this.isMenuOpen);
    
    // Prevenir scroll do body
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    if (this.isMenuOpen) {
      this.toggleMenu();
    }
  }

  handleScroll() {
    const scrollY = window.pageYOffset;
    
    if (scrollY > CONFIG.SCROLL_THRESHOLD) {
      this.header.classList.add('header--scrolled');
            } else {
      this.header.classList.remove('header--scrolled');
    }
  }

  handleSmoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = this.header.offsetHeight;
        Utils.smoothScrollTo(target, headerHeight);
      }
    }
  }
}

// ========================================
// CAROUSEL
// ========================================

class Carousel {
  constructor(element) {
    this.element = element;
    this.track = element.querySelector('.hero__carousel-track');
    this.images = Array.from(element.querySelectorAll('.hero__carousel-img'));
    this.videoSlide = element.querySelector('.hero__carousel-video-slide');
    this.indicators = element.querySelectorAll('.hero__carousel-indicator');
    this.prevBtn = element.querySelector('.hero__carousel-btn--prev');
    this.nextBtn = element.querySelector('.hero__carousel-btn--next');
    this.filterBtns = document.querySelectorAll('.hero__carousel-filter-btn');
    this.currentIndex = 0;
    this.filter = 'images'; // images | video | all
    this.isTransitioning = false;
    this.autoPlayInterval = null;
    this.init();
  }

  init() {
    this.updateSlides();
    this.bindEvents();
    this.startAutoPlay();
    this.updateIndicators();
  }

  bindEvents() {
    // Botões de navegação
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goTo(index));
    });

    // Pausar autoplay no hover
    this.element.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.element.addEventListener('mouseleave', () => this.startAutoPlay());

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (this.element.contains(document.activeElement)) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
      }
    });

    // Filtro
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('hero__carousel-filter-btn--active'));
        btn.classList.add('hero__carousel-filter-btn--active');
        this.filterBtns.forEach(b => b.setAttribute('aria-selected', 'false'));
        btn.setAttribute('aria-selected', 'true');
        this.filter = btn.dataset.filter;
        this.currentIndex = 0;
        this.updateSlides();
        this.updateIndicators();
      });
    });
  }

  getSlides() {
    if (this.filter === 'images') {
      return this.images;
    } else if (this.filter === 'video') {
      return this.videoSlide ? [this.videoSlide] : [];
    } else {
      // all
      return this.videoSlide ? [...this.images, this.videoSlide] : this.images;
    }
  }

  updateSlides() {
    const slides = this.getSlides();
    // Esconde todos
    this.images.forEach(img => img.style.display = (this.filter !== 'video') ? '' : 'none');
    if (this.videoSlide) this.videoSlide.style.display = (this.filter !== 'images') ? '' : 'none';
    // Ativa o slide correto
    slides.forEach((slide, i) => {
      slide.classList.toggle('hero__carousel-img--active', i === this.currentIndex);
      if (slide.classList.contains('hero__carousel-img')) {
        slide.style.opacity = (i === this.currentIndex) ? '1' : '0';
      } else if (slide === this.videoSlide) {
        slide.style.opacity = (i === this.currentIndex) ? '1' : '0';
        const video = slide.querySelector('video');
        if (video) {
          if (i === this.currentIndex) {
            video.currentTime = 0;
            video.play();
          } else {
            video.pause();
          }
        }
      }
    });
    // Atualiza indicadores
    this.updateIndicators();
  }

  goTo(index) {
    const slides = this.getSlides();
    if (this.isTransitioning || index === this.currentIndex || index < 0 || index >= slides.length) return;
    this.isTransitioning = true;
    slides[this.currentIndex].classList.remove('hero__carousel-img--active');
    slides[index].classList.add('hero__carousel-img--active');
    this.currentIndex = index;
    setTimeout(() => {
      this.isTransitioning = false;
      this.updateSlides();
    }, CONFIG.CAROUSEL_TRANSITION);
  }

  next() {
    const slides = this.getSlides();
    const nextIndex = (this.currentIndex + 1) % slides.length;
    this.goTo(nextIndex);
  }

  prev() {
    const slides = this.getSlides();
    const prevIndex = this.currentIndex === 0 ? slides.length - 1 : this.currentIndex - 1;
    this.goTo(prevIndex);
  }

  updateIndicators() {
    const slides = this.getSlides();
    // Remove todos
    this.indicators.forEach(ind => ind.remove());
    // Adiciona conforme slides
    const indicatorsContainer = this.element.querySelector('.hero__carousel-indicators');
    indicatorsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'hero__carousel-indicator' + (i === this.currentIndex ? ' hero__carousel-indicator--active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
      btn.setAttribute('aria-selected', i === this.currentIndex ? 'true' : 'false');
      btn.addEventListener('click', () => this.goTo(i));
      indicatorsContainer.appendChild(btn);
    });
  }

  startAutoPlay() {
    if (Utils.prefersReducedMotion()) return;
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, CONFIG.CAROUSEL_AUTO_PLAY);
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  destroy() {
    this.pauseAutoPlay();
  }
}

// ========================================
// ANIMAÇÕES
// ========================================

class AnimationManager {
  constructor() {
    this.animatedElements = new Set();
    this.observer = null;
    
    this.init();
  }

  init() {
    if (Utils.prefersReducedMotion()) return;
    
    this.setupIntersectionObserver();
    this.observeElements();
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
            this.animateElement(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  observeElements() {
    const elements = document.querySelectorAll(
      '.product-card, .service-card, .testimonial-card, .location-card, .section__header'
    );
    
    elements.forEach(element => {
      this.observer.observe(element);
    });
  }

  animateElement(element) {
    if (this.animatedElements.has(element)) return;
    
    this.animatedElements.add(element);
    
    // Determina tipo de animação baseado na classe
    let animationClass = 'animate-fade-in-up';
    
    if (element.classList.contains('section__header')) {
      animationClass = 'animate-fade-in';
    } else if (element.classList.contains('service-card')) {
      animationClass = 'animate-slide-in-left';
    }
    
    element.classList.add(animationClass);
    
    // Remove classe após animação
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, CONFIG.ANIMATION_DURATION);
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// ========================================
// FORMULÁRIO
// ========================================

class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.submitBtn = this.form?.querySelector('button[type="submit"]');
    this.originalBtnText = this.submitBtn?.textContent;
    
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.bindEvents();
    this.setupValidation();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Validação em tempo real
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  setupValidation() {
    // Máscara de telefone
    const phoneInput = this.form.querySelector('#phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
          value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
          e.target.value = value;
        }
      });
    }
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove erro anterior
    this.clearFieldError(field);

    // Validações específicas
    switch (field.type) {
      case 'email':
        if (value && !Utils.isValidEmail(value)) {
          isValid = false;
          errorMessage = 'E-mail inválido';
        }
        break;
      
      case 'tel':
        if (value && value.replace(/\D/g, '').length < 10) {
          isValid = false;
          errorMessage = 'Telefone inválido';
        }
        break;
    }

    // Validação obrigatória
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Este campo é obrigatório';
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('form__input--error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'form__error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    
    field.parentNode.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.classList.remove('form__input--error');
    
    const errorElement = field.parentNode.querySelector('.form__error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  validateForm() {
    const fields = this.form.querySelectorAll('input, select, textarea');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      this.showNotification('Por favor, corrija os erros no formulário.', 'error');
                return;
            }
            
    this.setLoading(true);

    try {
      // Simula envio (substitua por sua API real)
      await this.submitForm();
      this.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
      this.form.reset();
    } catch (error) {
      this.showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  async submitForm() {
    // Simula delay de API
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  setLoading(loading) {
    if (this.submitBtn) {
      this.submitBtn.disabled = loading;
      this.submitBtn.innerHTML = loading 
        ? '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Enviando...'
        : this.originalBtnText;
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
      <div class="notification__content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" aria-hidden="true"></i>
        <span>${message}</span>
      </div>
      <button class="notification__close" aria-label="Fechar notificação">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    `;

    // Adiciona ao DOM
    document.body.appendChild(notification);

    // Anima entrada
    requestAnimationFrame(() => {
      notification.classList.add('notification--visible');
    });

    // Auto-remove após 5 segundos
    setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);

    // Botão fechar
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => this.removeNotification(notification));
  }

  removeNotification(notification) {
    notification.classList.remove('notification--visible');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}

// ========================================
// PERFORMANCE & ANALYTICS
// ========================================

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.measurePageLoad();
    this.measureCoreWebVitals();
    this.setupErrorTracking();
  }

  measurePageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      this.metrics.pageLoad = {
        total: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint()
      };

      console.log('Performance Metrics:', this.metrics.pageLoad);
    });
  }

  measureCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      console.log('LCP:', this.metrics.lcp);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        console.log('FID:', this.metrics.fid);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    new PerformanceObserver((list) => {
      let cls = 0;
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      this.metrics.cls = cls;
      console.log('CLS:', this.metrics.cls);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
  }

  setupErrorTracking() {
    window.addEventListener('error', (e) => {
      console.error('JavaScript Error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled Promise Rejection:', e.reason);
    });
  }
}

// ========================================
// APLICAÇÃO PRINCIPAL
// ========================================

class FarmVetApp {
  constructor() {
    this.modules = new Map();
    this.eventManager = new EventManager();
    
    this.init();
  }

  init() {
    // Aguarda DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    console.log('🚀 FarmVet Pet Store iniciando...');
    
    try {
      // Inicializa módulos
      this.initModules();
      
      // Monitor de performance
      this.performanceMonitor = new PerformanceMonitor();
      
      console.log('✅ FarmVet Pet Store iniciado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao inicializar aplicação:', error);
    }
  }

  initModules() {
    // Navegação
    this.modules.set('navigation', new Navigation());
    
    // Carousel
    const carouselElement = document.querySelector('.hero__carousel');
    if (carouselElement) {
      this.modules.set('carousel', new Carousel(carouselElement));
    }
    
    // Animações
    this.modules.set('animations', new AnimationManager());
    
    // Formulário de contato
    this.modules.set('contactForm', new ContactForm());
    
    // Lazy loading de imagens
    this.initLazyLoading();
    
    // Service Worker (se disponível)
    this.initServiceWorker();
  }

  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registrado');
      } catch (error) {
        console.log('❌ Service Worker não registrado:', error);
      }
    }
  }

  destroy() {
    // Destrói todos os módulos
    this.modules.forEach(module => {
      if (module.destroy) {
        module.destroy();
      }
    });
    
    this.modules.clear();
    
    // Destrói event manager
    this.eventManager = null;
  }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Inicia aplicação quando DOM estiver pronto
const app = new FarmVetApp();

// Expõe para debug (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.FarmVetApp = app;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js');
  });
} 