// VIEWS - All DOM manipulation and rendering functions
// This module contains all view functions that generate and manipulate the DOM safely

// Constants
const GENRE_MAP = {
    28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia',
    80: 'Crimen', 99: 'Documental', 18: 'Drama', 10751: 'Familiar',
    14: 'Fantasía', 36: 'Historia', 27: 'Terror', 10402: 'Música',
    9648: 'Misterio', 10749: 'Romance', 878: 'Ciencia ficción',
    10770: 'Película de TV', 53: 'Suspense', 10752: 'Bélica', 37: 'Western'
};

// Helper function to create badge element
const createBadge = (type, iconClass, text) => {
    const badge = document.createElement('span');
    badge.className = `info-badge badge-${type}`;
    
    if (iconClass) {
        const icon = document.createElement('i');
        icon.className = iconClass;
        badge.appendChild(icon);
        badge.appendChild(document.createTextNode(' '));
    }
    
    badge.appendChild(document.createTextNode(text));
    return badge;
};

// Helper function to clear and get main element
const getMainElement = () => {
    const main = document.getElementById('main');
    main.innerHTML = '';
    return main;
};

// INDEX VIEW - Shows list of movies using template
export const indexView = (peliculas) => {
    const fragment = document.createDocumentFragment();
    
    if (peliculas.length === 0) {
        const emptyTemplate = document.getElementById('empty-collection-template');
        const emptyMessage = emptyTemplate.content.cloneNode(true);
        fragment.appendChild(emptyMessage);
    } else {
        const movieTemplate = document.getElementById('movie-card-template');
        
        peliculas.forEach((pelicula, index) => {
            const movieCard = movieTemplate.content.cloneNode(true);
            
            // Get references to elements
            const img = movieCard.querySelector('img');
            const title = movieCard.querySelector('.title');
            const movieInfo = movieCard.querySelector('.movie-info');
            const showBtn = movieCard.querySelector('.show');
            const editBtn = movieCard.querySelector('.edit');
            const deleteBtn = movieCard.querySelector('.delete');
            
            // Set image
            img.src = pelicula.miniatura;
            img.alt = pelicula.titulo || 'Sin título';
            img.onerror = function() { this.src = 'files/placeholder.png'; };
            
            // Set title safely
            if (pelicula.titulo) {
                title.textContent = pelicula.titulo;
            } else {
                const em = document.createElement('em');
                em.textContent = 'Sin título';
                title.appendChild(em);
            }
            
            // Add rating badge if exists
            if (pelicula.rating) {
                const badge = createBadge('rating', 'fas fa-star', pelicula.rating.toFixed(1));
                movieInfo.appendChild(badge);
            }
            
            // Add year badge if exists
            if (pelicula.año) {
                const badge = createBadge('year', 'fas fa-calendar', pelicula.año);
                movieInfo.appendChild(badge);
            }
            
            // Add genre badge if exists
            if (pelicula.generos && pelicula.generos.length > 0) {
                const badge = createBadge('genre', null, pelicula.generos[0]);
                movieInfo.appendChild(badge);
            }
            
            // Set button data attributes
            showBtn.dataset.myId = index;
            editBtn.dataset.myId = index;
            deleteBtn.dataset.myId = index;
            
            fragment.appendChild(movieCard);
        });
    }
    
    return fragment;
};

// EDIT VIEW - Shows edit modal using template
export const editView = (i, pelicula) => {
    const template = document.getElementById('edit-modal-template');
    const modal = template.content.cloneNode(true);
    
    // Set input values
    modal.querySelector('#titulo').value = pelicula.titulo || '';
    modal.querySelector('#director').value = pelicula.director || '';
    modal.querySelector('#año').value = pelicula.año || '';
    modal.querySelector('#miniatura').value = pelicula.miniatura || '';
    
    // Set update button data attribute
    modal.querySelector('.update').dataset.myId = i;
    
    return modal;
};

// NEW VIEW - Shows create modal using template
export const newView = () => {
    const template = document.getElementById('new-modal-template');
    return template.content.cloneNode(true);
};

// SEARCH VIEW - Shows search modal using template
export const searchView = () => {
    const template = document.getElementById('search-modal-template');
    return template.content.cloneNode(true);
};

