/**
 * Professional Document Enhancement Script
 * Modern ES6+ features with performance optimizations
 * @version 2.0.0
 */

'use strict';

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

const CONFIG = {
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    staggerDelay: 50
  },
  observer: {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  },
  scroll: {
    offset: 80,
    smooth: true
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const utils = {
  /**
   * Debounce function for performance
   */
  debounce: (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };
  },

  /**
   * Throttle function for scroll events
   */
  throttle: (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Check if element is in viewport
   */
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Smooth scroll to element
   */
  scrollTo: (target, offset = 0) => {
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
    
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  },

  /**
   * Add CSS custom property dynamically
   */
  setCSSProperty: (property, value) => {
    document.documentElement.style.setProperty(property, value);
  },

  /**
   * Get current scroll progress (0-1)
   */
  getScrollProgress: () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return scrollTop / docHeight;
  }
};

// ==========================================
// ANIMATION ENGINE
// ==========================================

class AnimationEngine {
  constructor() {
    this.elements = new Map();
    this.init();
  }

  init() {
    this.observeElements();
    this.setupScrollAnimations();
  }

  /**
   * Intersection Observer for scroll-triggered animations
   */
  observeElements() {
    const observerOptions = {
      threshold: CONFIG.observer.threshold,
      rootMargin: CONFIG.observer.rootMargin
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateIn(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      observer.observe(el);
    });
  }

  /**
   * Animate element entrance
   */
  animateIn(element) {
    const delay = element.dataset.delay || 0;
    const type = element.dataset.animate || 'fadeUp';
    
    const animations = {
      fadeUp: 'translateY(20px)',
      fadeDown: 'translateY(-20px)',
      fadeLeft: 'translateX(-20px)',
      fadeRight: 'translateX(20px)',
      scale: 'scale(0.95)',
      none: 'none'
    };

    element.style.transition = `all ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}`;
    element.style.transitionDelay = `${delay}ms`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  }

  /**
   * Stagger animation for lists
   */
  staggerAnimation(container, selector = 'li', delay = CONFIG.animation.staggerDelay) {
    const items = container.querySelectorAll(selector);
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        item.style.transition = `all ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}`;
        item.style.opacity = '1';
        item.style.transform = 'none';
      }, index * delay);
    });
  }

  /**
   * Parallax effect for hero sections
   */
  setupScrollAnimations() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    const handleScroll = utils.throttle(() => {
      const scrollY = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

// ==========================================
// TABLE OF CONTENTS GENERATOR
// ==========================================

class TOCGenerator {
  constructor(options = {}) {
    this.sourceSelector = options.source || 'article, main, .content';
    this.targetSelector = options.target || '.toc';
    this.minLevel = options.minLevel || 2;
    this.maxLevel = options.maxLevel || 4;
    this.init();
  }

  init() {
    this.source = document.querySelector(this.sourceSelector);
    this.target = document.querySelector(this.targetSelector);
    
    if (!this.source || !this.target) return;
    
    this.headings = this.getHeadings();
    if (this.headings.length === 0) return;
    
    this.render();
    this.setupIntersectionObserver();
  }

  getHeadings() {
    const selectors = [];
    for (let i = this.minLevel; i <= this.maxLevel; i++) {
      selectors.push(`h${i}`);
    }
    return Array.from(this.source.querySelectorAll(selectors.join(', ')));
  }

  render() {
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    this.headings.forEach((heading, index) => {
      // Add ID if not exists
      if (!heading.id) {
        heading.id = `section-${index}`;
      }
      
      const li = document.createElement('li');
      li.className = `toc-item toc-level-${heading.tagName.charAt(1)}`;
      
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.className = 'toc-link';
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        utils.scrollTo(heading, CONFIG.scroll.offset);
        history.pushState(null, null, `#${heading.id}`);
      });
      
      li.appendChild(link);
      tocList.appendChild(li);
    });
    
    this.target.innerHTML = '';
    this.target.appendChild(tocList);
    this.links = tocList.querySelectorAll('.toc-link');
  }

  setupIntersectionObserver() {
    const observerOptions = {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.highlightActive(entry.target.id);
        }
      });
    }, observerOptions);

    this.headings.forEach(heading => observer.observe(heading));
  }

  highlightActive(id) {
    this.links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      }
    });
  }
}

// ==========================================
// READING PROGRESS INDICATOR
// ==========================================

class ReadingProgress {
  constructor(selector = '.reading-progress') {
    this.element = document.querySelector(selector);
    if (!this.element) return;
    
    this.init();
  }

  init() {
    window.addEventListener('scroll', utils.throttle(() => {
      const progress = utils.getScrollProgress();
      this.element.style.setProperty('--progress', `${progress * 100}%`);
      this.element.style.width = `${progress * 100}%`;
    }, 16), { passive: true });
  }
}

// ==========================================
// CODE BLOCK ENHANCEMENTS
// ==========================================

class CodeEnhancer {
  constructor() {
    this.blocks = document.querySelectorAll('pre code');
    this.init();
  }

  init() {
    this.blocks.forEach((block, index) => {
      this.wrapBlock(block.parentElement, index);
      this.addCopyButton(block.parentElement);
      this.addLineNumbers(block);
    });
  }

  wrapBlock(pre, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    wrapper.dataset.index = index;
    
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    
    // Detect language
    const code = pre.querySelector('code');
    const lang = code.className.match(/language-(\w+)/)?.[1] || 'text';
    
    const header = document.createElement('div');
    header.className = 'code-header';
    header.innerHTML = `
      <span class="code-lang">${lang}</span>
      <div class="code-actions">
        <button class="code-toggle" aria-label="Toggle line numbers">
          <i class="fas fa-list-ol"></i>
        </button>
      </div>
    `;
    
    wrapper.insertBefore(header, pre);
  }

