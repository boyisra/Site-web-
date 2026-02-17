document.addEventListener('DOMContentLoaded', function() {
    // Compteur de caractères pour le message
    const messageInput = document.getElementById('contactMessage');
    const messageCharCount = document.getElementById('messageCharCount');
    
    if (messageInput && messageCharCount) {
        messageInput.addEventListener('input', function() {
            const length = this.value.length;
            messageCharCount.textContent = length;
            
            // Changer la couleur si approche de la limite
            if (length > 1800) {
                messageCharCount.style.color = 'var(--warning-color)';
            } else if (length > 2000) {
                messageCharCount.style.color = 'var(--danger-color)';
                this.value = this.value.substring(0, 2000);
                messageCharCount.textContent = '2000';
            } else {
                messageCharCount.style.color = '';
            }
        });
    }
    
    // Gestion de l'upload de fichier
    const fileInput = document.getElementById('contactAttachment');
    const fileInfo = document.getElementById('fileInfo');
    
    if (fileInput && fileInfo) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Vérifier la taille du fichier (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    showNotification('Le fichier est trop volumineux (max 10MB)', 'error');
                    this.value = '';
                    fileInfo.innerHTML = `
                        <i class="fas fa-cloud-upload-alt"></i>
                        <span>Cliquez pour choisir un fichier</span>
                        <p>Formats acceptés : PDF, DOC, JPG, PNG, GIF (max 10MB)</p>
                    `;
                    return;
                }
                
                // Mettre à jour l'affichage
                const fileSize = (file.size / (1024 * 1024)).toFixed(2);
                fileInfo.innerHTML = `
                    <i class="fas fa-file-alt"></i>
                    <span>${file.name}</span>
                    <p>Taille : ${fileSize} MB</p>
                `;
            }
        });
    }
    
    // CAPTCHA
    const contactCaptchaImage = document.getElementById('contactCaptchaImage');
    const contactCaptchaText = document.getElementById('contactCaptchaText');
    const refreshContactCaptcha = document.getElementById('refreshContactCaptcha');
    const contactCaptchaInput = document.getElementById('contactCaptchaInput');
    const contactCaptchaStatus = document.getElementById('contactCaptchaStatus');
    
    let currentContactCaptcha = '';
    
    // Générer un CAPTCHA
    function generateContactCaptcha() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        currentContactCaptcha = captcha;
        contactCaptchaText.textContent = captcha;
        
        // Appliquer des transformations aléatoires pour rendre le CAPTCHA plus difficile
        const rotations = ['0deg', '5deg', '-5deg', '10deg', '-10deg'];
        const colors = ['#333', '#666', '#999', '#3a86ff', '#8338ec'];
        
        // Créer des caractères individuels avec des styles aléatoires
        contactCaptchaText.innerHTML = '';
        for (let i = 0; i < captcha.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.textContent = captcha[i];
            charSpan.style.display = 'inline-block';
            charSpan.style.transform = `rotate(${rotations[Math.floor(Math.random() * rotations.length)]})`;
            charSpan.style.color = colors[Math.floor(Math.random() * colors.length)];
            charSpan.style.margin = '0 2px';
            contactCaptchaText.appendChild(charSpan);
        }
        
        // Ajouter un bruit de fond
        contactCaptchaImage.style.background = `
            repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(0,0,0,0.05) 10px,
                rgba(0,0,0,0.05) 20px
            )
        `;
        
        // Réinitialiser le champ de saisie
        contactCaptchaInput.value = '';
        contactCaptchaStatus.style.display = 'none';
    }
    
    // Initialiser le CAPTCHA
    generateContactCaptcha();
    
    // Rafraîchir le CAPTCHA
    if (refreshContactCaptcha) {
        refreshContactCaptcha.addEventListener('click', generateContactCaptcha);
    }
    
    // Validation du CAPTCHA en temps réel
    if (contactCaptchaInput) {
        contactCaptchaInput.addEventListener('input', function() {
            validateContactCaptcha();
        });
    }
    
    function validateContactCaptcha() {
        const input = contactCaptchaInput.value.trim().toUpperCase();
        const captcha = currentContactCaptcha.toUpperCase();
        
        if (input.length === 0) {
            contactCaptchaStatus.style.display = 'none';
            return false;
        }
        
        const isValid = input === captcha;
        const message = isValid ? 'CAPTCHA correct' : 'CAPTCHA incorrect';
        
        contactCaptchaStatus.textContent = message;
        contactCaptchaStatus.className = 'validation-status ' + (isValid ? 'valid' : 'invalid');
        
        return isValid;
    }
    
    // Gestion de la FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Fermer tous les autres items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Basculer l'item actuel
            item.classList.toggle('active');
        });
    });
    
    // Validation du formulaire
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Valider tous les champs
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value.trim();
            const isCaptchaValid = validateContactCaptcha();
            
            // Vérifier si tous les champs sont valides
            let isValid = true;
            let errorMsg = '';
            
            if (!name) {
                isValid = false;
                errorMsg = 'Veuillez saisir votre nom';
                document.getElementById('contactName').focus();
            } else if (!email) {
                isValid = false;
                errorMsg = 'Veuillez saisir votre email';
                document.getElementById('contactEmail').focus();
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                isValid = false;
                errorMsg = 'Veuillez saisir une adresse email valide';
                document.getElementById('contactEmail').focus();
            } else if (!subject) {
                isValid = false;
                errorMsg = 'Veuillez sélectionner un sujet';
                document.getElementById('contactSubject').focus();
            } else if (!message) {
                isValid = false;
                errorMsg = 'Veuillez saisir votre message';
                document.getElementById('contactMessage').focus();
            } else if (message.length < 10) {
                isValid = false;
                errorMsg = 'Le message doit contenir au moins 10 caractères';
                document.getElementById('contactMessage').focus();
            } else if (!isCaptchaValid) {
                isValid = false;
                errorMsg = 'Veuillez saisir le CAPTCHA correctement';
                contactCaptchaInput.focus();
            }
            
            if (!isValid) {
                showNotification(errorMsg, 'error');
                return;
            }
            
            // Simuler l'envoi du formulaire
            simulateContactFormSubmission();
        });
    }
    
    // Simulation d'envoi du formulaire
    function simulateContactFormSubmission() {
        const submitBtn = contactForm.querySelector('.btn-contact');
        const originalText = submitBtn.innerHTML;
        
        // Afficher un indicateur de chargement
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simuler une requête serveur
        setTimeout(() => {
            // Simuler une réponse réussie
            showNotification('Message envoyé avec succès ! Nous vous répondrons dans les 24 heures.', 'success');
            
            // Réinitialiser le formulaire
            contactForm.reset();
            
            // Réinitialiser l'affichage du fichier
            if (fileInfo) {
                fileInfo.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <span>Cliquez pour choisir un fichier</span>
                    <p>Formats acceptés : PDF, DOC, JPG, PNG, GIF (max 10MB)</p>
                `;
            }
            
            // Générer un nouveau CAPTCHA
            generateContactCaptcha();
            
            // Réinitialiser le compteur de caractères
            if (messageCharCount) {
                messageCharCount.textContent = '0';
                messageCharCount.style.color = '';
            }
            
            // Réinitialiser le bouton
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    // Simulation de carte interactive
    const mapContainer = document.getElementById('mapContainer');
    
    if (mapContainer) {
        mapContainer.addEventListener('click', function() {
            // Afficher une carte plus détaillée (simulation)
            this.innerHTML = `
                <div class="map-detail">
                    <div class="map-header">
                        <h3>123 Avenue du Code, 75015 Paris</h3>
                        <button class="btn-map-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="map-content">
                        <div class="map-grid">
                            <div class="map-simulation">
                                <div class="street-view">
                                    <div class="building">
                                        <div class="window"></div>
                                        <div class="window"></div>
                                        <div class="window"></div>
                                        <div class="window"></div>
                                    </div>
                                    <div class="sign">BlogInteractif</div>
                                    <div class="car"></div>
                                    <div class="person"></div>
                                    <div class="tree"></div>
                                </div>
                            </div>
                            <div class="map-info">
                                <h4>Comment nous trouver</h4>
                                <ul>
                                    <li><i class="fas fa-subway"></i> Métro : Ligne 12 (Falguière)</li>
                                    <li><i class="fas fa-bus"></i> Bus : 28, 39, 80, 89</li>
                                    <li><i class="fas fa-bicycle"></i> Vélib' : Station 15105</li>
                                    <li><i class="fas fa-car"></i> Parking : Vinci Park Montparnasse</li>
                                </ul>
                                <div class="map-actions">
                                    <button class="btn-map-action">
                                        <i class="fas fa-directions"></i>
                                        Itinéraire
                                    </button>
                                    <button class="btn-map-action">
                                        <i class="fas fa-phone"></i>
                                        Appeler
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Ajouter le CSS pour la carte détaillée
            const mapDetailStyles = document.createElement('style');
            mapDetailStyles.textContent = `
                .map-detail {
                    height: 100%;
                    background-color: white;
                }
                
                .map-header {
                    padding: 20px;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .map-header h3 {
                    margin: 0;
                    color: var(--dark-color);
                    font-size: 1.2rem;
                }
                
                .btn-map-close {
                    background: none;
                    border: none;
                    color: var(--gray-color);
                    cursor: pointer;
                    font-size: 1.2rem;
                }
                
                .map-content {
                    padding: 20px;
                    height: calc(100% - 70px);
                }
                
                .map-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    height: 100%;
                }
                
                @media (max-width: 768px) {
                    .map-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                .map-simulation {
                    background-color: #f0f7ff;
                    border-radius: var(--radius);
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .street-view {
                    width: 300px;
                    height: 200px;
                    background: linear-gradient(180deg, #87CEEB 0%, #E0F7FF 100%);
                    border-radius: 10px;
                    position: relative;
                    overflow: hidden;
                }
                
                .building {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 150px;
                    height: 120px;
                    background-color: #e0e0e0;
                    border-radius: 5px 5px 0 0;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    grid-template-rows: repeat(2, 1fr);
                    gap: 10px;
                    padding: 15px;
                }
                
                .window {
                    background-color: #87CEEB;
                    border-radius: 3px;
                }
                
                .sign {
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-weight: bold;
                    color: var(--primary-color);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .car {
                    position: absolute;
                    bottom: 20px;
                    left: 50px;
                    width: 40px;
                    height: 20px;
                    background-color: #ff006e;
                    border-radius: 5px;
                }
                
                .car::before {
                    content: '';
                    position: absolute;
                    top: -5px;
                    left: 5px;
                    width: 30px;
                    height: 10px;
                    background-color: #ff006e;
                    border-radius: 3px 3px 0 0;
                }
                
                .person {
                    position: absolute;
                    bottom: 20px;
                    right: 50px;
                    width: 10px;
                    height: 25px;
                    background-color: #333;
                }
                
                .person::before {
                    content: '';
                    position: absolute;
                    top: -8px;
                    left: -2px;
                    width: 14px;
                    height: 14px;
                    background-color: #333;
                    border-radius: 50%;
                }
                
                .tree {
                    position: absolute;
                    bottom: 20px;
                    right: 100px;
                    width: 15px;
                    height: 40px;
                    background-color: #2e8b57;
                    border-radius: 3px;
                }
                
                .tree::before {
                    content: '';
                    position: absolute;
                    top: -20px;
                    left: -15px;
                    width: 45px;
                    height: 25px;
                    background-color: #2e8b57;
                    border-radius: 50%;
                }
                
                .map-info {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .map-info h4 {
                    margin: 0 0 15px 0;
                    color: var(--dark-color);
                    font-size: 1.3rem;
                }
                
                .map-info ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .map-info li {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                    color: var(--gray-color);
                }
                
                .map-info li i {
                    color: var(--primary-color);
                    width: 20px;
                }
                
                .map-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: auto;
                }
                
                .btn-map-action {
                    flex: 1;
                    padding: 12px;
                    background-color: var(--primary-color);
                    border: none;
                    border-radius: var(--radius);
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: var(--transition);
                }
                
                .btn-map-action:hover {
                    background-color: #2a75ff;
                }
            `;
            document.head.appendChild(mapDetailStyles);
            
            // Bouton pour fermer la carte détaillée
            const closeBtn = document.querySelector('.btn-map-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    mapContainer.innerHTML = `
                        <div class="map-placeholder">
                            <i class="fas fa-map-marked-alt"></i>
                            <h3>Carte interactive</h3>
                            <p>123 Avenue du Code, 75015 Paris, France</p>
                            <div class="map-coordinates">
                                <span>Latitude : 48.8566</span>
                                <span>Longitude : 2.3522</span>
                            </div>
                        </div>
                    `;
                    
                    // Réattacher l'événement click
                    mapContainer.addEventListener('click', arguments.callee);
                });
            }
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
        
        .notification-info {
            border-left-color: var(--primary-color);
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