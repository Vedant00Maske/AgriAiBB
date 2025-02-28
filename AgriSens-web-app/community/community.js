// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeHeader();
    initializeAnimations();
    initializeCounters();
    initializeEventListeners();
    initializeMobileNav();
});

// Header scroll effect
function initializeHeader() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.feature-card, .discussion-card, .event-card, .stat-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Initialize counters animation
function initializeCounters() {
    const stats = document.querySelectorAll('.number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50; // Adjust speed of counting
        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current).toLocaleString() + '+';
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target.toLocaleString() + '+';
            }
        };
        updateCount();
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            if (email) {
                showNotification('Thanks for subscribing to our newsletter!');
                newsletterForm.reset();
            }
        });
    }

    // Feature buttons interaction
    document.querySelectorAll('.feature-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Feature coming soon!');
        });
    });

    // Discussion card interaction
    document.querySelectorAll('.discussion-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('pulse');
            setTimeout(() => card.classList.remove('pulse'), 1000);
        });
    });
}

// Mobile navigation
function initializeMobileNav() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    
    document.querySelector('.header .container').appendChild(hamburger);
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    });
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add some CSS for new dynamic elements
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .fade-in.animate {
        opacity: 1;
        transform: translateY(0);
    }

    .pulse {
        animation: pulse 1s ease;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .hamburger {
        display: none;
        flex-direction: column;
        gap: 6px;
        cursor: pointer;
        padding: 10px;
    }

    .hamburger span {
        display: block;
        width: 25px;
        height: 2px;
        background: var(--black);
        transition: var(--transition);
    }

    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(7px, 7px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -7px);
    }

    @media (max-width: 768px) {
        .hamburger {
            display: flex;
        }

        .navbar {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: white;
            flex-direction: column;
            padding: 20px;
            transition: left 0.3s ease;
        }

        .navbar.active {
            left: 0;
        }
    }

    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
`;

document.head.appendChild(dynamicStyles);