  addCopyButton(pre) {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.innerHTML = '<i class="far fa-copy"></i>';
    button.setAttribute('aria-label', 'Copy code');
    
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code').textContent;
      
      try {
        await navigator.clipboard.writeText(code);
        button.classList.add('copied');
        button.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
          button.classList.remove('copied');
          button.innerHTML = '<i class="far fa-copy"></i>';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
    
    pre.appendChild(button);
  }

  addLineNumbers(block) {
    const lines = block.textContent.split('\n').length;
    const lineNumbers = document.createElement('span');
    lineNumbers.className = 'line-numbers';
    lineNumbers.setAttribute('aria-hidden', 'true');
    
    let numbers = '';
    for (let i = 1; i <= lines; i++) {
      numbers += `${i}\n`;
    }
    lineNumbers.textContent = numbers;
    
    block.parentElement.classList.add('has-line-numbers');
    block.parentElement.insertBefore(lineNumbers, block);
  }
}

// ==========================================
// IMAGE LIGHTBOX
// ==========================================

class Lightbox {
  constructor(selector = '[data-lightbox]') {
    this.images = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.createOverlay();
    
    this.images.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e) => this.open(e.target));
    });
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox-overlay';
    this.overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <img class="lightbox-image" src="" alt="">
      <div class="lightbox-caption"></div>
    `;
    
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay || e.target.classList.contains('lightbox-close')) {
        this.close();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
    
    document.body.appendChild(this.overlay);
  }

  open(image) {
    const lightboxImg = this.overlay.querySelector('.lightbox-image');
    const caption = this.overlay.querySelector('.lightbox-caption');
    
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    caption.textContent = image.dataset.caption || image.alt || '';
    
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==========================================
// PRINT ENHANCEMENTS
// ==========================================

class PrintManager {
  constructor() {
    this.init();
  }

  init() {
    // Add print button if container exists
    const container = document.querySelector('.print-actions');
    if (container) {
      this.addPrintButton(container);
    }

    // Handle print events
    window.addEventListener('beforeprint', () => this.beforePrint());
    window.addEventListener('afterprint', () => this.afterPrint());
  }

  addPrintButton(container) {
    const btn = document.createElement('button');
    btn.className = 'print-button';
    btn.innerHTML = '<i class="fas fa-print"></i> Print / PDF';
    btn.addEventListener('click', () => window.print());
    container.appendChild(btn);
  }

  beforePrint() {
    document.body.classList.add('printing');
    
    // Expand all details elements
    this.detailsStates = [];
    document.querySelectorAll('details').forEach((details, index) => {
      this.detailsStates[index] = details.open;
      details.open = true;
    });
  }

  afterPrint() {
    document.body.classList.remove('printing');
    
    // Restore details states
    document.querySelectorAll('details').forEach((details, index) => {
      details.open = this.detailsStates[index];
    });
  }
}

// ==========================================
// THEME MANAGER (Dark/Light Mode)
// ==========================================

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'system';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createToggle();
    
    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentTheme === 'system') {
        this.applyTheme('system');
      }
    });
  }

  applyTheme(theme) {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let isDark = false;
    
    if (theme === 'dark' || (theme === 'system' && systemDark)) {
      isDark = true;
    }
    
    root.classList.toggle('dark-theme', isDark);
    root.classList.toggle('light-theme', !isDark);
    
    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = isDark ? '#0f172a' : '#ffffff';
    }
  }

  createToggle() {
    const container = document.querySelector('.theme-toggle-container');
    if (!container) return;
    
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle theme');
    button.innerHTML = `
      <span class="theme-icon light"><i class="fas fa-sun"></i></span>
      <span class="theme-icon dark"><i class="fas fa-moon"></i></span>
    `;
    
    button.addEventListener('click', () => {
      const themes = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(this.currentTheme);
      this.currentTheme = themes[(currentIndex + 1) % themes.length];
      
      localStorage.setItem('theme', this.currentTheme);
      this.applyTheme(this.currentTheme);
      this.updateButton(button);
    });
    
    this.updateButton(button);
    container.appendChild(button);
  }

  updateButton(button) {
    button.dataset.theme = this.currentTheme;
  }
}

// ==========================================
// SMOOTH SCROLL POLYFILL & ANCHOR HANDLING
// ==========================================

class SmoothScrollManager {
  constructor() {
    this.init();
  }

  init() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          utils.scrollTo(target, CONFIG.scroll.offset);
          history.pushState(null, null, targetId);
        }
      });
    });

    // Handle initial hash on load
    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) utils.scrollTo(target, CONFIG.scroll.offset);
      }, 100);
    }
  }
}

// ==========================================
// MAIN INITIALIZATION
// ==========================================

class DocumentApp {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.boot());
    } else {
      this.boot();
    }
  }

  boot() {
    // Initialize all modules
    this.animation = new AnimationEngine();
    this.toc = new TOCGenerator();
    this.progress = new ReadingProgress();
    this.code = new CodeEnhancer();
    this.lightbox = new Lightbox();
    this.print = new PrintManager();
    this.theme = new ThemeManager();
    this.scroll = new SmoothScrollManager();

    // Add loaded class for CSS transitions
    document.body.classList.add('js-loaded');

    console.log('📄 DocumentApp initialized successfully');
  }
}

// Start the application
const app = new DocumentApp();

// Expose to global for debugging (remove in production)
if (process.env.NODE_ENV !== 'production') {
  window.DocumentApp = app;
  window.utils = utils;
}