// SEARCH VIEW WITH ERROR - Shows search modal with error message
export const searchViewWithError = (errorMessage, previousQuery = '') => {
    const template = document.getElementById('search-modal-template');
    const modal = template.content.cloneNode(true);
    
    // Show error message
    const errorDiv = modal.querySelector('.error-message');
    errorDiv.style.display = 'block';
    errorDiv.style.background = '#fee';
    errorDiv.style.border = '2px solid #fcc';
    errorDiv.style.padding = '12px';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.marginBottom = '16px';
    errorDiv.style.textAlign = 'center';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-triangle';
    icon.style.color = '#d00';
    icon.style.marginRight = '8px';
    
    const span = document.createElement('span');
    span.style.color = '#d00';
    span.style.fontWeight = '600';
    span.textContent = errorMessage;
    
    errorDiv.appendChild(icon);
    errorDiv.appendChild(span);
    
    // Set previous query
    modal.querySelector('#search-query').value = previousQuery;
    
    return modal;
};

// SEARCH VIEW WITH SUGGESTIONS
export const searchViewWithSuggestions = (query, suggestions) => {
    const template = document.getElementById('search-modal-template');
    const modal = template.content.cloneNode(true);
    
    const modalDiv = modal.querySelector('.modal');
    modalDiv.style.minWidth = '500px';
    
    // Show info message
    const errorDiv = modal.querySelector('.error-message');
    errorDiv.style.display = 'block';
    errorDiv.style.background = '#fff3cd';
    errorDiv.style.border = '2px solid #ffc107';
    errorDiv.style.padding = '12px';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.marginBottom = '16px';
    errorDiv.style.textAlign = 'center';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-info-circle';
    icon.style.color = '#856404';
    icon.style.marginRight = '8px';
    
    const span = document.createElement('span');
    span.style.color = '#856404';
    span.style.fontWeight = '600';
    span.textContent = `No se encontraron resultados para "${query}"`;
    
    errorDiv.appendChild(icon);
    errorDiv.appendChild(span);
    
    // Set query value
    modal.querySelector('#search-query').value = query;
    
    // Add suggestions
    if (suggestions && suggestions.length > 0) {
        const suggestionsContainer = modal.querySelector('.suggestions-container');
        suggestionsContainer.style.marginTop = '20px';
        suggestionsContainer.style.textAlign = 'left';
        
        const title = document.createElement('p');
        title.style.color = 'var(--tmdb-dark-blue)';
        title.style.fontWeight = '600';
        title.style.marginBottom = '12px';
        
        const lightbulb = document.createElement('i');
        lightbulb.className = 'fas fa-lightbulb';
        lightbulb.style.color = 'var(--tmdb-yellow)';
        
        title.appendChild(lightbulb);
        title.appendChild(document.createTextNode(' Quizás te refieres a:'));
        suggestionsContainer.appendChild(title);
        
        const listContainer = document.createElement('div');
        listContainer.style.maxHeight = '300px';
        listContainer.style.overflowY = 'auto';
        
        suggestions.slice(0, 5).forEach(movie => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.gap = '12px';
            item.style.padding = '10px';
            item.style.background = '#f9f9f9';
            item.style.borderRadius = '8px';
            item.style.marginBottom = '8px';
            item.style.cursor = 'pointer';
            item.style.transition = 'all 0.3s';
            item.dataset.suggestionQuery = movie.title;
            
            const posterUrl = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                : 'files/placeholder.png';
            
            const img = document.createElement('img');
            img.src = posterUrl;
            img.style.width = '50px';
            img.style.height = '75px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '6px';
            img.onerror = function() { this.src = 'files/placeholder.png'; };
            
            const textDiv = document.createElement('div');
            textDiv.style.flex = '1';
            
            const titleDiv = document.createElement('div');
            titleDiv.style.fontWeight = '600';
            titleDiv.style.color = 'var(--tmdb-dark-blue)';
            const year = movie.release_date ? ` (${movie.release_date.split('-')[0]})` : '';
            titleDiv.textContent = movie.title + year;
            
            const clickText = document.createElement('div');
            clickText.style.fontSize = '12px';
            clickText.style.color = '#666';
            clickText.textContent = 'Click para buscar esta película';
            
            textDiv.appendChild(titleDiv);
            textDiv.appendChild(clickText);
            
            item.appendChild(img);
            item.appendChild(textDiv);
            listContainer.appendChild(item);
        });
        
        suggestionsContainer.appendChild(listContainer);
    }
    
    return modal;
};

