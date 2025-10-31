// Enhanced UI interactions and effects

const Interactions = {
    init() {
        this.addScrollEffects();
        this.addKeyboardShortcuts();
        this.enhanceAccessibility();
        this.addSmoothScrolling();
    },

    // Add scroll-triggered effects
    addScrollEffects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe all cards
        const observeCards = () => {
            document.querySelectorAll('.card').forEach(card => {
                observer.observe(card);
            });
        };

        // Initial observation
        observeCards();

        // Re-observe when content changes
        const appContainer = document.getElementById('app');
        if (appContainer) {
            const mutationObserver = new MutationObserver(observeCards);
            mutationObserver.observe(appContainer, { childList: true });
        }
    },

    // Add keyboard shortcuts
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const saveBtn = document.getElementById('saveAll');
                if (saveBtn) {
                    saveBtn.click();
                    this.addRippleEffect(saveBtn, e);
                }
            }

            // Ctrl/Cmd + K for quick navigation (future feature)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                // Could implement quick search/navigation here
            }
        });
    },

    // Enhance accessibility
    enhanceAccessibility() {
        // Add ARIA labels to dynamically created tabs
        const observer = new MutationObserver(() => {
            document.querySelectorAll('.tab').forEach((tab, index) => {
                if (!tab.hasAttribute('role')) {
                    tab.setAttribute('role', 'tab');
                    tab.setAttribute('aria-selected', tab.classList.contains('active'));
                    tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
                }
            });
        });

        const tabsContainer = document.getElementById('tabs');
        if (tabsContainer) {
            observer.observe(tabsContainer, { childList: true, subtree: true });
        }

        // Announce page changes to screen readers
        const app = document.getElementById('app');
        if (app) {
            const announceObserver = new MutationObserver(() => {
                const heading = app.querySelector('h1, h2');
                if (heading) {
                    app.setAttribute('aria-label', `Now viewing: ${heading.textContent}`);
                }
            });
            announceObserver.observe(app, { childList: true });
        }
    },

    // Add smooth scrolling
    addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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
    },

    // Add ripple effect on click
    addRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    },

    // Add loading state to buttons
    addLoadingState(button, promise) {
        const originalContent = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span class="spinner"></span> Loading...';
        button.classList.add('loading');

        promise.finally(() => {
            button.disabled = false;
            button.innerHTML = originalContent;
            button.classList.remove('loading');
        });
    }
};

// Add custom CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    button.loading {
        cursor: wait;
        opacity: 0.7;
    }

    /* Focus visible styles for better keyboard navigation */
    *:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
        border-radius: var(--radius-sm);
    }

    /* Smooth scrolling */
    html {
        scroll-behavior: smooth;
    }

    /* Skip to main content link for accessibility */
    .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: var(--radius-md);
        z-index: 1000;
    }

    .skip-link:focus {
        top: 10px;
        left: 10px;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Interactions.init());
} else {
    Interactions.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Interactions;
}
