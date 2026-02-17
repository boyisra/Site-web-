// Fonctionnalités spécifiques à la page de détail d'article Blogosphere

// Gestion des likes
function toggleLike(articleId) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showNotification('Vous devez être connecté pour aimer un article', 'warning');
        showLoginModal();
        return;
    }
    
    const likeBtn = document.querySelector('.like-btn');
    const likeCount = document.querySelector('.like-count');
    
    if (!likeBtn || !likeCount) return;
    
    const isLiked = likeBtn.classList.contains('liked');
    const currentCount = parseInt(likeCount.textContent);
    
    if (isLiked) {
        likeBtn.classList.remove('liked');
        likeCount.textContent = currentCount - 1;
        showNotification('Article retiré des favoris', 'info');
    } else {
        likeBtn.classList.add('liked');
        likeCount.textContent = currentCount + 1;
        showNotification('Article ajouté aux favoris!', 'success');
        
        // Animation du cœur
        likeBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            likeBtn.style.transform = 'scale(1)';
        }, 200);
    }
}

// Gestion des bookmarks
function toggleBookmark() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showNotification('Vous devez être connecté pour bookmark un article', 'warning');
        showLoginModal();
        return;
    }
    
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    
    if (!bookmarkBtn) return;
    
    const isBookmarked = bookmarkBtn.classList.contains('bookmarked');
    
    if (isBookmarked) {
        bookmarkBtn.classList.remove('bookmarked');
        showNotification('Article retiré des signets', 'info');
    } else {
        bookmarkBtn.classList.add('bookmarked');
        showNotification('Article ajouté aux signets!', 'success');
    }
}

// Modal de partage
function showShareModal() {
    const modal = document.getElementById('shareModal');
    modal.classList.add('show');
}

// Partage sur les réseaux sociaux
function shareOnSocial(platform) {
    const url = window.location.href;
    const title = document.querySelector('.article-hero-title').textContent;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        showNotification(`Partage sur ${platform} réussi!`, 'success');
    }
    
    closeModal('shareModal');
}

// Copier le lien
function copyLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Lien copié dans le presse-papiers!', 'success');
        });
    } else {
        // Fallback pour les anciens navigateurs
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Lien copié dans le presse-papiers!', 'success');
    }
    
    closeModal('shareModal');
}

// Gestion des commentaires
function submitComment() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showNotification('Vous devez être connecté pour commenter', 'warning');
        showLoginModal();
        return;
    }
    
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
        showNotification('Veuillez rédiger un commentaire', 'error');
        return;
    }
    
    // Créer le nouveau commentaire
    const commentsList = document.querySelector('.comments-list');
    const newComment = createCommentElement({
        author: localStorage.getItem('userName') || 'Utilisateur',
        text: commentText,
        date: 'À l\'instant',
        avatar: 'static/images/default-avatar.jpg'
    });
    
    // Ajouter au début de la liste
    commentsList.insertBefore(newComment, commentsList.firstChild);
    
    // Vider le champ
    commentInput.value = '';
    
    showNotification('Commentaire publié avec succès!', 'success');
    
    // Animation d'apparition
    newComment.style.opacity = '0';
    newComment.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        newComment.style.transition = 'all 0.3s ease';
        newComment.style.opacity = '1';
        newComment.style.transform = 'translateY(0)';
    }, 100);
}

