document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');
    const registerErrorMessage = document.getElementById('registerErrorMessage');
    
    // Éléments du formulaire
    const usernameInput = document.getElementById('registerUsername');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const passwordConfirmInput = document.getElementById('registerPasswordConfirm');
    const acceptTerms = document.getElementById('acceptTerms');
    const captchaInput = document.getElementById('captchaInput');
    
    // Boutons pour basculer la visibilité des mots de passe
    const togglePassword1 = document.getElementById('togglePassword1');
    const togglePassword2 = document.getElementById('togglePassword2');
    
    // Éléments de validation
    const usernameStatus = document.getElementById('usernameStatus');
    const emailStatus = document.getElementById('emailStatus');
    const passwordMatchStatus = document.getElementById('passwordMatchStatus');
    const captchaStatus = document.getElementById('captchaStatus');
    
    // Force du mot de passe
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    // Exigences du mot de passe
    const reqLength = document.getElementById('reqLength');
    const reqLowercase = document.getElementById('reqLowercase');
    const reqUppercase = document.getElementById('reqUppercase');
    const reqNumber = document.getElementById('reqNumber');
    const reqSpecial = document.getElementById('reqSpecial');
    
    // CAPTCHA
    const captchaImage = document.getElementById('captchaImage');
    const captchaText = document.getElementById('captchaText');
    const refreshCaptcha = document.getElementById('refreshCaptcha');
    
    let currentCaptcha = '';
    
    // Initialisation
    generateCaptcha();
    
    // Basculer la visibilité des mots de passe
    if (togglePassword1 && passwordInput) {
        togglePassword1.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }
    
    if (togglePassword2 && passwordConfirmInput) {
        togglePassword2.addEventListener('click', function() {
            const type = passwordConfirmInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordConfirmInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }
    
    // Validation en temps réel du nom d'utilisateur
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            validateUsername();
        });
        
        usernameInput.addEventListener('blur', function() {
            validateUsername(true);
        });
    }
    
    function validateUsername(checkAvailability = false) {
        const username = usernameInput.value.trim();
        let isValid = true;
        let message = '';
        
        // Validation basique
        if (username.length < 3) {
            isValid = false;
            message = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
        } else if (username.length > 20) {
            isValid = false;
            message = 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères';
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            isValid = false;
            message = 'Seules les lettres, chiffres et underscores sont autorisés';
        } else if (checkAvailability) {
            // Simuler la vérification de disponibilité
            const takenUsernames = ['admin', 'test', 'demo', 'user', 'moderator'];
            if (takenUsernames.includes(username.toLowerCase())) {
                isValid = false;
                message = 'Ce nom d\'utilisateur est déjà pris';
            }
        }
        
        // Mettre à jour l'affichage
        updateValidationStatus(usernameStatus, isValid, message);
        
        return isValid;
    }
    
    // Validation en temps réel de l'email
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmail();
        });
        
        emailInput.addEventListener('blur', function() {
            validateEmail(true);
        });
    }
    
    function validateEmail(checkAvailability = false) {
        const email = emailInput.value.trim();
        let isValid = true;
        let message = '';
        
        // Validation basique
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            isValid = false;
            message = 'Veuillez saisir une adresse email valide';
        } else if (checkAvailability) {
            // Simuler la vérification de disponibilité
            const takenEmails = ['test@example.com', 'admin@example.com'];
            if (takenEmails.includes(email.toLowerCase())) {
                isValid = false;
                message = 'Cette adresse email est déjà utilisée';
            }
        }
        
        // Mettre à jour l'affichage
        updateValidationStatus(emailStatus, isValid, message);
        
        return isValid;
    }
    
    // Analyse de la force du mot de passe
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword();
            checkPasswordMatch();
        });
    }
    
    function validatePassword() {
        const password = passwordInput.value;
        
        // Réinitialiser toutes les exigences
        resetRequirements();
        
        if (password.length === 0) {
            strengthFill.style.width = '0%';
            strengthFill.style.backgroundColor = '';
            strengthText.textContent = 'Force du mot de passe : Faible';
            return false;
        }
        
        let strength = 0;
        let requirementsMet = 0;
        
        // Longueur (minimum 8 caractères)
        const hasLength = password.length >= 8;
        updateRequirement(reqLength, hasLength);
        if (hasLength) {
            strength += 20;
            requirementsMet++;
        }
        
        // Lettre minuscule
        const hasLowercase = /[a-z]/.test(password);
        updateRequirement(reqLowercase, hasLowercase);
        if (hasLowercase) {
            strength += 20;
            requirementsMet++;
        }
        
        // Lettre majuscule
        const hasUppercase = /[A-Z]/.test(password);
        updateRequirement(reqUppercase, hasUppercase);
        if (hasUppercase) {
            strength += 20;
            requirementsMet++;
        }
        
        // Chiffre
        const hasNumber = /\d/.test(password);
        updateRequirement(reqNumber, hasNumber);
        if (hasNumber) {
            strength += 20;
            requirementsMet++;
        }
        
        // Caractère spécial
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        updateRequirement(reqSpecial, hasSpecial);
        if (hasSpecial) {
            strength += 20;
            requirementsMet++;
        }
        
        // Déterminer la couleur et le texte
        let strengthColor = '';
        let text = '';
        
        if (strength < 40) {
            strengthColor = 'var(--danger-color)';
            text = 'Faible';
        } else if (strength < 80) {
            strengthColor = 'var(--warning-color)';
            text = 'Moyen';
        } else {
            strengthColor = 'var(--success-color)';
            text = 'Fort';
        }
        
        // Mettre à jour l'affichage
        strengthFill.style.width = strength + '%';
        strengthFill.style.backgroundColor = strengthColor;
        strengthText.textContent = `Force du mot de passe : ${text}`;
        
        return requirementsMet >= 4; // Au moins 4 exigences sur 5
    }
    
    function resetRequirements() {
        [reqLength, reqLowercase, reqUppercase, reqNumber, reqSpecial].forEach(req => {
            req.classList.remove('valid');
            const icon = req.querySelector('i');
            icon.className = 'far fa-circle';
        });
    }
    
    function updateRequirement(element, isValid) {
        if (isValid) {
            element.classList.add('valid');
            const icon = element.querySelector('i');
            icon.className = 'fas fa-check-circle';
        }
    }
    
    // Vérification de la correspondance des mots de passe
    if (passwordConfirmInput) {
        passwordConfirmInput.addEventListener('input', checkPasswordMatch);
    }
    
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirm = passwordConfirmInput.value;
        
        if (confirm.length === 0) {
            passwordMatchStatus.style.display = 'none';
            return false;
        }
        
        const isValid = password === confirm;
        const message = isValid ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas';
        
        updateValidationStatus(passwordMatchStatus, isValid, message);
        
        return isValid;
    }
    
    // Générer un nouveau CAPTCHA
    if (refreshCaptcha) {
        refreshCaptcha.addEventListener('click', generateCaptcha);
    }
    
    function generateCaptcha() {
        // Générer une chaîne aléatoire de 6 caractères
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        currentCaptcha = captcha;
        captchaText.textContent = captcha;
        
        // Réinitialiser le champ de saisie
        captchaInput.value = '';
        captchaStatus.style.display = 'none';
    }
    
    // Validation du CAPTCHA
    if (captchaInput) {
        captchaInput.addEventListener('input', function() {
            validateCaptcha();
        });
    }
    
    function validateCaptcha() {
        const input = captchaInput.value.trim().toUpperCase();
        const captcha = currentCaptcha.toUpperCase();
        
        if (input.length === 0) {
            captchaStatus.style.display = 'none';
            return false;
        }
        
        const isValid = input === captcha;
        const message = isValid ? 'CAPTCHA correct' : 'CAPTCHA incorrect';
        
        updateValidationStatus(captchaStatus, isValid, message);
        
        return isValid;
    }
    
    // Fonction utilitaire pour mettre à jour l'état de validation
    function updateValidationStatus(element, isValid, message) {
        element.textContent = message;
        element.className = 'validation-status ' + (isValid ? 'valid' : 'invalid');
    }
    
    // Validation du formulaire
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Réinitialiser les erreurs
            hideError();
            
            // Valider tous les champs
            const isUsernameValid = validateUsername(true);
            const isEmailValid = validateEmail(true);
            const isPasswordValid = validatePassword();
            const isPasswordMatch = checkPasswordMatch();
            const isCaptchaValid = validateCaptcha();
            const isTermsAccepted = acceptTerms.checked;
            
            // Vérifier si tous les champs sont valides
            let isValid = true;
            let errorMsg = '';
            
            if (!isUsernameValid) {
                isValid = false;
                errorMsg = 'Veuillez corriger le nom d\'utilisateur';
                usernameInput.focus();
            } else if (!isEmailValid) {
                isValid = false;
                errorMsg = 'Veuillez corriger l\'adresse email';
                emailInput.focus();
            } else if (!isPasswordValid) {
                isValid = false;
                errorMsg = 'Le mot de passe ne remplit pas toutes les exigences';
                passwordInput.focus();
            } else if (!isPasswordMatch) {
                isValid = false;
                errorMsg = 'Les mots de passe ne correspondent pas';
                passwordConfirmInput.focus();
            } else if (!isCaptchaValid) {
                isValid = false;
                errorMsg = 'CAPTCHA incorrect';
                captchaInput.focus();
                generateCaptcha(); // Générer un nouveau CAPTCHA
            } else if (!isTermsAccepted) {
                isValid = false;
                errorMsg = 'Vous devez accepter les conditions d\'utilisation';
                acceptTerms.focus();
            }
            
            if (!isValid) {
                showError(errorMsg);
                return;
            }
            
            // Simuler l'inscription
            simulateRegistration();
        });
    }
    
    // Fonction pour simuler l'inscription
    function simulateRegistration() {
        const submitBtn = registerForm.querySelector('.btn-register');
        const originalText = submitBtn.innerHTML;
        
        // Afficher un indicateur de chargement
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création du compte...';
        submitBtn.disabled = true;
        
        // Simuler une requête serveur
        setTimeout(() => {
            // Simuler une réponse réussie
            showNotification('Compte créé avec succès ! Redirection...', 'success');
            
            // Rediriger vers la page de connexion
            setTimeout(() => {
                window.location.href = '/login/';
            }, 2000);
        }, 3000);
    }
    
    // Afficher une erreur
    function showError(message) {
        registerErrorMessage.textContent = message;
        registerError.style.display = 'flex';
        
        // Fermer automatiquement après 5 secondes
        setTimeout(hideError, 5000);
    }
    
    // Cacher l'erreur
    function hideError() {
        registerError.style.display = 'none';
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