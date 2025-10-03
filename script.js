class CustomCursor {
    constructor() {
        this.dot = document.getElementById('cursor-dot');
        this.outline = document.getElementById('cursor-outline');
        this.trail = document.getElementById('cursor-trail');
        this.isHovering = false;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => this.updatePosition(e));
        
        // Track hover states for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .interactive, .nav-link, .project-card, .tech-tag');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.setHovering(true));
            el.addEventListener('mouseleave', () => this.setHovering(false));
        });
    }
    
    updatePosition(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        this.dot.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
        this.outline.style.transform = `translate(${x - 16}px, ${y - 16}px)`;
        this.trail.style.transform = `translate(${x - 2}px, ${y - 2}px)`;
    }
    
    setHovering(hovering) {
        this.isHovering = hovering;
        if (hovering) {
            this.outline.style.width = '48px';
            this.outline.style.height = '48px';
            this.outline.style.transform = this.outline.style.transform.replace(/translate\((.*?)\)/, 
                (match, translate) => {
                    const coords = translate.split(',');
                    const x = parseFloat(coords[0]) - 8;
                    const y = parseFloat(coords[1]) - 8;
                    return `translate(${x}px, ${y}px)`;
                });
        } else {
            this.outline.style.width = '32px';
            this.outline.style.height = '32px';
        }
    }
}

// Typewriter Effect
class TypeWriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.currentText = '';
    }
    
    start() {
        this.type();
    }
    
    type() {
        if (this.currentIndex < this.text.length) {
            this.currentText += this.text.charAt(this.currentIndex);
            this.element.textContent = this.currentText;
            this.currentIndex++;
            
            setTimeout(() => this.type(), this.speed);
        } else {
            // Add blinking cursor
            this.element.innerHTML = this.currentText + '<span class="cursor-blink">|</span>';
        }
    }
}

// Smooth Scrolling
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Skills Animation
class SkillsAnimator {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-fill');
        this.observer = null;
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkills();
                }
            });
        }, { threshold: 0.3 });
        
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            this.observer.observe(skillsSection);
        }
    }
    
    animateSkills() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }, index * 200);
        });
    }
}

// Navigation
class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Toggle mobile menu
        this.navToggle?.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
            });
        });
        
        // Change nav background on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.nav.style.background = 'hsla(220, 25%, 10%, 0.95)';
            } else {
                this.nav.style.background = 'hsla(220, 25%, 10%, 0.8)';
            }
        });
        
        // Active link highlighting
        this.updateActiveLink();
        window.addEventListener('scroll', () => this.updateActiveLink());
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.project-card, .stat-card, .tech-tag');
        this.observer = null;
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }
}

// Contact Form
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(e);
        });
    }
    
    async handleSubmit(e) {
        const formData = {
            name: this.form.querySelector('#name').value,
            email: this.form.querySelector('#email').value,
            subject: this.form.querySelector('#subject').value,
            message: this.form.querySelector('#message').value
        };
        
        // Simple validation
        if (!formData.name || !formData.email || !formData.message) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showNotification('Message sent successfully!', 'success');
                this.form.reset();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            this.showNotification('Error sending message. Please try again.', 'error');
            console.error('Error:', error);
        }
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary)' : '#ef4444'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Parallax Effect
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.floating-element');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            this.elements.forEach((el, index) => {
                const speed = 0.5 + (index * 0.1);
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new CustomCursor();
    new Navigation();
    new SkillsAnimator();
    new ScrollAnimations();
    new ContactForm();
    new ParallaxEffect();
    
    // Initialize typewriter effect
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const typewriter = new TypeWriter(typewriterElement, 'Full Stack Developer', 100);
        setTimeout(() => typewriter.start(), 1000);
    }
    
    // Add CSS for cursor blink animation
    const style = document.createElement('style');
    style.textContent = `
        .cursor-blink {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .nav-link.active {
            color: var(--primary) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scroll for all anchor links
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
});