// Créer un élément de commentaire
function createCommentElement(commentData) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
        <div class="comment-avatar">
            <img src="${commentData.avatar}" alt="Utilisateur">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-author">${commentData.author}</span>
                <span class="comment-date">${commentData.date}</span>
                <button class="comment-reply" onclick="replyToComment(${Date.now()})">
                    <i class="fas fa-reply"></i> Répondre
                </button>
            </div>
            <p class="comment-text">${commentData.text}</p>
            <div class="comment-actions">
                <button class="comment-like" onclick="likeComment(${Date.now()})">
                    <i class="fas fa-thumbs-up"></i> 0
                </button>
            </div>
        </div>
    `;
    
    return commentDiv;
}

// Répondre à un commentaire
function replyToComment(commentId) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showNotification('Vous devez être connecté pour répondre', 'warning');
        showLoginModal();
        return;
    }
    
    const commentInput = document.getElementById('commentInput');
    commentInput.focus();
    commentInput.placeholder = `Répondre au commentaire...`;
    commentInput.scrollIntoView({ behavior: 'smooth' });
}

// Likes sur les commentaires
function likeComment(commentId) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showNotification('Vous devez être connecté pour aimer un commentaire', 'warning');
        showLoginModal();
        return;
    }
    
    // Animation du bouton like
    event.target.closest('.comment-like').style.transform = 'scale(1.1)';
    setTimeout(() => {
        event.target.closest('.comment-like').style.transform = 'scale(1)';
    }, 200);
    
    showNotification('Commentaire aimé!', 'success');
}

// Insérer un emoji
function insertEmoji() {
    const commentInput = document.getElementById('commentInput');
    const emojis = ['😊', '❤️', '👍', '🎉', '🔥', '💯', '👏', '🙏'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const cursorPosition = commentInput.selectionStart;
    const textBefore = commentInput.value.substring(0, cursorPosition);
    const textAfter = commentInput.value.substring(cursorPosition);
    
    commentInput.value = textBefore + randomEmoji + textAfter;
    commentInput.focus();
    commentInput.setSelectionRange(cursorPosition + randomEmoji.length, cursorPosition + randomEmoji.length);
}

// Charger plus de commentaires
function loadMoreComments() {
    const loadMoreBtn = document.querySelector('.load-more-comments button');
    
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
    loadMoreBtn.disabled = true;
    
    // Simulation du chargement
    setTimeout(() => {
        // Ajouter de nouveaux commentaires ici
        loadMoreBtn.innerHTML = 'Charger plus de commentaires';
        loadMoreBtn.disabled = false;
        showNotification('Nouveaux commentaires chargés', 'info');
    }, 1500);
}

// Sommaire interactif
function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Suivre l'auteur
function followAuthor() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showNotification('Vous devez être connecté pour suivre un auteur', 'warning');
        showLoginModal();
        return;
    }
    
    const followBtn = document.querySelector('.author-widget .btn-primary');
    
    if (followBtn.textContent === 'Suivre') {
        followBtn.textContent = 'Suivi';
        followBtn.classList.remove('btn-primary');
        followBtn.classList.add('btn-secondary');
        showNotification('Auteur suivi avec succès!', 'success');
    } else {
        followBtn.textContent = 'Suivre';
        followBtn.classList.remove('btn-secondary');
        followBtn.classList.add('btn-primary');
        showNotification('Auteur retiré des abonnements', 'info');
    }
}

// Temps de lecture estimé
function calculateReadingTime() {
    const articleContent = document.querySelector('.article-body');
    const text = articleContent.textContent;
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    
    // Mettre à jour l'affichage
    const readingTimeElement = document.querySelector('.reading-time');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} min de lecture`;
    }
}

// Progression de lecture
function initReadingProgress() {
    const article = document.querySelector('.article-detail');
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 80px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const articleHeight = article.offsetHeight;
        const articleTop = article.offsetTop;
        const windowHeight = window.innerHeight;
        const scrollPosition = window.pageYOffset;
        
        const articleBottom = articleTop + articleHeight;
        const progress = Math.min(100, Math.max(0, 
            ((scrollPosition + windowHeight - articleTop) / articleHeight) * 100
        ));
        
        progressBar.style.width = `${progress}%`;
    });
}

// Surlignage des titres lors du scroll
function initActiveHeading() {
    const headings = document.querySelectorAll('.article-body h2, .article-body h3');
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    
    window.addEventListener('scroll', () => {
        let currentHeading = null;
        
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100) {
                currentHeading = heading;
            }
        });
        
        // Mettre à jour le sommaire
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (currentHeading && link.getAttribute('href') === `#${currentHeading.id}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les fonctionnalités
    initTableOfContents();
    calculateReadingTime();
    initReadingProgress();
    initActiveHeading();
    
    // Ajouter les IDs aux titres pour le sommaire
    const headings = document.querySelectorAll('.article-body h2, .article-body h3');
    headings.forEach((heading, index) => {
        heading.id = `heading-${index}`;
    });
    
    // Mettre à jour les liens du sommaire
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    tocLinks.forEach((link, index) => {
        link.setAttribute('href', `#heading-${index}`);
    });
    
    // Gestion du bouton suivre
    const followBtn = document.querySelector('.author-widget .btn-primary');
    if (followBtn) {
        followBtn.addEventListener('click', followAuthor);
    }
    
    // Mettre à jour l'interface utilisateur
    updateUserInterface();
});

// Gestion du clavier pour les commentaires
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        const commentInput = document.getElementById('commentInput');
        if (document.activeElement === commentInput) {
            e.preventDefault();
            submitComment();
        }
    }
});

// Animation des statistiques de l'article
function animateArticleStats() {
    const stats = document.querySelectorAll('.stat-item span');
    
    stats.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumber = /^\d/.test(finalValue);
        
        if (isNumber) {
            const target = parseInt(finalValue);
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 30);
        }
    });
}

// Démarrer l'animation des statistiques
setTimeout(animateArticleStats, 500);