// RESULTS VIEW - Shows search results
export const resultsView = (resultados, lastSearchQuery) => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.padding = '20px';
    container.style.marginBottom = '80px';
    
    const heading = document.createElement('h2');
    heading.style.textAlign = 'center';
    heading.style.color = 'var(--tmdb-dark-blue)';
    heading.style.fontSize = '32px';
    heading.style.marginBottom = '30px';
    heading.style.textShadow = '0 2px 4px rgba(0,0,0,0.1)';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-film';
    heading.appendChild(icon);
    heading.appendChild(document.createTextNode(` Resultados de la búsqueda: "${lastSearchQuery}"`));
    
    container.appendChild(heading);
    
    if (!resultados || resultados.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.style.color = '#666';
        emptyDiv.style.margin = '40px 0';
        emptyDiv.style.textAlign = 'center';
        emptyDiv.style.fontSize = '18px';
        
        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search';
        searchIcon.style.fontSize = '64px';
        searchIcon.style.color = '#ccc';
        searchIcon.style.display = 'block';
        searchIcon.style.marginBottom = '20px';
        
        emptyDiv.appendChild(searchIcon);
        emptyDiv.appendChild(document.createTextNode('No se encontraron películas'));
        container.appendChild(emptyDiv);
    } else {
        const resultsContainer = document.createElement('div');
        resultsContainer.style.display = 'flex';
        resultsContainer.style.flexWrap = 'wrap';
        resultsContainer.style.gap = '24px';
        resultsContainer.style.justifyContent = 'center';
        
        const template = document.getElementById('search-result-template');
        
        resultados.forEach(pelicula => {
            const card = template.content.cloneNode(true);
            
            const posterUrl = pelicula.poster_path 
                ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
                : 'files/placeholder.png';
            const releaseYear = pelicula.release_date ? pelicula.release_date.split('-')[0] : 'N/A';
            const rating = pelicula.vote_average ? pelicula.vote_average.toFixed(1) : 'N/A';
            
            const img = card.querySelector('img');
            img.src = posterUrl;
            img.onerror = function() { this.src = 'files/placeholder.png'; };
            
            const title = card.querySelector('.title');
            title.textContent = pelicula.title || 'Sin título';
            
            const movieInfo = card.querySelector('.movie-info');
            movieInfo.style.textAlign = 'center';
            movieInfo.style.fontSize = '11px';
            movieInfo.style.padding = '0 12px';
            movieInfo.style.marginBottom = '10px';
            
            // Add badges
            const ratingBadge = createBadge('rating', 'fas fa-star', rating);
            const yearBadge = createBadge('year', 'fas fa-calendar', releaseYear);
            movieInfo.appendChild(ratingBadge);
            movieInfo.appendChild(yearBadge);
            
            if (pelicula.genre_ids && pelicula.genre_ids.length > 0) {
                const genreName = GENRE_MAP[pelicula.genre_ids[0]];
                if (genreName) {
                    const genreBadge = createBadge('genre', null, genreName);
                    movieInfo.appendChild(genreBadge);
                }
            }
            
            // Set button data
            const consultBtn = card.querySelector('.consult-from-api');
            consultBtn.style.zIndex = '1';
            consultBtn.style.position = 'relative';
            consultBtn.dataset.movieId = pelicula.id;
            
            const addBtn = card.querySelector('.add-from-api');
            addBtn.style.zIndex = '1';
            addBtn.style.position = 'relative';
            addBtn.dataset.movie = JSON.stringify(pelicula).replace(/'/g, "&apos;");
            
            resultsContainer.appendChild(card);
        });
        
        container.appendChild(resultsContainer);
    }
    
    // Add back button
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.marginTop = '40px';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'index';
    const backIcon = document.createElement('i');
    backIcon.className = 'fas fa-arrow-left';
    backBtn.appendChild(backIcon);
    backBtn.appendChild(document.createTextNode(' Volver al inicio'));
    
    buttonContainer.appendChild(backBtn);
    container.appendChild(buttonContainer);
    
    return container;
};

