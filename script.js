/**
 * Studio Foam Website - Interactive Scripts
 * Handles: Mobile menu, FAQ accordions, smooth scroll, animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initFAQ();
    initSmoothScroll();
    initScrollAnimations();
    initFoamAnimation();
});

/**
 * Mobile Menu Toggle
 * Why: Provides responsive navigation for smaller screens
 * How: Toggles 'active' class on menu and animates hamburger icon
 */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!toggle || !mobileMenu) return;
    
    toggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('active');
        
        // Toggle menu visibility
        mobileMenu.classList.toggle('active');
        
        // Animate hamburger to X
        toggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * FAQ Accordion
 * Why: Allows users to expand/collapse FAQ answers without page reload
 * How: Toggles 'active' class on FAQ items, only one open at a time
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items (accordion behavior)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
}

/**
 * Smooth Scroll for Anchor Links
 * Why: Creates a polished, smooth scrolling experience
 * How: Intercepts anchor link clicks and uses scrollIntoView
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Scroll-triggered Animations
 * Why: Creates visual interest as users scroll down the page
 * How: Uses IntersectionObserver to detect when elements enter viewport
 */
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;
    
    const animatedElements = document.querySelectorAll(
        '.feature-card, .content-card, .faq-item, .contact-card'
    );
    
    if (!animatedElements.length) return;
    
    // Add initial state
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Form Validation Helper (for delete-data and contact forms)
 * Why: Provides client-side validation before form submission
 * How: Validates email format and required fields
 */
function validateForm(formElement) {
    const email = formElement.querySelector('input[type="email"]');
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    // Validate email format
    if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            isValid = false;
            email.classList.add('error');
        }
    }
    
    return isValid;
}

/**
 * Voronoi-like Foam Animation
 * Why: Creates organic, expanding/contracting foam cells that share edges
 * How: Assigns alternating expand/contract phases so neighbors move in opposition
 */
function initFoamAnimation() {
    const foamCells = document.querySelectorAll('.foam-cell:not(.interstitial)');
    const interstitialCells = document.querySelectorAll('.foam-cell.interstitial');
    
    if (!foamCells.length) return;
    
    // Wait for SVG to be fully rendered
    const svg = document.querySelector('.foam-cells');
    if (!svg) return;
    
    // Use requestAnimationFrame to ensure SVG is rendered
    requestAnimationFrame(() => {
        // Assign alternating phases to main cells for asymmetric expansion/contraction
        foamCells.forEach((cell, index) => {
            try {
                // Get bounding box to calculate center
                const bbox = cell.getBBox();
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height / 2;
                
                // Set transform origin to cell center (in SVG coordinates)
                cell.style.transformOrigin = `${centerX}px ${centerY}px`;
                
                // Alternate between expand and contract phases
                // This creates the asymmetric effect where neighbors move in opposition
                if (index % 2 === 1) {
                    cell.classList.add('phase-contract');
                }
                
                // Add slight delay variation for organic feel
                const baseDelay = index * -1.5;
                const randomOffset = (Math.random() - 0.5) * 0.8;
                cell.style.animationDelay = `${baseDelay + randomOffset}s`;
                
                // Slight duration variation
                const durationVariation = (Math.random() - 0.5) * 2;
                cell.style.animationDuration = `${20 + durationVariation}s`;
            } catch (e) {
                // Fallback to center if getBBox fails
                cell.style.transformOrigin = 'center center';
            }
        });
        
        // Handle interstitial cells separately (can be circles or paths)
        interstitialCells.forEach((cell, index) => {
            try {
                const bbox = cell.getBBox();
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height / 2;
                cell.style.transformOrigin = `${centerX}px ${centerY}px`;
                
                // Random delays for interstitial cells - more variation
                const delay = index * -0.6 + (Math.random() - 0.5) * 1.5;
                cell.style.animationDelay = `${delay}s`;
                
                // Vary duration for interstitial cells
                const duration = 5 + (Math.random() - 0.5) * 1.5;
                cell.style.animationDuration = `${duration}s`;
            } catch (e) {
                cell.style.transformOrigin = 'center center';
            }
        });
    });
}

// Export for potential use in other scripts
window.StudioFoam = {
    validateForm
};
