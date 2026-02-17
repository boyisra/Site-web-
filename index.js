// Fonctionnalités spécifiques à la page d'accueil Blogosphere

// Animation des compteurs de statistiques
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Gestion des filtres d'articles
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articles = document.querySelectorAll('.article-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            articles.forEach(article => {
                if (filter === 'all' || article.getAttribute('data-category') === filter) {
                    article.style.display = 'block';
                    setTimeout(() => {
                        article.style.opacity = '1';
                        article.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    article.style.opacity = '0';
                    article.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        article.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Gestion du changement de vue (grille/liste)
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const articlesGrid = document.getElementById('articlesGrid');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const view = button.getAttribute('data-view');
            
            if (view === 'list') {
                articlesGrid.classList.add('list-view');
            } else {
                articlesGrid.classList.remove('list-view');
            }
        });
    });
}

// Animation au scroll
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animated');
        }
    });
}

// Fonction pour défiler vers la section articles
function scrollToArticles() {
    const articlesSection = document.getElementById('articlesSection');
    if (articlesSection) {
        articlesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialisation des animations des cartes flottantes
function initFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Animation de flottement
        card.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
    });
}

// Ajouter l'animation de flottement
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
    
    .list-view {
        grid-template-columns: 1fr !important;
    }
    
    .list-view .article-card {
        display: flex;
        flex-direction: row;
        height: 200px;
    }
    
    .list-view .article-image {
        width: 300px;
        height: 100%;
    }
    
    .list-view .article-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .article-card {
        transition: all 0.3s ease;
        opacity: 1;
        transform: translateY(0);
    }
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Démarrer les animations après un court délai
    setTimeout(() => {
        animateCounters();
        handleScrollAnimations();
        initFloatingCards();
    }, 500);
    
    // Initialiser les fonctionnalités
    initFilters();
    initViewToggle();
    
    // Observer le scroll pour les animations
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Mettre à jour l'interface utilisateur
    updateUserInterface();
});

// Gestion des likes sur les articles
document.addEventListener('click', (e) => {
    if (e.target.closest('.like-btn')) {
        const articleCard = e.target.closest('.article-card');
        const articleId = articleCard.getAttribute('data-article-id');
        toggleLike(articleId);
    }
    
    if (e.target.closest('.share-btn')) {
        const articleCard = e.target.closest('.article-card');
        const articleId = articleCard.getAttribute('data-article-id');
        const articleTitle = articleCard.querySelector('.article-title').textContent;
        shareArticle(articleId, articleTitle);
    }
});

// Effet parallaxe sur le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Gestion du responsive
function handleResponsive() {
    const width = window.innerWidth;
    const articlesGrid = document.querySelector('.articles-grid');
    
    if (width < 768) {
        articlesGrid.style.gridTemplateColumns = '1fr';
    } else if (width < 1024) {
        articlesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
        articlesGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
    }
}

window.addEventListener('resize', handleResponsive);
handleResponsive(); // Appel initial