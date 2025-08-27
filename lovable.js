class HamburgerMenu {
    constructor() {
        this.hamburgerBtn = document.getElementById('hamburgerBtn');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.navMenu = document.getElementById('navMenu');
        this.menuLinks = document.querySelectorAll('.menu-link');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.hamburgerBtn.addEventListener('click', () => this.toggleMenu());
        this.menuOverlay.addEventListener('click', () => this.closeMenu());
        
        // Add click listeners to menu links
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleMenuClick(e));
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });
        
        // Smooth scroll behavior
        this.initSmoothScroll();
        
        // Add intersection observer for active section highlighting
        this.initSectionObserver();
    }
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isMenuOpen = true;
        this.hamburgerBtn.classList.add('active');
        this.menuOverlay.classList.add('active');
        this.navMenu.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add staggered animation to menu items
        this.animateMenuItems();
        
        // Focus management
        this.navMenu.setAttribute('aria-hidden', 'false');
        this.hamburgerBtn.setAttribute('aria-expanded', 'true');
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        this.hamburgerBtn.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        this.navMenu.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Focus management
        this.navMenu.setAttribute('aria-hidden', 'true');
        this.hamburgerBtn.setAttribute('aria-expanded', 'false');
        this.hamburgerBtn.focus();
    }
    
    handleMenuClick(e) {
        const link = e.currentTarget;
        const section = link.getAttribute('data-section');
        
        if (section) {
            e.preventDefault();
            this.closeMenu();
            
            // Small delay to allow menu close animation
            setTimeout(() => {
                this.scrollToSection(section);
            }, 100);
        }
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerOffset = 80;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    animateMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = `slideInLeft 0.3s ease-out ${index * 0.1}s forwards`;
        });
    }
    
    initSmoothScroll() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    initSectionObserver() {
        const sections = document.querySelectorAll('.section');
        const menuLinks = document.querySelectorAll('.menu-link');
        
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    
                    // Remove active class from all links
                    menuLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current section link
                    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Enhanced animations and interactions
class AnimationManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.initScrollAnimations();
        this.initHoverEffects();
        this.initParallax();
    }
    
    initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }
    
    initHoverEffects() {
        // Add subtle hover effects to interactive elements
        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(0.5rem)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
    
    initParallax() {
        // Simple parallax effect for sections
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const sections = document.querySelectorAll('.section');
            
            sections.forEach((section, index) => {
                const rate = scrolled * -0.5;
                section.style.transform = `translateY(${rate * 0.1}px)`;
            });
        });
    }
}

// Utility functions
const Utils = {
    // Throttle function for performance
    throttle(func, limit) {
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
    },
    
    // Debounce function
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    // Get device type
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }
};

// Performance optimizations
const Performance = {
    init() {
        this.optimizeAnimations();
        this.lazyLoadImages();
    },
    
    optimizeAnimations() {
        // Reduce animations on slower devices
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection && connection.effectiveType === 'slow-2g') {
            document.body.classList.add('reduce-motion');
        }
    },
    
    lazyLoadImages() {
        // Implement lazy loading for images if needed
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hamburger menu
    new HamburgerMenu();
    
    // Initialize animations
    new AnimationManager();
    
    // Initialize performance optimizations
    Performance.init();
    
    // Add loaded class for CSS transitions
    document.body.classList.add('loaded');
    
    console.log('🍔 Hamburger menu initialized successfully!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.classList.add('paused');
    } else {
        // Resume animations when tab becomes visible
        document.body.classList.remove('paused');
    }
});