document.addEventListener('DOMContentLoaded', function() {
    // Gestion des likes d'article
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.querySelector('.like-count');
    let isLiked = false;
    
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            if (!isLiked) {
                // Simuler un like
                isLiked = true;
                this.classList.add('liked');
                this.querySelector('i').className = 'fas fa-heart';
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
                
                // Envoyer la requête AJAX au serveur
                simulateLikeRequest(true);
            } else {
                // Simuler un unlike
                isLiked = false;
                this.classList.remove('liked');
                this.querySelector('i').className = 'far fa-heart';
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
                
                // Envoyer la requête AJAX au serveur
                simulateLikeRequest(false);
            }
        });
    }
    
    // Simulation de requête AJAX pour les likes
    function simulateLikeRequest(liking) {
        console.log(liking ? 'Article liké' : 'Like retiré');
        // Dans une vraie application, vous enverriez une requête AJAX ici
    }
    
    // Gestion du partage
    const shareBtn = document.getElementById('shareArticleBtn');
    const shareOptions = document.querySelector('.share-options');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            // Ouvrir les options de partage
            if (shareOptions.style.display === 'flex') {
                shareOptions.style.display = 'none';
            } else {
                shareOptions.style.display = 'flex';
            }
        });
    }
    
    // Gestion du partage social
    document.querySelectorAll('.share-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const type = this.classList[1];
            
            if (type === 'copy') {
                // Copier le lien dans le presse-papier
                navigator.clipboard.writeText(window.location.href)
                    .then(() => {
                        showNotification('Lien copié dans le presse-papier !');
                    })
                    .catch(err => {
                        console.error('Erreur de copie : ', err);
                    });
            } else {
                // Ouvrir les liens de partage social
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                let shareUrl;
                
                switch (type) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            }
            
            shareOptions.style.display = 'none';
        });
    });
    
    // Gestion du formulaire de commentaire
    const commentForm = document.getElementById('commentForm');
    const commentText = document.getElementById('commentText');
    const commentsList = document.getElementById('commentsList');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!commentText.value.trim()) {
                showNotification('Veuillez écrire un commentaire', 'error');
                return;
            }
            
            // Simuler l'envoi du commentaire
            const newComment = createCommentElement(
                'Vous',
                'À l\'instant',
                commentText.value.trim()
            );
            
            commentsList.prepend(newComment);
            commentText.value = '';
            
            // Mettre à jour le compteur de commentaires
            updateCommentCount(1);
            
            showNotification('Commentaire publié avec succès !');
        });
    }
    
    // Gestion des réponses aux commentaires
    document.querySelectorAll('.btn-reply').forEach(button => {
        button.addEventListener('click', function() {
            const commentId = this.getAttribute('data-comment-id');
            const comment = this.closest('.comment');
            const repliesContainer = comment.querySelector('.comment-replies');
            
            if (!repliesContainer) {
                // Créer un conteneur de réponses s'il n'existe pas
                const newRepliesContainer = document.createElement('div');
                newRepliesContainer.className = 'comment-replies';
                comment.appendChild(newRepliesContainer);
                
                // Ajouter le formulaire de réponse
                addReplyForm(newRepliesContainer, commentId);
            } else {
                // Basculer l'affichage du formulaire de réponse
                const existingForm = repliesContainer.querySelector('.reply-form');
                if (existingForm) {
                    existingForm.remove();
                } else {
                    addReplyForm(repliesContainer, commentId);
                }
            }
        });
    });
    
    function addReplyForm(container, commentId) {
        const replyForm = document.createElement('div');
        replyForm.className = 'reply-form';
        replyForm.innerHTML = `
            <div class="comment-form-container reply">
                <form class="comment-form">
                    <textarea placeholder="Répondre à ce commentaire..." rows="3"></textarea>
                    <div class="form-actions">
                        <button type="button" class="btn-cancel cancel-reply">Annuler</button>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-paper-plane"></i>
                            Publier la réponse
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        container.appendChild(replyForm);
        
        // Gestion de l'annulation
        replyForm.querySelector('.cancel-reply').addEventListener('click', function() {
            replyForm.remove();
        });
        
        // Gestion de l'envoi de réponse
        replyForm.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            const textarea = this.querySelector('textarea');
            
            if (!textarea.value.trim()) {
                showNotification('Veuillez écrire une réponse', 'error');
                return;
            }
            
            // Simuler l'envoi de la réponse
            const newReply = createCommentElement(
                'Vous',
                'À l\'instant',
                textarea.value.trim(),
                true
            );
            
            // Ajouter la réponse avant le formulaire
            replyForm.parentNode.insertBefore(newReply, replyForm);
            
            // Mettre à jour le compteur de commentaires
            updateCommentCount(1);
            
            // Supprimer le formulaire
            replyForm.remove();
            
            showNotification('Réponse publiée avec succès !');
        });
    }
    
    // Gestion des likes de commentaires
    document.querySelectorAll('.btn-like-comment').forEach(button => {
        button.addEventListener('click', function() {
            const countSpan = this.querySelector('span');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('liked')) {
                // Retirer le like
                this.classList.remove('liked');
                icon.className = 'far fa-thumbs-up';
                countSpan.textContent = parseInt(countSpan.textContent) - 1;
            } else {
                // Ajouter un like
                this.classList.add('liked');
                icon.className = 'fas fa-thumbs-up';
                countSpan.textContent = parseInt(countSpan.textContent) + 1;
            }
        });
    });
    
    // Charger plus de commentaires
    const loadMoreBtn = document.getElementById('loadMoreComments');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
            this.disabled = true;
            
            // Simuler le chargement de nouveaux commentaires
            setTimeout(() => {
                // Ajouter 3 commentaires fictifs
                for (let i = 0; i < 3; i++) {
                    const newComment = createCommentElement(
                        `Utilisateur ${i + 1}`,
                        `Il y a ${i + 1} jour${i > 0 ? 's' : ''}`,
                        `Ceci est un commentaire supplémentaire chargé dynamiquement. Numéro ${i + 1}.`
                    );
                    commentsList.appendChild(newComment);
                }
                
                // Mettre à jour le compteur
                updateCommentCount(3);
                
                // Réinitialiser le bouton
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Charger plus de commentaires';
                this.disabled = false;
                
                showNotification('3 nouveaux commentaires chargés');
            }, 1000);
        });
    }
    
    // Suppression d'article
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
                // Simuler la suppression
                showNotification('Article supprimé avec succès', 'success');
                
                // Rediriger vers l'accueil après un délai
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
        });
    }
    
    // Fonction utilitaire pour créer un élément de commentaire
    function createCommentElement(author, date, content, isReply = false) {
        const commentId = Date.now(); // ID unique basé sur le timestamp
        
        const comment = document.createElement('div');
        comment.className = isReply ? 'comment reply' : 'comment';
        comment.setAttribute('data-id', commentId);
        
        comment.innerHTML = `
            <div class="comment-header">
                <div class="comment-author">
                    <div class="author-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="author-info">
                        <span class="author-name">${author}</span>
                        <span class="comment-date">${date}</span>
                    </div>
                </div>
                <div class="comment-actions">
                    <button class="btn-reply" data-comment-id="${commentId}">
                        <i class="fas fa-reply"></i>
                        Répondre
                    </button>
                </div>
            </div>
            
            <div class="comment-body">
                <p>${content}</p>
            </div>
            
            <div class="comment-footer">
                <button class="btn-like-comment">
                    <i class="far fa-thumbs-up"></i>
                    <span>0</span>
                </button>
            </div>
        `;
        
        // Ajouter les événements au nouveau commentaire
        const replyBtn = comment.querySelector('.btn-reply');
        replyBtn.addEventListener('click', function() {
            const commentId = this.getAttribute('data-comment-id');
            const commentEl = this.closest('.comment');
            let repliesContainer = commentEl.querySelector('.comment-replies');
            
            if (!repliesContainer) {
                repliesContainer = document.createElement('div');
                repliesContainer.className = 'comment-replies';
                commentEl.appendChild(repliesContainer);
            }
            
            addReplyForm(repliesContainer, commentId);
        });
        
        const likeBtn = comment.querySelector('.btn-like-comment');
        likeBtn.addEventListener('click', function() {
            const countSpan = this.querySelector('span');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('liked')) {
                this.classList.remove('liked');
                icon.className = 'far fa-thumbs-up';
                countSpan.textContent = parseInt(countSpan.textContent) - 1;
            } else {
                this.classList.add('liked');
                icon.className = 'fas fa-thumbs-up';
                countSpan.textContent = parseInt(countSpan.textContent) + 1;
            }
        });
        
        return comment;
    }
    
    // Mettre à jour le compteur de commentaires
    function updateCommentCount(additional) {
        const countElement = document.querySelector('.comment-count');
        if (countElement) {
            const currentCount = parseInt(countElement.textContent.replace(/[()]/g, ''));
            countElement.textContent = `(${currentCount + additional})`;
        }
    }
    
    // Afficher une notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Fermeture automatique après 5 secondes
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
        
        // Fermeture au clic
        notification.querySelector('.close-notification').addEventListener('click', () => {
            closeNotification(notification);
        });
    }
    
    function closeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
    
    // Ajouter le CSS pour les notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: white;
            padding: 15px 20px;
            border-radius: var(--radius);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            max-width: 400px;
            border-left: 4px solid var(--primary-color);
        }
        
        .notification-success {
            border-left-color: var(--success-color);
        }
        
        .notification-error {
            border-left-color: var(--danger-color);
        }
        
        .close-notification {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--gray-color);
            line-height: 1;
        }
    `;
    document.head.appendChild(notificationStyles);
});