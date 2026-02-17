document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const searchForm = document.getElementById('searchForm');
    const mainSearchInput = document.getElementById('mainSearchInput');
    const searchType = document.getElementById('searchType');
    const sortBy = document.getElementById('sortBy');
    const timeRange = document.getElementById('timeRange');
    const viewOptions = document.querySelectorAll('.view-option');
    const resultsContainer = document.querySelector('.results-container');
    const activeFilters = document.querySelector('.active-filters');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const removeFilterBtns = document.querySelectorAll('.remove-filter');
    const resultsPerPage = document.getElementById('resultsPerPage');
    const paginationBtns = document.querySelectorAll('.pagination-btn:not(.disabled)');
    const pageNumbers = document.querySelectorAll('.page-number:not(.active)');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    const relatedTags = document.querySelectorAll('.related-tag');
    
    // Simulation de données de recherche
    const searchData = {
        query: 'django',
        results: 235,
        time: '0.45s'
    };
    
    // Mettre à jour le compteur de résultats
    function updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${searchData.results} résultats trouvés pour "${searchData.query}" (${searchData.time}s)`;
        }
    }
    
    // Initialiser le compteur
    updateResultsCount();
    
    // Soumission du formulaire de recherche
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const query = mainSearchInput.value.trim();
            if (!query) {
                showNotification('Veuillez saisir un terme de recherche', 'error');
                mainSearchInput.focus();
                return;
            }
            
            // Mettre à jour les données de recherche
            searchData.query = query;
            searchData.time = (Math.random() * 0.5 + 0.3).toFixed(2);
            
            // Simuler une nouvelle recherche
            simulateSearch();
        });
    }
    
    // Simulation d'une recherche
    function simulateSearch() {
        const submitBtn = searchForm.querySelector('.btn-search');
        const originalText = submitBtn.innerHTML;
        
        // Afficher un indicateur de chargement
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recherche...';
        submitBtn.disabled = true;
        
        // Mettre à jour le texte de recherche dans les résultats
        document.querySelectorAll('.highlight').forEach(el => {
            el.textContent = searchData.query;
        });
        
        // Simuler un délai de recherche
        setTimeout(() => {
            // Mettre à jour le compteur
            updateResultsCount();
            
            // Simuler des résultats aléatoires
            const randomResults = Math.floor(Math.random() * 100) + 200;
            searchData.results = randomResults;
            
            // Mettre à jour l'affichage
            document.querySelector('.pagination-info span').textContent = 
                `Affichage de 1 à 10 sur ${randomResults} résultats`;
            
            // Réinitialiser le bouton
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Afficher une notification
            showNotification(`${randomResults} résultats trouvés pour "${searchData.query}"`);
        }, 800);
    }
    
    // Changer la vue (liste/grille)
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Mettre à jour les boutons actifs
            viewOptions.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Changer la classe du conteneur
            resultsContainer.className = `results-container ${view}-view`;
        });
    });
    
    // Gestion des filtres actifs
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Réinitialiser tous les sélecteurs
            searchType.value = 'all';
            sortBy.value = 'relevance';
            timeRange.value = 'all';
            
            // Cacher les filtres actifs
            activeFilters.style.display = 'none';
            
            // Simuler une nouvelle recherche
            simulateSearch();
        });
    }
    
    // Supprimer un filtre individuel
    removeFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterItem = this.closest('.filter-item');
            filterItem.remove();
            
            // Si plus de filtres, cacher la section
            const remainingFilters = document.querySelectorAll('.filter-item');
            if (remainingFilters.length === 0) {
                activeFilters.style.display = 'none';
            }
            
            // Simuler une nouvelle recherche
            simulateSearch();
        });
    });
    
    // Mettre à jour les filtres actifs lorsque les sélecteurs changent
    [searchType, sortBy, timeRange].forEach(select => {
        select.addEventListener('change', function() {
            updateActiveFilters();
            simulateSearch();
        });
    });
    
    function updateActiveFilters() {
        // Réinitialiser les filtres actifs
        const filtersList = document.querySelector('.filters-list');
        const filterItems = filtersList.querySelectorAll('.filter-item');
        filterItems.forEach(item => item.remove());
        
        // Ajouter les nouveaux filtres
        if (searchType.value !== 'all') {
            const typeText = getFilterText('searchType', searchType.value);
            addActiveFilter(typeText);
        }
        
        if (timeRange.value !== 'all') {
            const timeText = getFilterText('timeRange', timeRange.value);
            addActiveFilter(timeText);
        }
        
        // Afficher/masquer la section
        const hasFilters = filtersList.querySelectorAll('.filter-item').length > 0;
        activeFilters.style.display = hasFilters ? 'block' : 'none';
    }
    
    function getFilterText(filterId, value) {
        const texts = {
            'searchType': {
                'articles': 'Articles seulement',
                'comments': 'Commentaires seulement',
                'users': 'Utilisateurs seulement',
                'tags': 'Mots-clés seulement'
            },
            'timeRange': {
                'day': 'Dernier jour',
                'week': 'Dernière semaine',
                'month': 'Dernier mois',
                'year': 'Dernière année'
            }
        };
        
        return texts[filterId] ? texts[filterId][value] : value;
    }
    
    function addActiveFilter(text) {
        const filtersList = document.querySelector('.filters-list');
        const filterItem = document.createElement('div');
        filterItem.className = 'filter-item';
        filterItem.innerHTML = `
            <span>${text}</span>
            <button class="remove-filter">&times;</button>
        `;
        
        // Ajouter avant le bouton "Effacer tous les filtres"
        const clearBtn = filtersList.querySelector('.clear-filters');
        filtersList.insertBefore(filterItem, clearBtn);
        
        // Ajouter l'événement au nouveau bouton
        filterItem.querySelector('.remove-filter').addEventListener('click', function() {
            filterItem.remove();
            
            const remainingFilters = document.querySelectorAll('.filter-item');
            if (remainingFilters.length === 0) {
                activeFilters.style.display = 'none';
            }
            
            simulateSearch();
        });
    }
    
    // Changer le nombre de résultats par page
    if (resultsPerPage) {
        resultsPerPage.addEventListener('change', function() {
            const perPage = this.value;
            simulateSearch();
            showNotification(`Affichage de ${perPage} résultats par page`);
        });
    }
    
    // Pagination
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const isNext = this.textContent.includes('Suivant');
            
            // Simuler le changement de page
            simulatePageChange(isNext);
        });
    });
    
    pageNumbers.forEach(number => {
        number.addEventListener('click', function() {
            const page = this.textContent;
            
            // Mettre à jour les boutons actifs
            document.querySelectorAll('.page-number').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            // Simuler le chargement de la page
            simulatePageLoad(parseInt(page));
        });
    });
    
    function simulatePageChange(isNext) {
        const currentPage = document.querySelector('.page-number.active');
        const currentPageNum = parseInt(currentPage.textContent);
        const newPageNum = isNext ? currentPageNum + 1 : currentPageNum - 1;
        
        // Trouver le bouton de la nouvelle page
        const newPageBtn = Array.from(document.querySelectorAll('.page-number'))
            .find(btn => parseInt(btn.textContent) === newPageNum);
        
        if (newPageBtn) {
            // Mettre à jour les boutons actifs
            document.querySelectorAll('.page-number').forEach(n => n.classList.remove('active'));
            newPageBtn.classList.add('active');
            
            // Simuler le chargement
            simulatePageLoad(newPageNum);
        }
    }
    
    function simulatePageLoad(pageNum) {
        const start = (pageNum - 1) * parseInt(resultsPerPage.value) + 1;
        const end = Math.min(start + parseInt(resultsPerPage.value) - 1, searchData.results);
        
        // Mettre à jour l'info de pagination
        document.querySelector('.pagination-info span').textContent = 
            `Affichage de ${start} à ${end} sur ${searchData.results} résultats`;
        
        // Simuler un léger délai de chargement
        showNotification(`Chargement de la page ${pageNum}...`, 'info');
        
        setTimeout(() => {
            showNotification(`Page ${pageNum} chargée`);
        }, 500);
    }
    
    // Suggestions de recherche
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const query = this.textContent;
            mainSearchInput.value = query;
            searchForm.requestSubmit();
        });
    });
    
    // Recherches similaires
    relatedTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const query = this.textContent;
            mainSearchInput.value = query;
            searchForm.requestSubmit();
        });
    });
    
    // Mettre en évidence le texte recherché dans les résultats
    function highlightSearchText() {
        const query = searchData.query.toLowerCase();
        if (!query) return;
        
        const textNodes = getTextNodes(resultsContainer);
        
        textNodes.forEach(node => {
            const text = node.textContent;
            const regex = new RegExp(`(${query})`, 'gi');
            const newText = text.replace(regex, '<span class="highlight">$1</span>');
            
            if (newText !== text) {
                const span = document.createElement('span');
                span.innerHTML = newText;
                node.parentNode.replaceChild(span, node);
            }
        });
    }
    
    function getTextNodes(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim().length > 0) {
                textNodes.push(node);
            }
        }
        
        return textNodes;
    }
    
    // Recherche en temps réel (simulation)
    let searchTimeout;
    if (mainSearchInput) {
        mainSearchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            // Ne faire la recherche que si assez de caractères
            if (this.value.length >= 3) {
                searchTimeout = setTimeout(() => {
                    // Simuler des suggestions en temps réel
                    if (this.value.length > 0) {
                        simulateLiveSearch(this.value);
                    }
                }, 300);
            }
        });
    }
    
    function simulateLiveSearch(query) {
        // Dans une vraie application, vous feriez une requête AJAX ici
        console.log('Recherche en temps réel pour:', query);
    }
    
    // Initialiser les filtres actifs
    updateActiveFilters();
    
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