// SHOW VIEW - Shows detailed movie information
export const showView = (pelicula) => {
    // Using innerHTML for complex layout - this matches the original comprehensive view
    const container = document.createElement('div');
    container.className = 'modal-bg';
    
    // Build rating circle SVG if rating exists
    let ratingCircle = '';
    if (typeof pelicula.rating === 'number' && !isNaN(pelicula.rating)) {
        const percent = Math.max(0, Math.min(100, Math.round(pelicula.rating * 10)));
        const radius = 28;
        const stroke = 6;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - percent / 100);
        
        // Color based on rating
        let color = '#20b38e'; // Green by default
        if (percent < 40) color = '#e85d30'; // Red
        else if (percent < 70) color = '#ffc107'; // Yellow
        
        ratingCircle = `
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                <svg width="70" height="70" style="display:block; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
                    <circle cx="35" cy="35" r="${radius}" stroke="#eee" stroke-width="${stroke}" fill="white" />
                    <circle cx="35" cy="35" r="${radius}" stroke="${color}" stroke-width="${stroke}" fill="none" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" style="transition:stroke-dashoffset 0.6s; transform:rotate(-90deg); transform-origin:center;" />
                    <text x="35" y="40" text-anchor="middle" font-size="16" fill="#222" font-weight="bold">${percent}%</text>
                </svg>
                <div>
                    <div style="font-size:0.95rem; color:${color}; font-weight:600;"><i class="fas fa-users"></i> Puntuación usuarios</div>
                    <div style="font-size:0.8rem; color:#666; margin-top:4px;">Basado en ${pelicula.vote_count || 'muchas'} valoraciones</div>
                </div>
            </div>
        `;
    }

    // Build tagline section
    let taglineSection = '';
    if (pelicula.tagline) {
        taglineSection = `<p style="font-style:italic; color:#666; font-size:16px; margin-bottom:20px; text-align:left; padding-left:4px; border-left:4px solid var(--tmdb-light-blue);">"${pelicula.tagline}"</p>`;
    }

    // Build runtime section
    let runtimeSection = '';
    if (pelicula.runtime) {
        const hours = Math.floor(pelicula.runtime / 60);
        const minutes = pelicula.runtime % 60;
        runtimeSection = `<p style="text-align:left;"><i class="fas fa-clock" style="color:var(--tmdb-light-blue);"></i> <strong>Duración:</strong> ${hours}h ${minutes}min</p>`;
    }

    // Build extra info section (language and popularity)
    let extraInfoSection = '';
    if (pelicula.original_language || pelicula.popularity) {
        extraInfoSection = '<div style="margin-top:12px;">';
        if (pelicula.original_language) {
            const langNames = {
                'en': 'Inglés', 'es': 'Español', 'fr': 'Francés', 'de': 'Alemán', 
                'it': 'Italiano', 'ja': 'Japonés', 'ko': 'Coreano', 'zh': 'Chino',
                'pt': 'Portugués', 'ru': 'Ruso'
            };
            const langName = langNames[pelicula.original_language] || pelicula.original_language.toUpperCase();
            extraInfoSection += `<p style="text-align:left;"><i class="fas fa-language" style="color:var(--tmdb-light-blue);"></i> <strong>Idioma original:</strong> ${langName}</p>`;
        }
        if (pelicula.popularity) {
            const popularityLevel = pelicula.popularity > 100 ? '🔥 Muy popular' : pelicula.popularity > 50 ? '⭐ Popular' : '📊 Moderada';
            extraInfoSection += `<p style="text-align:left;"><i class="fas fa-chart-line" style="color:var(--tmdb-light-blue);"></i> <strong>Popularidad:</strong> ${popularityLevel} (${pelicula.popularity.toFixed(1)})</p>`;
        }
        extraInfoSection += '</div>';
    }

    // Build budget and revenue section
    let budgetRevenueSection = '';
    if (pelicula.budget || pelicula.revenue) {
        budgetRevenueSection = '<div style="margin-top:12px; padding:16px; background:#f9f9f9; border-radius:12px;">';
        budgetRevenueSection += '<p style="text-align:left; margin:0 0 8px 0;"><strong><i class="fas fa-dollar-sign" style="color:var(--tmdb-light-green);"></i> Información financiera</strong></p>';
        if (pelicula.budget && pelicula.budget > 0) {
            const budgetFormatted = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pelicula.budget);
            budgetRevenueSection += `<p style="text-align:left; margin:4px 0;"><strong>Presupuesto:</strong> ${budgetFormatted}</p>`;
        }
        if (pelicula.revenue && pelicula.revenue > 0) {
            const revenueFormatted = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pelicula.revenue);
            budgetRevenueSection += `<p style="text-align:left; margin:4px 0;"><strong>Recaudación:</strong> ${revenueFormatted}</p>`;
            
            // Calculate profit if both values exist
            if (pelicula.budget && pelicula.budget > 0) {
                const profit = pelicula.revenue - pelicula.budget;
                const profitFormatted = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(profit);
                const profitColor = profit > 0 ? '#20b38e' : '#e85d30';
                budgetRevenueSection += `<p style="text-align:left; margin:8px 0 0 0; color:${profitColor}; font-weight:600;"><strong>Beneficio:</strong> ${profitFormatted}</p>`;
            }
        }
        budgetRevenueSection += '</div>';
    }

    // Build trailer section
    let trailerSection = '';
    if (pelicula.trailerKey) {
        trailerSection = `
            <div style="margin-top:24px;">
                <p style="font-weight:600; margin-bottom:14px; text-align:left; font-size:18px;"><i class="fas fa-play-circle" style="color:var(--tmdb-light-blue);"></i> Trailer oficial</p>
                <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px; box-shadow:0 6px 16px rgba(0,0,0,0.3);">
                    <iframe 
                        style="position:absolute; top:0; left:0; width:100%; height:100%;" 
                        src="https://www.youtube.com/embed/${pelicula.trailerKey}" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
    }

    // Build cast section
    let castSection = '';
    if (pelicula.cast && Array.isArray(pelicula.cast) && pelicula.cast.length > 0) {
        const castList = pelicula.cast.slice(0, 8).map(actor => {
            const actorImage = actor.profile_path 
                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                : 'files/placeholder.png';
            const actorName = typeof actor === 'string' ? actor : actor.name;
            const character = actor.character ? `<div class="cast-character">${actor.character}</div>` : '';
            return `<div class="cast-item">
                <img src="${actorImage}" alt="${actorName}" onerror="this.src='files/placeholder.png'" />
                <div class="cast-name">${actorName}</div>
                ${character}
            </div>`;
        }).join('');
        castSection = `
            <div style="margin-top:24px;">
                <p style="font-weight:600; margin-bottom:14px; text-align:left; font-size:18px;"><i class="fas fa-users" style="color:var(--tmdb-light-blue);"></i> Reparto principal</p>
                <div class="cast-grid">
                    ${castList}
                </div>
            </div>
        `;
    }

    // Build reviews section
    let reviewsSection = '';
    if (pelicula.reviews && Array.isArray(pelicula.reviews) && pelicula.reviews.length > 0) {
        const reviewsList = pelicula.reviews.map(review => {
            const ratingBadge = review.rating ? `<span style="background:#20b38e; color:white; padding:4px 10px; border-radius:16px; font-size:12px; font-weight:600;"><i class="fas fa-star"></i> ${review.rating}/10</span>` : '';
            const date = review.created_at ? new Date(review.created_at).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'}) : '';
            const truncatedContent = review.content.length > 300 ? review.content.substring(0, 300) + '...' : review.content;
            return `
                <div style="background:white; padding:18px; border-radius:12px; margin-bottom:14px; border-left:4px solid #01b4e4; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <strong style="color:#032541; font-size:15px;"><i class="fas fa-user-circle"></i> ${review.author}</strong>
                        ${ratingBadge}
                    </div>
                    ${date ? `<div style="font-size:12px; color:#888; margin-bottom:10px;"><i class="far fa-calendar"></i> ${date}</div>` : ''}
                    <p style="color:#444; font-size:13px; line-height:1.7; margin:0;">${truncatedContent}</p>
                </div>
            `;
        }).join('');
        reviewsSection = `
            <div style="margin-top:24px;">
                <p style="font-weight:600; margin-bottom:14px; text-align:left; font-size:18px;"><i class="fas fa-comment-dots" style="color:var(--tmdb-light-blue);"></i> Reseñas de usuarios</p>
                ${reviewsList}
            </div>
        `;
    }

    // Build genres section
    let genresSection = '';
    if (pelicula.generos && pelicula.generos.length > 0) {
        genresSection = `<p style="text-align:left;"><i class="fas fa-tags" style="color:var(--tmdb-light-blue);"></i> <strong>Géneros:</strong> ${pelicula.generos.map(g => `<span class="cast-badge">${g}</span>`).join(' ')}</p>`;
    }

    // Build synopsis section
    let synopsisSection = '';
    if (pelicula.resumen) {
        synopsisSection = `<div style='margin:16px 0; padding:16px; background:#f9f9f9; border-radius:12px;'><p style='margin:0; color:#444; font-size:14px; text-align:left; line-height:1.7;'><strong><i class="fas fa-align-left" style="color:var(--tmdb-light-blue);"></i> Sinopsis:</strong><br><br>${pelicula.resumen}</p></div>`;
    }

    // Compose the full HTML
    container.innerHTML = `
        <div class="modal modal-horizontal">
            <div class="modal-poster">
                <img src="${pelicula.miniatura}" onerror="this.src='files/placeholder.png'" />
            </div>
            <div class="modal-info">
                <h2 style="margin-top:0; margin-bottom:12px; text-align:left; color:var(--tmdb-dark-blue); font-size:28px;">${pelicula.titulo || "<em>Sin título</em>"}</h2>
                ${taglineSection}
                <p style="text-align:left;"><i class="fas fa-user-tie" style="color:var(--tmdb-light-blue);"></i> <strong>Director:</strong> ${pelicula.director || "<em>Sin director</em>"}</p>
                <p style="text-align:left;"><i class="fas fa-calendar-alt" style="color:var(--tmdb-light-blue);"></i> <strong>Año:</strong> ${pelicula.año || "<em>Sin año</em>"}</p>
                ${runtimeSection}
                ${extraInfoSection}
                ${ratingCircle}
                ${genresSection}
                ${budgetRevenueSection}
                ${synopsisSection}
                ${trailerSection}
                ${castSection}
                ${reviewsSection}
                <div class="actions" style="justify-content:flex-start; margin-top:28px;">
                    <button class="index"><i class="fas fa-arrow-left"></i> Volver</button>
                </div>
            </div>
        </div>
    `;
    
    return container;
};

// AUTH VIEW - Shows login/register form
export const authView = (isLogin = true) => {
    const template = document.getElementById('auth-modal-template');
    const modal = template.content.cloneNode(true);
    
    const title = modal.querySelector('.auth-title');
    title.textContent = isLogin ? 'Iniciar Sesión' : 'Registrarse';
    
    const fieldsContainer = modal.querySelector('.auth-fields');
    
    if (!isLogin) {
        const usernameField = document.createElement('div');
        usernameField.className = 'field';
        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Nombre de usuario';
        usernameLabel.appendChild(document.createElement('br'));
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.id = 'username';
        usernameInput.placeholder = 'Tu nombre de usuario';
        usernameInput.required = true;
        usernameField.appendChild(usernameLabel);
        usernameField.appendChild(usernameInput);
        fieldsContainer.appendChild(usernameField);
    }
    
    const emailField = document.createElement('div');
    emailField.className = 'field';
    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email';
    emailLabel.appendChild(document.createElement('br'));
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'email';
    emailInput.placeholder = 'tu@email.com';
    emailInput.required = true;
    emailField.appendChild(emailLabel);
    emailField.appendChild(emailInput);
    fieldsContainer.appendChild(emailField);
    
    const passwordField = document.createElement('div');
    passwordField.className = 'field';
    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Contraseña';
    passwordLabel.appendChild(document.createElement('br'));
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.placeholder = '••••••••';
    passwordInput.required = true;
    passwordField.appendChild(passwordLabel);
    passwordField.appendChild(passwordInput);
    fieldsContainer.appendChild(passwordField);
    
    const submitBtn = modal.querySelector('.auth-submit');
    submitBtn.className = isLogin ? 'auth-submit' : 'auth-submit';
    submitBtn.textContent = isLogin ? 'Iniciar sesión' : 'Registrarse';
    
    const toggleBtn = modal.querySelector('.auth-toggle');
    toggleBtn.textContent = isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión';
    toggleBtn.dataset.isLogin = isLogin;
    
    return modal;
};

// Update auth UI in nav
export const updateAuthUI = (user) => {
    const loginBtn = document.querySelector('.auth-login');
    const userInfo = document.querySelector('.user-info');
    const username = document.querySelector('.username');
    
    if (user) {
        loginBtn.style.display = 'none';
        userInfo.style.display = 'inline-block';
        username.textContent = user.username || user.email;
    } else {
        loginBtn.style.display = 'inline-block';
        userInfo.style.display = 'none';
    }
};

// PERSONAL DATA VIEW - Shows form for personal rating and notes
export const personalDataView = (pelicula) => {
    const template = document.getElementById('personal-data-template');
    const modal = template.content.cloneNode(true);
    
    // Set current values if they exist
    if (pelicula.personalRating) {
        modal.querySelector('#personal-rating').value = pelicula.personalRating;
    }
    if (pelicula.personalNotes) {
        modal.querySelector('#personal-notes').value = pelicula.personalNotes;
    }
    
    // Set movie ID on save button
    modal.querySelector('.save-personal').dataset.movieId = pelicula._id || '';
    
    return modal;
};

// LISTS MANAGEMENT VIEW - Shows all lists with ability to create/delete
export const listsManagementView = (listas) => {
    const template = document.getElementById('lists-modal-template');
    const modal = template.content.cloneNode(true);
    
    const listsContainer = modal.querySelector('.lists-container');
    
    if (!listas || listas.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.color = '#888';
        emptyMsg.style.margin = '20px 0';
        emptyMsg.textContent = 'No tienes listas creadas aún';
        listsContainer.appendChild(emptyMsg);
    } else {
        const listItemTemplate = document.getElementById('list-item-template');
        
        listas.forEach(lista => {
            const listItem = listItemTemplate.content.cloneNode(true);
            
            listItem.querySelector('.list-name').textContent = lista.name;
            
            if (lista.description) {
                listItem.querySelector('.list-description').textContent = lista.description;
            } else {
                listItem.querySelector('.list-description').style.display = 'none';
            }
            
            const movieCount = lista.movies ? lista.movies.length : 0;
            listItem.querySelector('.list-count').textContent = `${movieCount} película${movieCount !== 1 ? 's' : ''}`;
            
            // Set list IDs on buttons
            listItem.querySelector('.view-list').dataset.listId = lista._id;
            listItem.querySelector('.delete-list').dataset.listId = lista._id;
            
            listsContainer.appendChild(listItem);
        });
    }
    
    return modal;
};

// LIST VIEW - Shows movies in a specific list
export const listView = (lista) => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.padding = '20px';
    
    const heading = document.createElement('h2');
    heading.style.textAlign = 'center';
    heading.style.color = 'var(--tmdb-dark-blue)';
    heading.style.fontSize = '32px';
    heading.style.marginBottom = '10px';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-list';
    heading.appendChild(icon);
    heading.appendChild(document.createTextNode(` ${lista.name}`));
    
    container.appendChild(heading);
    
    if (lista.description) {
        const desc = document.createElement('p');
        desc.style.textAlign = 'center';
        desc.style.color = '#666';
        desc.style.marginBottom = '30px';
        desc.textContent = lista.description;
        container.appendChild(desc);
    }
    
    if (!lista.movies || lista.movies.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.style.color = '#888';
        emptyDiv.style.margin = '40px 0';
        emptyDiv.style.textAlign = 'center';
        emptyDiv.style.fontSize = '18px';
        emptyDiv.textContent = 'Esta lista está vacía';
        container.appendChild(emptyDiv);
    } else {
        const moviesContainer = document.createElement('div');
        moviesContainer.style.display = 'flex';
        moviesContainer.style.flexWrap = 'wrap';
        moviesContainer.style.gap = '24px';
        moviesContainer.style.justifyContent = 'center';
        
        // Render movies using the same template as index view
        lista.movies.forEach(movie => {
            // Create a simple movie card
            const movieCard = document.createElement('div');
            movieCard.className = 'movie';
            
            const img = document.createElement('img');
            img.src = movie.miniatura || 'files/placeholder.png';
            img.alt = movie.titulo || 'Sin título';
            img.onerror = function() { this.src = 'files/placeholder.png'; };
            movieCard.appendChild(img);
            
            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = movie.titulo || 'Sin título';
            movieCard.appendChild(title);
            
            if (movie.rating || movie.año) {
                const info = document.createElement('div');
                info.style.textAlign = 'center';
                info.style.fontSize = '11px';
                info.style.padding = '0 12px';
                info.style.marginBottom = '10px';
                
                if (movie.rating) {
                    const badge = createBadge('rating', 'fas fa-star', movie.rating.toFixed(1));
                    info.appendChild(badge);
                }
                
                if (movie.año) {
                    const badge = createBadge('year', 'fas fa-calendar', movie.año);
                    info.appendChild(badge);
                }
                
                movieCard.appendChild(info);
            }
            
            moviesContainer.appendChild(movieCard);
        });
        
        container.appendChild(moviesContainer);
    }
    
    // Back button
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.marginTop = '40px';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'manage-lists';
    const backIcon = document.createElement('i');
    backIcon.className = 'fas fa-arrow-left';
    backBtn.appendChild(backIcon);
    backBtn.appendChild(document.createTextNode(' Volver a Mis Listas'));
    
    buttonContainer.appendChild(backBtn);
    container.appendChild(buttonContainer);
    
    return container;
};

// Enhanced index view with personal ratings and list management
export const indexViewEnhanced = (peliculas, userLists = []) => {
    const fragment = document.createDocumentFragment();
    
    if (peliculas.length === 0) {
        const emptyTemplate = document.getElementById('empty-collection-template');
        const emptyMessage = emptyTemplate.content.cloneNode(true);
        fragment.appendChild(emptyMessage);
    } else {
        const movieTemplate = document.getElementById('movie-card-template');
        
        peliculas.forEach((pelicula, index) => {
            const movieCard = movieTemplate.content.cloneNode(true);
            
            // Get references to elements
            const img = movieCard.querySelector('img');
            const title = movieCard.querySelector('.title');
            const movieInfo = movieCard.querySelector('.movie-info');
            const actionsDiv = movieCard.querySelector('.actions');
            const showBtn = movieCard.querySelector('.show');
            const editBtn = movieCard.querySelector('.edit');
            const deleteBtn = movieCard.querySelector('.delete');
            
            // Set image
            img.src = pelicula.miniatura;
            img.alt = pelicula.titulo || 'Sin título';
            img.onerror = function() { this.src = 'files/placeholder.png'; };
            
            // Set title safely
            if (pelicula.titulo) {
                title.textContent = pelicula.titulo;
            } else {
                const em = document.createElement('em');
                em.textContent = 'Sin título';
                title.appendChild(em);
            }
            
            // Add personal rating badge if exists (prioritize over TMDb rating)
            if (pelicula.personalRating) {
                const badge = createBadge('rating', 'fas fa-heart', pelicula.personalRating.toFixed(1));
                badge.style.background = '#ff6b9d';
                badge.title = 'Tu calificación personal';
                movieInfo.appendChild(badge);
            } else if (pelicula.rating) {
                const badge = createBadge('rating', 'fas fa-star', pelicula.rating.toFixed(1));
                movieInfo.appendChild(badge);
            }
            
            // Add year badge if exists
            if (pelicula.año) {
                const badge = createBadge('year', 'fas fa-calendar', pelicula.año);
                movieInfo.appendChild(badge);
            }
            
            // Add genre badge if exists
            if (pelicula.generos && pelicula.generos.length > 0) {
                const badge = createBadge('genre', null, pelicula.generos[0]);
                movieInfo.appendChild(badge);
            }
            
            // Add personal notes indicator if exists
            if (pelicula.personalNotes) {
                const notesBadge = document.createElement('span');
                notesBadge.className = 'info-badge';
                notesBadge.style.background = '#ffc107';
                notesBadge.style.cursor = 'pointer';
                notesBadge.title = 'Tienes notas personales';
                const icon = document.createElement('i');
                icon.className = 'fas fa-sticky-note';
                notesBadge.appendChild(icon);
                movieInfo.appendChild(notesBadge);
            }
            
            // Add button for managing personal data
            const personalBtn = document.createElement('button');
            personalBtn.className = 'manage-personal';
            personalBtn.dataset.myId = index;
            const heartIcon = document.createElement('i');
            heartIcon.className = 'fas fa-heart';
            personalBtn.appendChild(heartIcon);
            personalBtn.appendChild(document.createTextNode(' personal'));
            actionsDiv.insertBefore(personalBtn, actionsDiv.firstChild);
            
            // Set button data attributes
            showBtn.dataset.myId = index;
            editBtn.dataset.myId = index;
            deleteBtn.dataset.myId = index;
            
            fragment.appendChild(movieCard);
        });
    }
    
    return fragment;
};

// Render a view to the main element
export const render = (viewElement) => {
    const main = getMainElement();
    main.appendChild(viewElement);
};
