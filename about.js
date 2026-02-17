document.addEventListener('DOMContentLoaded', function() {
    // Animation des statistiques
    const statCards = document.querySelectorAll('.stat-content h3');
    
    const animateCounter = (element, target) => {
        const targetValue = parseInt(target.replace('+', '').replace(',', ''));
        let current = 0;
        const increment = targetValue / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 30);
    };
    
    // Observer les cartes de statistiques
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target.querySelector('h3');
                const targetValue = statElement.textContent;
                
                if (!statElement.classList.contains('animated')) {
                    statElement.classList.add('animated');
                    animateCounter(statElement, targetValue);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-card').forEach(card => {
        statsObserver.observe(card);
    });
    
    // Animation des cartes de l'équipe au survol
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            const avatar = this.querySelector('.member-avatar i');
            if (avatar) {
                avatar.style.transform = 'scale(1.1)';
                avatar.style.transition = 'transform 0.3s ease';
            }
        });
        
        member.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.member-avatar i');
            if (avatar) {
                avatar.style.transform = 'scale(1)';
            }
        });
    });
    
    // Animation de la timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animation spécifique pour chaque élément
                const timelineContent = entry.target.querySelector('.timeline-content');
                if (timelineContent) {
                    timelineContent.style.opacity = '1';
                    timelineContent.style.transform = 'translateX(0)';
                }
            }
        });
    }, { threshold: 0.1 });
    
    // Initialiser les styles d'animation
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.transitionDelay = `${index * 0.1}s`;
        
        const timelineContent = item.querySelector('.timeline-content');
        if (timelineContent) {
            const isOdd = index % 2 === 1;
            timelineContent.style.opacity = '0';
            timelineContent.style.transform = isOdd ? 'translateX(50px)' : 'translateX(-50px)';
            timelineContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            timelineContent.style.transitionDelay = `${index * 0.1 + 0.2}s`;
        }
        
        timelineObserver.observe(item);
    });
    
    // Animation des cartes de valeurs
    const valueCards = document.querySelectorAll('.value-card');
    
    const valuesObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animation de l'icône
                const icon = entry.target.querySelector('.value-icon');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                    icon.style.opacity = '1';
                }
            }
        });
    }, { threshold: 0.2 });
    
    valueCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        const icon = card.querySelector('.value-icon');
        if (icon) {
            icon.style.transform = 'scale(0.5)';
            icon.style.opacity = '0';
            icon.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            icon.style.transitionDelay = `${index * 0.1 + 0.2}s`;
        }
        
        valuesObserver.observe(card);
    });
    
    // Effet de parallaxe pour l'image hero
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroImage.style.transform = `translate3d(0px, ${rate}px, 0px)`;
        });
    }
    
    // Animation des icônes sociales au survol
    const socialLinks = document.querySelectorAll('.member-social a');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                // Légère rotation de l'icône
                icon.style.transform = 'rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    // Animation du texte highlight
    const highlights = document.querySelectorAll('.highlight');
    
    highlights.forEach(highlight => {
        highlight.addEventListener('mouseenter', function() {
            const after = window.getComputedStyle(this, '::after');
            this.style.setProperty('--highlight-scale', '1.1');
        });
        
        highlight.addEventListener('mouseleave', function() {
            this.style.setProperty('--highlight-scale', '1');
        });
    });
    
    // Ajouter le CSS pour l'animation du highlight
    const highlightStyles = document.createElement('style');
    highlightStyles.textContent = `
        .highlight::after {
            transition: transform 0.3s ease;
            transform: scaleX(var(--highlight-scale, 1));
            transform-origin: left;
        }
    `;
    document.head.appendChild(highlightStyles);
});