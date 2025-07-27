// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .service-card, .project-card, .skill-category').forEach(el => {
    observer.observe(el);
});

// Typing animation for hero code
function typeWriter() {
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '0';
            setTimeout(() => {
                line.style.opacity = '1';
            }, 200);
        }, index * 500);
    });
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(typeWriter, 1000);
    setInterval(typeWriter, 8000); // Repeat every 8 seconds
});

// Parallax effect for hero background elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.3;
        orb.style.transform = `translateY(${rate * speed}px)`;
    });
    
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.2;
        shape.style.transform = `translateY(${rate * speed}px)`;
    });
});

// Skill tags hover effect
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Service and project cards tilt effect
function addTiltEffect(selector) {
    document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

addTiltEffect('.service-card');
addTiltEffect('.project-card');

// Contact form handling with EmailJS
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    // Set current time when page loads
    const timeField = document.getElementById('form-time');
    if (timeField) {
        timeField.value = new Date().toLocaleString();
    }
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Send email using EmailJS
        emailjs.sendForm('service_84fbmlh', 'template_4ayzqcf', this)
            .then(() => {
                console.log('SUCCESS!');
                // Show success message
                const currentLang = document.documentElement.lang;
                const successMessage = currentLang === 'en' 
                    ? '✅ Message sent successfully! I will get back to you soon.'
                    : '✅ Messaggio inviato con successo! Ti risponderò presto.';
                
                showNotification(successMessage, 'success');
                
                // Reset form
                this.reset();
                if (timeField) {
                    timeField.value = new Date().toLocaleString();
                }
            })
            .catch((error) => {
                console.log('FAILED...', error);
                // Show error message
                const currentLang = document.documentElement.lang;
                const errorMessage = currentLang === 'en' 
                    ? '❌ Failed to send message. Please try again or contact me directly.'
                    : '❌ Invio fallito. Riprova o contattami direttamente.';
                
                showNotification(errorMessage, 'error');
            })
            .finally(() => {
                // Hide loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Get color based on type
    let borderColor = 'var(--primary-color)';
    if (type === 'success') borderColor = '#4CAF50';
    if (type === 'error') borderColor = '#f44336';
    if (type === 'warning') borderColor = '#ff9800';
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border-left: 4px solid ${borderColor};
        box-shadow: var(--shadow-card);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 7 seconds (longer for important messages)
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 7000);
}

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add smooth reveal animations
const revealElements = document.querySelectorAll('.service-card, .project-card, .about-content, .contact-content');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// Cursor trail effect removed as requested

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 Konami Code attivato! Hai sbloccato la modalità sviluppatore!', 'success');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
        konamiCode = [];
    }
});

console.log('🚀 Portfolio di Tasuhiro Davide Kato caricato con successo!');
console.log('💡 Suggerimento: Prova il Konami Code (↑↑↓↓←→←→BA) per un easter egg!');
