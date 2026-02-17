document.addEventListener('DOMContentLoaded', function() {
    // Compteur de caractères pour le titre
    const titleInput = document.getElementById('articleTitle');
    const titleCharCount = document.getElementById('titleCharCount');
    
    if (titleInput && titleCharCount) {
        titleInput.addEventListener('input', function() {
            const length = this.value.length;
            titleCharCount.textContent = length;
            
            // Changer la couleur si approche de la limite
            if (length > 90) {
                titleCharCount.style.color = 'var(--warning-color)';
            } else if (length > 100) {
                titleCharCount.style.color = 'var(--danger-color)';
            } else {
                titleCharCount.style.color = '';
            }
        });
        
        // Initialiser le compteur
        titleCharCount.textContent = titleInput.value.length;
    }
    
    // Gestion de l'upload d'image
    const imageInput = document.getElementById('articleImage');
    const imagePreview = document.getElementById('imagePreview');
    const chooseImageBtn = document.getElementById('chooseImageBtn');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    if (chooseImageBtn) {
        chooseImageBtn.addEventListener('click', function() {
            imageInput.click();
        });
    }
    
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Vérifier la taille du fichier (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('Le fichier est trop volumineux (max 5MB)', 'error');
                    this.value = '';
                    return;
                }
                
                // Vérifier le type de fichier
                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    showNotification('Type de fichier non supporté', 'error');
                    this.value = '';
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `
                        <img src="${e.target.result}" alt="Aperçu de l'image">
                    `;
                    removeImageBtn.style.display = 'inline-flex';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', function() {
            imagePreview.innerHTML = `
                <div class="image-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Aucune image sélectionnée</p>
                    <span>Cliquez pour choisir une image</span>
                </div>
            `;
            imageInput.value = '';
            this.style.display = 'none';
        });
    }
    
    // Éditeur de texte riche
    const editorContent = document.getElementById('articleContent');
    const contentHidden = document.getElementById('contentHidden');
    const editorButtons = document.querySelectorAll('.editor-btn');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const readingTime = document.getElementById('readingTime');
    
    // Gestion des boutons de l'éditeur
    editorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            const value = this.getAttribute('data-value');
            
            document.execCommand(command, false, value || null);
            
            // Mettre le focus sur l'éditeur
            editorContent.focus();
            
            // Mettre à jour le contenu caché
            updateHiddenContent();
        });
    });
    
    // Gestion des liens
    document.querySelector('[data-command="createLink"]').addEventListener('click', function() {
        const url = prompt('Entrez l\'URL du lien:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
        editorContent.focus();
        updateHiddenContent();
    });
    
    // Gestion des images
    document.querySelector('[data-command="insertImage"]').addEventListener('click', function() {
        const url = prompt('Entrez l\'URL de l\'image:');
        if (url) {
            document.execCommand('insertImage', false, url);
        }
        editorContent.focus();
        updateHiddenContent();
    });
    
    // Mettre à jour les statistiques
    function updateEditorStats() {
        if (!editorContent) return;
        
        const text = editorContent.innerText;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const characters = text.length;
        
        // Mettre à jour les compteurs
        if (wordCount) wordCount.textContent = words.length;
        if (charCount) charCount.textContent = characters;
        
        // Calculer le temps de lecture (moyenne de 200 mots/minute)
        const readingTimeMinutes = Math.ceil(words.length / 200);
        if (readingTime) readingTime.textContent = readingTimeMinutes;
        
        // Mettre à jour le contenu caché
        updateHiddenContent();
    }
    
    // Mettre à jour le contenu caché
    function updateHiddenContent() {
        if (editorContent && contentHidden) {
            contentHidden.value = editorContent.innerHTML;
        }
    }
    
    // Événements pour l'éditeur
    if (editorContent) {
        editorContent.addEventListener('input', updateEditorStats);
        editorContent.addEventListener('paste', function(e) {
            // Attendre que le collage soit terminé
            setTimeout(updateEditorStats, 10);
        });
        editorContent.addEventListener('keyup', updateEditorStats);
        
        // Initialiser les statistiques
        updateEditorStats();
    }
    
    // Gestion des mots-clés
    const tagsInput = document.getElementById('articleTags');
    const addTagBtn = document.getElementById('addTagBtn');
    const tagsList = document.getElementById('tagsList');
    const tagsHidden = document.getElementById('tagsHidden');
    
    let tags = [];
    
    // Charger les tags existants
    if (tagsHidden.value) {
        tags = tagsHidden.value.split(',').filter(tag => tag.trim() !== '');
        renderTags();
    }
    
    function renderTags() {
        tagsList.innerHTML = '';
        tags.forEach((tag, index) => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-item';
            tagElement.innerHTML = `
                <span>${tag}</span>
                <button type="button" class="remove-tag" data-index="${index}">&times;</button>
            `;
            tagsList.appendChild(tagElement);
        });
        
        // Mettre à jour le champ caché
        tagsHidden.value = tags.join(',');
    }
    
    // Ajouter un tag
    if (addTagBtn) {
        addTagBtn.addEventListener('click', function() {
            addTag();
        });
    }
    
    if (tagsInput) {
        tagsInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
            }
        });
    }
    
    function addTag() {
        const tagValue = tagsInput.value.trim();
        
        if (tagValue && !tags.includes(tagValue)) {
            tags.push(tagValue);
            renderTags();
            tagsInput.value = '';
        } else if (tags.includes(tagValue)) {
            showNotification('Ce mot-clé existe déjà', 'error');
        }
    }
    
    // Supprimer un tag
    tagsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-tag')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            tags.splice(index, 1);
            renderTags();
        }
    });
    
    // Gestion de l'aperçu
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const closePreview = document.getElementById('closePreview');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const editPreviewBtn = document.getElementById('editPreviewBtn');
    const previewContent = document.getElementById('previewContent');
    
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            // Générer l'aperçu
            generatePreview();
            
            // Afficher la modal
            previewModal.classList.add('show');
        });
    }
    
    function generatePreview() {
        const title = titleInput ? titleInput.value : 'Sans titre';
        const content = editorContent ? editorContent.innerHTML : '';
        const categories = Array.from(document.querySelectorAll('input[name="categories"]:checked'))
            .map(cb => cb.nextElementSibling.textContent)
            .join(', ');
        
        previewContent.innerHTML = `
            <article class="article-preview">
                <header class="preview-header">
                    <h1>${title}</h1>
                    <div class="preview-meta">
                        <div class="preview-author">
                            <i class="fas fa-user"></i>
                            <span>${user.username || 'Vous'}</span>
                        </div>
                        <div class="preview-date">
                            <i class="far fa-calendar"></i>
                            <span>${new Date().toLocaleDateString('fr-FR')}</span>
                        </div>
                    </div>
                    ${categories ? `<div class="preview-categories">Catégories : ${categories}</div>` : ''}
                    ${tags.length ? `<div class="preview-tags">Mots-clés : ${tags.join(', ')}</div>` : ''}
                </header>
                
                <div class="preview-image">
                    ${imagePreview.querySelector('img') ? 
                        `<img src="${imagePreview.querySelector('img').src}" alt="Aperçu">` : 
                        '<div class="no-image">Aucune image sélectionnée</div>'
                    }
                </div>
                
                <div class="preview-body">
                    ${content || '<p><em>Le contenu de l\'article apparaîtra ici...</em></p>'}
                </div>
                
                <div class="preview-stats">
                    <div class="stat">
                        <i class="fas fa-font"></i>
                        Mots : ${wordCount.textContent}
                    </div>
                    <div class="stat">
                        <i class="far fa-clock"></i>
                        Temps de lecture : ${readingTime.textContent} min
                    </div>
                </div>
            </article>
        `;
    }
    
    // Fermer la modal d'aperçu
    if (closePreview) {
        closePreview.addEventListener('click', closePreviewModal);
    }
    
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', closePreviewModal);
    }
    
    if (editPreviewBtn) {
        editPreviewBtn.addEventListener('click', closePreviewModal);
    }
    
    function closePreviewModal() {
        previewModal.classList.remove('show');
    }
    
    // Fermer la modal en cliquant à l'extérieur
    previewModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closePreviewModal();
        }
    });
    
    // Soumission du formulaire
    const articleForm = document.getElementById('articleForm');
    
    if (articleForm) {
        articleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation
            const title = titleInput ? titleInput.value.trim() : '';
            const content = editorContent ? editorContent.innerHTML.trim() : '';
            
            if (!title) {
                showNotification('Veuillez saisir un titre', 'error');
                titleInput.focus();
                return;
            }
            
            if (!content || content === '<br>') {
                showNotification('Veuillez saisir le contenu de l\'article', 'error');
                editorContent.focus();
                return;
            }
            
            // Afficher un message de soumission
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publication...';
            submitBtn.disabled = true;
            
            // Simuler l'envoi au serveur
            setTimeout(() => {
                showNotification('Article publié avec succès !', 'success');
                
                // Rediriger vers la page de l'article
                setTimeout(() => {
                    window.location.href = '/article/1/'; // URL factice pour la démo
                }, 1500);
            }, 2000);
        });
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