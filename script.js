// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
const filterBtns = document.querySelectorAll('.filter-btn');
const articlesGrid = document.getElementById('articlesGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const statNumbers = document.querySelectorAll('.stat-number');

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

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

// Article filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        filterArticles(filter);
    });
});

function filterArticles(filter) {
    const articles = document.querySelectorAll('.article-card');
    
    articles.forEach(article => {
        if (filter === 'all') {
            article.style.display = 'block';
            animateArticle(article);
        } else {
            const category = article.dataset.category;
            if (category === filter) {
                article.style.display = 'block';
                animateArticle(article);
            } else {
                article.style.display = 'none';
            }
        }
    });
}

function animateArticle(article) {
    article.style.opacity = '0';
    article.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        article.style.transition = 'all 0.5s ease';
        article.style.opacity = '1';
        article.style.transform = 'translateY(0)';
    }, 100);
}

// Animated counter for statistics
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            animateCounter(statNumber);
            statsObserver.unobserve(statNumber);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Load more articles functionality
let articlesLoaded = 6;
const articlesPerLoad = 3;

loadMoreBtn.addEventListener('click', () => {
    // Simulate loading more articles
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
    loadMoreBtn.disabled = true;
    
    setTimeout(() => {
        // Add new articles (in a real app, this would fetch from server)
        const newArticles = generateNewArticles(articlesPerLoad);
        newArticles.forEach(article => {
            articlesGrid.appendChild(article);
        });
        
        articlesLoaded += articlesPerLoad;
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Charger plus d\'articles';
        loadMoreBtn.disabled = false;
        
        // Hide button if all articles are loaded (simulated)
        if (articlesLoaded >= 15) {
            loadMoreBtn.style.display = 'none';
        }
    }, 1000);
});

function generateNewArticles(count) {
    const articles = [];
    const titles = [
        'React vs Vue : Le comparatif complet 2026',
        'TypeScript : Pourquoi vous devriez l\'adopter',
        'Les bases du Cloud Computing expliquées simplement',
        'Comment optimiser votre SEO technique',
        'Les dernières tendances du mobile development',
        'Introduction à la blockchain pour développeurs'
    ];
    
    const authors = ['Lucas Martin', 'Camille Bernard', 'Antoine Dubois', 'Léa Petit'];
    const categories = ['popular', 'trending', 'recent'];
    
    for (let i = 0; i < count; i++) {
        const article = document.createElement('article');
        article.className = 'article-card';
        article.dataset.category = categories[Math.floor(Math.random() * categories.length)];
        
        const titleIndex = (articlesLoaded + i) % titles.length;
        const authorIndex = Math.floor(Math.random() * authors.length);
        
        article.innerHTML = `
            <div class="article-image">
                <img src="https://images.unsplash.com/photo-${1500000000000 + (articlesLoaded + i) * 1000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Article ${articlesLoaded + i + 1}">
                <div class="article-overlay">
                    <button class="btn-read">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <div class="author">
                        <img src="https://images.unsplash.com/photo-${1500000000000 + authorIndex * 1000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" alt="${authors[authorIndex]}">
                        <span>${authors[authorIndex]}</span>
                    </div>
                    <div class="date">
                        <i class="far fa-calendar"></i>
                        <span>${9 - (articlesLoaded + i) % 30} fév 2026</span>
                    </div>
                </div>
                <h3 class="article-title">
                    <a href="article.html">${titles[titleIndex]}</a>
                </h3>
                <p class="article-excerpt">
                    Découvrez les meilleures pratiques et techniques pour améliorer votre développement...
                </p>
                <div class="article-tags">
                    <span class="tag">JavaScript</span>
                    <span class="tag">Web</span>
                    <span class="tag">Tutoriel</span>
                </div>
                <div class="article-stats">
                    <div class="stat">
                        <i class="fas fa-heart"></i>
                        <span>${Math.floor(Math.random() * 200) + 50}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-comment"></i>
                        <span>${Math.floor(Math.random() * 50) + 10}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-eye"></i>
                        <span>${Math.floor(Math.random() * 1000) + 200}</span>
                    </div>
                </div>
            </div>
        `;
        
        articles.push(article);
    }
    
    return articles;
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Add scroll classes to navbar
const style = document.createElement('style');
style.textContent = `
    .navbar {
        transition: transform 0.3s ease;
    }
    .navbar.scroll-down {
        transform: translateY(-100%);
    }
    .navbar.scroll-up {
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - scrolled / 800;
    }
});

// Add hover effect to article cards
document.addEventListener('DOMContentLoaded', () => {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Button ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    .ripple {
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
`;
document.head.appendChild(rippleStyle);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const originalText = heroTitle.textContent;
    // Uncomment the line below to enable typing effect
    // typeWriter(heroTitle, originalText, 30);
}
