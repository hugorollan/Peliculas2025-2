// MODELO DE DATOS

    // API Base URL - now using our proxy server for security
    const API_BASE_URL = '/api';

     let mis_peliculas_iniciales = [
         {titulo: "Superlópez",   director: "Javier Ruiz Caldera", año: "2018", miniatura: "files/superlopez.png"},
         {titulo: "Jurassic Park", director: "Steven Spielberg", año: "1993", miniatura: "files/jurassicpark.png"},
         {titulo: "Interstellar",  director: "Christopher Nolan", año: "2014", miniatura: "files/interstellar.png"}
     ];

    let mis_peliculas = [];

    // Guardar y leer películas usando solo localStorage
    const postAPI = async (peliculas) => {
        localStorage.setItem('mis_peliculas', JSON.stringify(peliculas));
        return true;
    }
    const getAPI = async () => {
        const pelis = localStorage.getItem('mis_peliculas');
        if (!pelis) return [];
        try {
            return JSON.parse(pelis);
        } catch {
            return [];
        }
    }
    const updateAPI = async (peliculas) => {
        localStorage.setItem('mis_peliculas', JSON.stringify(peliculas));
        return true;
    }

    // VISTAS

    const indexView = (peliculas) => {
        let i=0;
        let view = "";
        if (peliculas.length === 0) {
            view += `<div style='color:#888; margin:40px 0; text-align:center; font-size:18px;'>
                <i class="fas fa-film" style="font-size:48px; color:#ccc; display:block; margin-bottom:16px;"></i>
                No hay películas en tu colección
            </div>`;
        }
        while(i < peliculas.length) {
            // Determinar el género principal si existe
            let genreBadge = '';
            if (peliculas[i].generos && peliculas[i].generos.length > 0) {
                genreBadge = `<span class="info-badge badge-genre">${peliculas[i].generos[0]}</span>`;
            }
            
            // Añadir badge de rating si existe
            let ratingBadge = '';
            if (peliculas[i].rating) {
                ratingBadge = `<span class="info-badge badge-rating"><i class="fas fa-star"></i> ${peliculas[i].rating.toFixed(1)}</span>`;
            }
            
            view += `
            <div class="movie">
                <div class="movie-img">
                    <img src="${peliculas[i].miniatura}" onerror="this.src='files/placeholder.png'"/>
                </div>
                <div class="title">
                    ${peliculas[i].titulo || "<em>Sin título</em>"}
                </div>
                <div style="text-align:center; font-size:11px; padding:0 12px; margin-bottom:10px;">
                    ${ratingBadge}
                    ${peliculas[i].año ? `<span class="info-badge badge-year"><i class="fas fa-calendar"></i> ${peliculas[i].año}</span>` : ""}
                    ${genreBadge}
                </div>
                <div class="actions">
                    <button class="show" data-my-id="${i}"><i class="fas fa-eye"></i> ver</button>
                    <button class="edit" data-my-id="${i}"><i class="fas fa-edit"></i> editar</button>
                    <button class="delete" data-my-id="${i}"><i class="fas fa-trash"></i> borrar</button>
                </div>
            </div>\n`;
            i = i + 1;
        }
        return view;
    }

    // ========================================================================
    // REFACTORED VERSION using HTML Templates and createElement
    // This is an EXAMPLE implementation demonstrating best practices for DOM manipulation.
    // It is NOT integrated into the main application to maintain backward compatibility.
    // See DOM_REFACTORING_GUIDE.md for detailed explanation and integration instructions.
    // ========================================================================
    
    const indexViewRefactored = (peliculas) => {
        // Create a document fragment to batch DOM operations
        const fragment = document.createDocumentFragment();
        
        if (peliculas.length === 0) {
            // Clone the empty collection template
            const emptyTemplate = document.getElementById('empty-collection-template');
            const emptyMessage = emptyTemplate.content.cloneNode(true);
            fragment.appendChild(emptyMessage);
        } else {
            // Get the movie card template
            const movieTemplate = document.getElementById('movie-card-template');
            
            peliculas.forEach((pelicula, index) => {
                // Clone the template
                const movieCard = movieTemplate.content.cloneNode(true);
                
                // Get references to elements we need to populate
                const movieDiv = movieCard.querySelector('.movie');
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
                
                // Set title (safely using textContent to avoid XSS)
                if (pelicula.titulo) {
                    title.textContent = pelicula.titulo;
                } else {
                    const em = document.createElement('em');
                    em.textContent = 'Sin título';
                    title.appendChild(em);
                }
                
                // Add rating badge if exists
                if (pelicula.rating) {
                    const ratingBadge = document.createElement('span');
                    ratingBadge.className = 'info-badge badge-rating';
                    const starIcon = document.createElement('i');
                    starIcon.className = 'fas fa-star';
                    ratingBadge.appendChild(starIcon);
                    ratingBadge.appendChild(document.createTextNode(' ' + pelicula.rating.toFixed(1)));
                    movieInfo.appendChild(ratingBadge);
                }
                
                // Add year badge if exists
                if (pelicula.año) {
                    const yearBadge = document.createElement('span');
                    yearBadge.className = 'info-badge badge-year';
                    const calendarIcon = document.createElement('i');
                    calendarIcon.className = 'fas fa-calendar';
                    yearBadge.appendChild(calendarIcon);
                    yearBadge.appendChild(document.createTextNode(' ' + pelicula.año));
                    movieInfo.appendChild(yearBadge);
                }
                
                // Add genre badge if exists
                if (pelicula.generos && pelicula.generos.length > 0) {
                    const genreBadge = document.createElement('span');
                    genreBadge.className = 'info-badge badge-genre';
                    genreBadge.textContent = pelicula.generos[0];
                    movieInfo.appendChild(genreBadge);
                }
                
                // Set button data attributes
                showBtn.dataset.myId = index;
                editBtn.dataset.myId = index;
                deleteBtn.dataset.myId = index;
                
                // Add the populated card to the fragment
                fragment.appendChild(movieCard);
            });
        }
        
        // Return the fragment (can be appended directly to DOM)
        return fragment;
    }

    const editView = (i, pelicula) => {
        return `
        <div class="modal-bg">
          <div class="modal">
            <h2><i class="fas fa-edit"></i> Editar Película</h2>
            <div class="field" style="width:100%; margin-bottom:10px;">
                Título <br>
                <input type="text" id="titulo" placeholder="Título" value="${pelicula.titulo}" style="width:100%;">
            </div>
            <div class="field" style="width:100%; margin-bottom:10px;">
                Director <br>
                <input type="text" id="director" placeholder="Director" value="${pelicula.director}" style="width:100%;">
            </div>
            <div class="field" style="width:100%; margin-bottom:10px;">
                Año <br>
                <input type="text" id="año" placeholder="Año" value="${pelicula.año || ''}" style="width:100%;">
            </div>
            <div class="field" style="width:100%; margin-bottom:10px;">
                Miniatura <br>
                <input type="text" id="miniatura" placeholder="URL de la miniatura" value="${pelicula.miniatura}" style="width:100%;">
            </div>
            <div class="actions" style="width:100%; display:flex; justify-content:center; gap:10px;">
                <button class="update" data-my-id="${i}"><i class="fas fa-save"></i> Actualizar</button>
                <button class="index"><i class="fas fa-times"></i> Cancelar</button>
            </div>
          </div>
        </div>`;
    }

    const showView = (pelicula) => {
        // Círculo de puntuación SVG
        let ratingCircle = '';
        if (typeof pelicula.rating === 'number' && !isNaN(pelicula.rating)) {
            const percent = Math.max(0, Math.min(100, Math.round(pelicula.rating * 10)));
            const radius = 28;
            const stroke = 6;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference * (1 - percent / 100);
            
            // Color basado en el rating
            let color = '#20b38e'; // Verde por defecto
            if (percent < 40) color = '#e85d30'; // Rojo
            else if (percent < 70) color = '#ffc107'; // Amarillo
            
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

        // Mostrar tagline si está disponible
        let taglineSection = '';
        if (pelicula.tagline) {
            taglineSection = `<p style="font-style:italic; color:#666; font-size:16px; margin-bottom:20px; text-align:left; padding-left:4px; border-left:4px solid var(--tmdb-light-blue);">"${pelicula.tagline}"</p>`;
        }

        // Mostrar duración si está disponible
        let runtimeSection = '';
        if (pelicula.runtime) {
            const hours = Math.floor(pelicula.runtime / 60);
            const minutes = pelicula.runtime % 60;
            runtimeSection = `<p style="text-align:left;"><i class="fas fa-clock" style="color:var(--tmdb-light-blue);"></i> <strong>Duración:</strong> ${hours}h ${minutes}min</p>`;
        }

        // Mostrar idioma original y popularidad si están disponibles
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

        // Mostrar presupuesto y recaudación si están disponibles
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
                
                // Calcular beneficio si hay ambos datos
                if (pelicula.budget && pelicula.budget > 0) {
                    const profit = pelicula.revenue - pelicula.budget;
                    const profitFormatted = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(profit);
                    const profitColor = profit > 0 ? '#20b38e' : '#e85d30';
                    budgetRevenueSection += `<p style="text-align:left; margin:8px 0 0 0; color:${profitColor}; font-weight:600;"><strong>Beneficio:</strong> ${profitFormatted}</p>`;
                }
            }
            budgetRevenueSection += '</div>';
        }

        // Mostrar trailer si está disponible
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

        // Mostrar reparto si está disponible
        let castSection = '';
        if (pelicula.cast && Array.isArray(pelicula.cast) && pelicula.cast.length > 0) {
            const castList = pelicula.cast.slice(0, 8).map(actor => {
                const actorImage = actor.profile_path 
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : 'files/placeholder.png';
                return `<div class="cast-item">
                    <img src="${actorImage}" alt="${actor.name}" onerror="this.src='files/placeholder.png'" />
                    <div class="cast-name">${actor.name}</div>
                    ${actor.character ? `<div class="cast-character">${actor.character}</div>` : ''}
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

        // Mostrar reseñas si están disponibles
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

        return `
        <div class="modal-bg">
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
                    ${pelicula.generos && pelicula.generos.length > 0 ? `<p style="text-align:left;"><i class="fas fa-tags" style="color:var(--tmdb-light-blue);"></i> <strong>Géneros:</strong> ${pelicula.generos.map(g => `<span class="cast-badge">${g}</span>`).join(' ')}</p>` : ''}
                    ${budgetRevenueSection}
                    ${pelicula.resumen ? `<div style='margin:16px 0; padding:16px; background:#f9f9f9; border-radius:12px;'><p style='margin:0; color:#444; font-size:14px; text-align:left; line-height:1.7;'><strong><i class="fas fa-align-left" style="color:var(--tmdb-light-blue);"></i> Sinopsis:</strong><br><br>${pelicula.resumen}</p></div>` : ''}
                    ${trailerSection}
                    ${castSection}
                    ${reviewsSection}
                    <div class="actions" style="justify-content:flex-start; margin-top:28px;">
                        <button class="index"><i class="fas fa-arrow-left"></i> Volver</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    const newView = () => {
        return `
        <div class="modal-bg">
          <div class="modal">
            <h2><i class="fas fa-plus-circle"></i> Crear Película</h2>
            <div class="field">
                Título <br>
                <input type="text" id="titulo" placeholder="Título">
            </div>
            <div class="field">
                Director <br>
                <input type="text" id="director" placeholder="Director">
            </div>
            <div class="field">
                Año <br>
                <input type="text" id="año" placeholder="Año">
            </div>
            <div class="field">
                Miniatura <br>
                <input type="text" id="miniatura" placeholder="URL de la miniatura">
            </div>
            <div class="actions">
                <button class="create"><i class="fas fa-save"></i> Crear</button>
                <button class="index"><i class="fas fa-times"></i> Cancelar</button>
            </div>
          </div>
        </div>`;
    }

    const searchView = () => {
        return `
        <div class="modal-bg">
          <div class="modal">
            <h2><i class="fas fa-search"></i> Buscar Película en TMDb</h2>
            <div class="field">
                Título de la película <br>
                <input type="text" id="search-query" placeholder="Ej: Inception, Matrix, Avatar...">
            </div>
            <div class="actions">
                <button class="search"><i class="fas fa-search"></i> Buscar</button>
                <button class="index"><i class="fas fa-times"></i> Cancelar</button>
            </div>
          </div>
        </div>`;
    }

    const searchViewWithError = (errorMessage, previousQuery = '') => {
        return `
        <div class="modal-bg">
          <div class="modal">
            <h2><i class="fas fa-search"></i> Buscar Película en TMDb</h2>
            <div style="background: #fee; border: 2px solid #fcc; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
                <i class="fas fa-exclamation-triangle" style="color: #d00; margin-right: 8px;"></i>
                <span style="color: #d00; font-weight: 600;">${errorMessage}</span>
            </div>
            <div class="field">
                Título de la película <br>
                <input type="text" id="search-query" placeholder="Ej: Inception, Matrix, Avatar..." value="${previousQuery}">
            </div>
            <div class="actions">
                <button class="search"><i class="fas fa-search"></i> Buscar</button>
                <button class="index"><i class="fas fa-times"></i> Cancelar</button>
            </div>
          </div>
        </div>`;
    }

    const searchViewWithSuggestions = (query, suggestions) => {
        let suggestionsHtml = '';
        if (suggestions && suggestions.length > 0) {
            suggestionsHtml = `
                <div style="margin-top: 20px; text-align: left;">
                    <p style="color: var(--tmdb-dark-blue); font-weight: 600; margin-bottom: 12px;">
                        <i class="fas fa-lightbulb" style="color: var(--tmdb-yellow);"></i> 
                        Quizás te refieres a:
                    </p>
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${suggestions.slice(0, 5).map(movie => {
                            const posterUrl = movie.poster_path 
                                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                : 'files/placeholder.png';
                            const year = movie.release_date ? ` (${movie.release_date.split('-')[0]})` : '';
                            return `
                                <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: #f9f9f9; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.3s;" class="suggestion-item" data-suggestion-query="${movie.title}">
                                    <img src="${posterUrl}" style="width: 50px; height: 75px; object-fit: cover; border-radius: 6px;" onerror="this.src='files/placeholder.png'">
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; color: var(--tmdb-dark-blue);">${movie.title}${year}</div>
                                        <div style="font-size: 12px; color: #666;">Click para buscar esta película</div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        return `
        <div class="modal-bg">
          <div class="modal" style="min-width: 500px;">
            <h2><i class="fas fa-search"></i> Buscar Película en TMDb</h2>
            <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
                <i class="fas fa-info-circle" style="color: #856404; margin-right: 8px;"></i>
                <span style="color: #856404; font-weight: 600;">No se encontraron resultados para "${query}"</span>
            </div>
            <div class="field">
                Título de la película <br>
                <input type="text" id="search-query" placeholder="Ej: Inception, Matrix, Avatar..." value="${query}">
            </div>
            ${suggestionsHtml}
            <div class="actions">
                <button class="search"><i class="fas fa-search"></i> Buscar</button>
                <button class="index"><i class="fas fa-times"></i> Cancelar</button>
            </div>
          </div>
        </div>`;
    }

    const resultsView = (resultados) => {
        let view = `
        <div style="width: 100%; padding: 20px; margin-bottom: 80px;">
            <h2 style="text-align: center; color: var(--tmdb-dark-blue); font-size: 32px; margin-bottom: 30px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <i class="fas fa-film"></i> Resultados de la búsqueda: "${lastSearchQuery}"
            </h2>`;
        
        if (!resultados || resultados.length === 0) {
            view += `<div style='color: #666; margin:40px 0; text-align: center; font-size: 18px;'>
                <i class="fas fa-search" style="font-size:64px; color:#ccc; display:block; margin-bottom:20px;"></i>
                No se encontraron películas
            </div>`;
        } else {
            view += `<div style="display: flex; flex-wrap: wrap; gap: 24px; justify-content: center;">`;
            resultados.forEach(pelicula => {
                const posterUrl = pelicula.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
                    : 'files/placeholder.png';
                const releaseYear = pelicula.release_date ? pelicula.release_date.split('-')[0] : 'N/A';
                const rating = pelicula.vote_average ? pelicula.vote_average.toFixed(1) : 'N/A';
                
                // Género principal si existe
                let genreBadge = '';
                if (pelicula.genre_ids && pelicula.genre_ids.length > 0) {
                    const GENRE_MAP = {
                        28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia',
                        80: 'Crimen', 99: 'Documental', 18: 'Drama', 10751: 'Familiar',
                        14: 'Fantasía', 36: 'Historia', 27: 'Terror', 10402: 'Música',
                        9648: 'Misterio', 10749: 'Romance', 878: 'Ciencia ficción',
                        10770: 'Película de TV', 53: 'Suspense', 10752: 'Bélica', 37: 'Western'
                    };
                    const genreName = GENRE_MAP[pelicula.genre_ids[0]] || '';
                    if (genreName) {
                        genreBadge = `<span class="info-badge badge-genre">${genreName}</span>`;
                    }
                }
                
                view += `
                <div class="movie">
                    <div class="movie-img">
                        <img src="${posterUrl}" onerror="this.src='files/placeholder.png'"/>
                    </div>
                    <div class="title">${pelicula.title || "<em>Sin título</em>"}</div>
                    <div style="text-align:center; font-size:11px; padding:0 12px; margin-bottom:10px;">
                        <span class="info-badge badge-rating"><i class="fas fa-star"></i> ${rating}</span>
                        <span class="info-badge badge-year"><i class="fas fa-calendar"></i> ${releaseYear}</span>
                        ${genreBadge}
                    </div>
                    <div class="actions">
                        <button class="consult-from-api" style="z-index:1; position:relative;" data-movie-id="${pelicula.id}"><i class="fas fa-info-circle"></i> Consultar</button>
                        <button class="add-from-api" style="z-index:1; position:relative;" data-movie='${JSON.stringify(pelicula).replace(/'/g, "&apos;")}'><i class="fas fa-plus"></i> Añadir</button>
                    </div>
                </div>`;
            });
            view += `</div>`;
        }
        
        view += `
            <div style="text-align: center; margin-top: 40px;">
                <button class="index"><i class="fas fa-arrow-left"></i> Volver al inicio</button>
            </div>
        </div>`;
        
        return view;
    }

    // CONTROLADORES 

    const initContr = async () => {
        // Si no hay películas en localStorage, inicializa con las iniciales
        if (!localStorage.getItem('mis_peliculas')) {
            await postAPI(mis_peliculas_iniciales);
        }
        indexContr();
    }

    const indexContr = async () => {
    let pelis = await getAPI();
    // Si la respuesta no es un array, fuerza array vacío
    if (!Array.isArray(pelis)) pelis = [];
    // Si la respuesta es un objeto vacío, también fuerza array vacío
    if (typeof pelis === 'object' && pelis !== null && Object.keys(pelis).length === 0) pelis = [];
    mis_peliculas = pelis;
    document.getElementById('main').innerHTML = indexView(mis_peliculas);
    }

    const showContr = (i) => {
        document.getElementById('main').innerHTML = showView(mis_peliculas[i]);
    }

    const newContr = () => {
        document.getElementById('main').innerHTML = newView();
    }

    const createContr = async () => {
        const titulo = document.getElementById('titulo').value;
        const director = document.getElementById('director').value;
        const año = document.getElementById('año').value;
        const miniatura = document.getElementById('miniatura').value;
        mis_peliculas.push({titulo, director, año, miniatura});
        await updateAPI(mis_peliculas);
        indexContr();
    }

    const editContr = (i) => {
        document.getElementById('main').innerHTML = editView(i,  mis_peliculas[i]);
    }

    const updateContr = async (i) => {
        mis_peliculas[i].titulo   = document.getElementById('titulo').value;
        mis_peliculas[i].director = document.getElementById('director').value;
        mis_peliculas[i].año      = document.getElementById('año').value;
        mis_peliculas[i].miniatura = document.getElementById('miniatura').value;
        await updateAPI(mis_peliculas);
        indexContr();
    }

    const deleteContr = async (i) => {
        if (confirm("¿Seguro que quieres borrar esta película?")) {
        mis_peliculas.splice(i, 1);
        await updateAPI(mis_peliculas);
        indexContr();
        }
    }

    const resetContr = async () => {
        if (confirm("¿Seguro que quieres eliminar todas las películas?")) {
            await updateAPI([]);
            indexContr();
        }
    }

    const searchViewContr = () => {
        document.getElementById('main').innerHTML = searchView();
    }

    const searchContr = async () => {
        const query = document.getElementById('search-query').value.trim();
        
        if (!query) {
            alert('Por favor, ingresa un término de búsqueda');
            return;
        }
        
        // Guardar la consulta para poder volver
        lastSearchQuery = query;
        
        // Mostrar estado de carga
        document.getElementById('main').innerHTML = `
            <div style="text-align:center; padding:100px 20px;">
                <div class="loading"></div>
                <p style="margin-top:24px; font-size:18px; color:#666;"><i class="fas fa-search"></i> Buscando películas...</p>
            </div>
        `;

        try {
            const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}&language=es-ES`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                lastSearchResults = data.results;
                document.getElementById('main').innerHTML = resultsView(data.results);
            } else {
                // No se encontraron resultados exactos, buscar sugerencias
                await searchWithSuggestionsContr(query);
            }
        } catch (err) {
            console.error(err);
            document.getElementById('main').innerHTML = searchViewWithError('Error al buscar películas. Por favor, intenta de nuevo.', query);
        }
    }

    const searchWithSuggestionsContr = async (query) => {
        // Intentar obtener sugerencias buscando películas populares o términos similares
        try {
            // Buscar con el primer par de palabras si hay espacios
            const words = query.split(' ');
            let suggestions = [];
            
            // Intentar buscar con palabras individuales si la búsqueda original no tuvo resultados
            if (words.length > 1) {
                for (let word of words) {
                    if (word.length > 2) { // Solo buscar palabras con más de 2 caracteres
                        try {
                            const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(word)}&language=es-ES`);
                            if (response.ok) {
                                const data = await response.json();
                                if (data.results && data.results.length > 0) {
                                    // Añadir películas únicas a las sugerencias
                                    data.results.forEach(movie => {
                                        if (!suggestions.find(s => s.id === movie.id)) {
                                            suggestions.push(movie);
                                        }
                                    });
                                    if (suggestions.length >= 5) break; // Suficientes sugerencias
                                }
                            }
                        } catch (err) {
                            console.warn(`Error buscando sugerencias para "${word}":`, err);
                        }
                    }
                }
            }
            
            // Si aún no hay sugerencias, buscar películas populares
            if (suggestions.length === 0) {
                try {
                    const response = await fetch(`${API_BASE_URL}/popular?language=es-ES&page=1`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.results) {
                            suggestions = data.results.slice(0, 5);
                        }
                    }
                } catch (err) {
                    console.warn('Error obteniendo películas populares:', err);
                }
            }
            
            // Mostrar vista con sugerencias
            document.getElementById('main').innerHTML = searchViewWithSuggestions(query, suggestions);
            
        } catch (err) {
            console.error('Error obteniendo sugerencias:', err);
            document.getElementById('main').innerHTML = searchViewWithError('No se encontraron resultados. Intenta con otro término.', query);
        }
    }

    const addFromAPIContr = async (ev) => {
        try {
            const movieData = JSON.parse(ev.target.dataset.movie.replace(/&apos;/g, "'"));
            const posterUrl = movieData.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                : 'files/placeholder.png';

            // Verificar si la película ya existe (por título)
            const yaExiste = mis_peliculas.some(p => p.titulo === movieData.title);
            if (yaExiste) {
                alert('Esta película ya está en tu lista');
                return;
            }

            // Obtener información extendida de la película (runtime, videos, reviews)
            let director = 'Desconocido';
            let cast = [];
            let runtime = null;
            let trailerKey = null;
            let reviews = [];
            let budget = null;
            let revenue = null;
            let tagline = null;
            let popularity = movieData.popularity || null;
            let original_language = movieData.original_language || null;
            let vote_count = movieData.vote_count || null;

            try {
                // Obtener detalles completos de la película
                const detailsRes = await fetch(`${API_BASE_URL}/movie/${movieData.id}?language=es-ES&append_to_response=credits,videos,reviews`);
                if (detailsRes.ok) {
                    const detailsData = await detailsRes.json();
                    
                    // Runtime (duración)
                    if (detailsData.runtime) {
                        runtime = detailsData.runtime;
                    }

                    // Budget y Revenue
                    if (detailsData.budget) {
                        budget = detailsData.budget;
                    }
                    if (detailsData.revenue) {
                        revenue = detailsData.revenue;
                    }

                    // Tagline
                    if (detailsData.tagline) {
                        tagline = detailsData.tagline;
                    }

                    // Credits (director y reparto)
                    if (detailsData.credits) {
                        if (detailsData.credits.crew && Array.isArray(detailsData.credits.crew)) {
                            const directorObj = detailsData.credits.crew.find(persona => persona.job === 'Director');
                            if (directorObj) {
                                director = directorObj.name;
                            }
                        }
                        // Obtener el reparto (cast) - máximo 8 actores
                        if (detailsData.credits.cast && Array.isArray(detailsData.credits.cast)) {
                            cast = detailsData.credits.cast.slice(0, 8).map(actor => ({
                                name: actor.name,
                                character: actor.character,
                                profile_path: actor.profile_path
                            }));
                        }
                    }

                    // Videos (trailers)
                    if (detailsData.videos && detailsData.videos.results) {
                        // Buscar trailer en español primero
                        let trailer = detailsData.videos.results.find(v => 
                            v.type === 'Trailer' && v.site === 'YouTube' && (v.iso_639_1 === 'es' || v.iso_639_1 === 'en')
                        );
                        
                        // Si no hay trailer en español o inglés, buscar cualquier trailer de YouTube
                        if (!trailer) {
                            trailer = detailsData.videos.results.find(v => 
                                v.type === 'Trailer' && v.site === 'YouTube'
                            );
                        }
                        
                        // Si aún no hay trailer, buscar un Teaser
                        if (!trailer) {
                            trailer = detailsData.videos.results.find(v => 
                                v.type === 'Teaser' && v.site === 'YouTube'
                            );
                        }
                        
                        // Si hay algún video, usar el primero disponible
                        if (!trailer && detailsData.videos.results.length > 0) {
                            trailer = detailsData.videos.results.find(v => v.site === 'YouTube');
                        }
                        
                        if (trailer) {
                            trailerKey = trailer.key;
                        }
                    }

                    // Reviews (reseñas)
                    if (detailsData.reviews && detailsData.reviews.results) {
                        reviews = detailsData.reviews.results.slice(0, 3).map(review => ({
                            author: review.author,
                            content: review.content,
                            rating: review.author_details?.rating || null,
                            created_at: review.created_at
                        }));
                    }
                }
            } catch (err) {
                console.warn(`No se pudo obtener información extendida para "${movieData.title}":`, err);
            }

            // Mapeo de IDs de géneros a nombres en español (TMDb)
            const GENRE_MAP = {
                28: 'Acción',
                12: 'Aventura',
                16: 'Animación',
                35: 'Comedia',
                80: 'Crimen',
                99: 'Documental',
                18: 'Drama',
                10751: 'Familiar',
                14: 'Fantasía',
                36: 'Historia',
                27: 'Terror',
                10402: 'Música',
                9648: 'Misterio',
                10749: 'Romance',
                878: 'Ciencia ficción',
                10770: 'Película de TV',
                53: 'Suspense',
                10752: 'Bélica',
                37: 'Western'
            };

            let generos = [];
            if (Array.isArray(movieData.genre_ids) && movieData.genre_ids.length > 0) {
                generos = movieData.genre_ids.map(id => GENRE_MAP[id] || id);
            } else if (movieData.genres) {
                generos = movieData.genres.map(g => g.name);
            }
            const rating = typeof movieData.vote_average === 'number' ? movieData.vote_average : '';

            const nuevaPelicula = {
                titulo: movieData.title,
                director: director,
                año: movieData.release_date ? movieData.release_date.split('-')[0] : '',
                miniatura: posterUrl,
                resumen: movieData.overview || '',
                rating: rating,
                generos: generos,
                cast: cast,
                runtime: runtime,
                trailerKey: trailerKey,
                reviews: reviews,
                budget: budget,
                revenue: revenue,
                tagline: tagline,
                popularity: popularity,
                original_language: original_language,
                vote_count: vote_count
            };

            mis_peliculas.push(nuevaPelicula);
            await updateAPI(mis_peliculas);

            alert(`"${movieData.title}" ha sido añadida a tu lista`);
            indexContr();
        } catch (err) {
            console.error('Error al añadir película:', err);
            alert('Error al añadir la película. Por favor, intenta de nuevo.');
        }
    }

    const backToSearchContr = () => {
        if (lastSearchResults) {
            document.getElementById('main').innerHTML = resultsView(lastSearchResults);
        } else {
            searchViewContr();
        }
    }

    const consultFromAPIContr = async (ev) => {
        const movieId = ev.target.dataset.movieId;
        
        if (!movieId) {
            alert('No se pudo obtener el ID de la película');
            return;
        }
        
        // Mostrar estado de carga
        document.getElementById('main').innerHTML = `
            <div style="text-align:center; padding:100px 20px;">
                <div class="loading"></div>
                <p style="margin-top:24px; font-size:18px; color:#666;"><i class="fas fa-info-circle"></i> Consultando información de la película...</p>
            </div>
        `;
        
        try {
            // Obtener detalles completos de la película
            const response = await fetch(`${API_BASE_URL}/movie/${movieId}?language=es-ES&append_to_response=credits,videos,reviews`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const movieData = await response.json();
            
            // Construir objeto de película con toda la información
            const posterUrl = movieData.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                : 'files/placeholder.png';
            
            // Obtener director
            let director = 'Desconocido';
            if (movieData.credits && movieData.credits.crew) {
                const directorObj = movieData.credits.crew.find(persona => persona.job === 'Director');
                if (directorObj) {
                    director = directorObj.name;
                }
            }
            
            // Obtener reparto
            let cast = [];
            if (movieData.credits && movieData.credits.cast) {
                cast = movieData.credits.cast.slice(0, 8).map(actor => ({
                    name: actor.name,
                    character: actor.character,
                    profile_path: actor.profile_path
                }));
            }
            
            // Obtener trailer
            let trailerKey = null;
            if (movieData.videos && movieData.videos.results) {
                let trailer = movieData.videos.results.find(v => 
                    v.type === 'Trailer' && v.site === 'YouTube' && (v.iso_639_1 === 'es' || v.iso_639_1 === 'en')
                );
                if (!trailer) {
                    trailer = movieData.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                }
                if (!trailer) {
                    trailer = movieData.videos.results.find(v => v.type === 'Teaser' && v.site === 'YouTube');
                }
                if (!trailer && movieData.videos.results.length > 0) {
                    trailer = movieData.videos.results.find(v => v.site === 'YouTube');
                }
                if (trailer) {
                    trailerKey = trailer.key;
                }
            }
            
            // Obtener reseñas
            let reviews = [];
            if (movieData.reviews && movieData.reviews.results) {
                reviews = movieData.reviews.results.slice(0, 3).map(review => ({
                    author: review.author,
                    content: review.content,
                    rating: review.author_details?.rating || null,
                    created_at: review.created_at
                }));
            }
            
            // Mapeo de géneros
            const GENRE_MAP = {
                28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia',
                80: 'Crimen', 99: 'Documental', 18: 'Drama', 10751: 'Familiar',
                14: 'Fantasía', 36: 'Historia', 27: 'Terror', 10402: 'Música',
                9648: 'Misterio', 10749: 'Romance', 878: 'Ciencia ficción',
                10770: 'Película de TV', 53: 'Suspense', 10752: 'Bélica', 37: 'Western'
            };
            
            let generos = [];
            if (movieData.genres) {
                generos = movieData.genres.map(g => g.name);
            }
            
            // Crear objeto de película temporal para consulta
            const peliculaConsulta = {
                titulo: movieData.title,
                director: director,
                año: movieData.release_date ? movieData.release_date.split('-')[0] : '',
                miniatura: posterUrl,
                resumen: movieData.overview || '',
                rating: movieData.vote_average || null,
                generos: generos,
                cast: cast,
                runtime: movieData.runtime || null,
                trailerKey: trailerKey,
                reviews: reviews,
                budget: movieData.budget || null,
                revenue: movieData.revenue || null,
                tagline: movieData.tagline || null,
                popularity: movieData.popularity || null,
                original_language: movieData.original_language || null,
                vote_count: movieData.vote_count || null
            };
            
            // Mostrar la vista de consulta con botón para volver a resultados de búsqueda
            document.getElementById('main').innerHTML = consultMovieView(peliculaConsulta, movieData);
            
        } catch (err) {
            console.error('Error al consultar película:', err);
            alert('Error al consultar la película. Por favor, intenta de nuevo.');
            searchViewContr();
        }
    }

    const consultMovieView = (pelicula, movieData) => {
        // Similar a showView pero con botón de añadir y volver a búsqueda
        
        // Círculo de puntuación SVG
        let ratingCircle = '';
        if (typeof pelicula.rating === 'number' && !isNaN(pelicula.rating)) {
            const percent = Math.max(0, Math.min(100, Math.round(pelicula.rating * 10)));
            const radius = 28;
            const stroke = 6;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference * (1 - percent / 100);
            
            let color = '#20b38e';
            if (percent < 40) color = '#e85d30';
            else if (percent < 70) color = '#ffc107';
            
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

        let taglineSection = '';
        if (pelicula.tagline) {
            taglineSection = `<p style="font-style:italic; color:#666; font-size:16px; margin-bottom:20px; text-align:left; padding-left:4px; border-left:4px solid var(--tmdb-light-blue);">"${pelicula.tagline}"</p>`;
        }

        let runtimeSection = '';
        if (pelicula.runtime) {
            const hours = Math.floor(pelicula.runtime / 60);
            const minutes = pelicula.runtime % 60;
            runtimeSection = `<p style="text-align:left;"><i class="fas fa-clock" style="color:var(--tmdb-light-blue);"></i> <strong>Duración:</strong> ${hours}h ${minutes}min</p>`;
        }

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
                
                if (pelicula.budget && pelicula.budget > 0) {
                    const profit = pelicula.revenue - pelicula.budget;
                    const profitFormatted = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(profit);
                    const profitColor = profit > 0 ? '#20b38e' : '#e85d30';
                    budgetRevenueSection += `<p style="text-align:left; margin:8px 0 0 0; color:${profitColor}; font-weight:600;"><strong>Beneficio:</strong> ${profitFormatted}</p>`;
                }
            }
            budgetRevenueSection += '</div>';
        }

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

        let castSection = '';
        if (pelicula.cast && Array.isArray(pelicula.cast) && pelicula.cast.length > 0) {
            const castList = pelicula.cast.slice(0, 8).map(actor => {
                const actorImage = actor.profile_path 
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : 'files/placeholder.png';
                return `<div class="cast-item">
                    <img src="${actorImage}" alt="${actor.name}" onerror="this.src='files/placeholder.png'" />
                    <div class="cast-name">${actor.name}</div>
                    ${actor.character ? `<div class="cast-character">${actor.character}</div>` : ''}
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

        return `
        <div class="modal-bg">
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
                    ${pelicula.generos && pelicula.generos.length > 0 ? `<p style="text-align:left;"><i class="fas fa-tags" style="color:var(--tmdb-light-blue);"></i> <strong>Géneros:</strong> ${pelicula.generos.map(g => `<span class="cast-badge">${g}</span>`).join(' ')}</p>` : ''}
                    ${budgetRevenueSection}
                    ${pelicula.resumen ? `<div style='margin:16px 0; padding:16px; background:#f9f9f9; border-radius:12px;'><p style='margin:0; color:#444; font-size:14px; text-align:left; line-height:1.7;'><strong><i class="fas fa-align-left" style="color:var(--tmdb-light-blue);"></i> Sinopsis:</strong><br><br>${pelicula.resumen}</p></div>` : ''}
                    ${trailerSection}
                    ${castSection}
                    ${reviewsSection}
                    <div class="actions" style="justify-content:flex-start; margin-top:28px; gap:12px;">
                        <button class="add-from-api" data-movie='${JSON.stringify(movieData).replace(/'/g, "&apos;")}'><i class="fas fa-plus"></i> Añadir a mi lista</button>
                        <button class="back-to-search"><i class="fas fa-arrow-left"></i> Volver a búsqueda</button>
                        <button class="index"><i class="fas fa-home"></i> Ir al inicio</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // Variable global para almacenar resultados de búsqueda
    let lastSearchResults = null;
    let lastSearchQuery = '';

    const suggestionClickContr = (ev) => {
        // Obtener el título de la película sugerida
        let target = ev.target;
        while (target && !target.classList.contains('suggestion-item')) {
            target = target.parentElement;
        }
        
        if (target && target.dataset.suggestionQuery) {
            const suggestionQuery = target.dataset.suggestionQuery;
            // Actualizar el input y realizar la búsqueda
            document.getElementById('search-query').value = suggestionQuery;
            searchContr();
        }
    }

    // ROUTER de eventos
    const matchEvent = (ev, sel) => ev.target.matches(sel)
    const myId = (ev) => Number(ev.target.dataset.myId)

    document.addEventListener('click', ev => {
        if      (matchEvent(ev, '.index'))               indexContr          ();
        else if (matchEvent(ev, '.edit'))                editContr           (myId(ev));
        else if (matchEvent(ev, '.update'))              updateContr         (myId(ev));
        else if (matchEvent(ev, '.show'))                showContr           (myId(ev));
        else if (matchEvent(ev, '.new'))                 newContr            ();
        else if (matchEvent(ev, '.create'))              createContr         ();
        else if (matchEvent(ev, '.delete'))              deleteContr         (myId(ev));
        else if (matchEvent(ev, '.reset'))               resetContr          ();
        else if (matchEvent(ev, '.search-view'))         searchViewContr     ();
        else if (matchEvent(ev, '.search'))              searchContr         ();
        else if (matchEvent(ev, '.add-from-api'))        addFromAPIContr     (ev);
        else if (matchEvent(ev, '.consult-from-api'))    consultFromAPIContr (ev);
        else if (matchEvent(ev, '.back-to-search'))      backToSearchContr   ();
        else if (matchEvent(ev, '.suggestion-item'))     suggestionClickContr(ev);
    })

    // Soporte para presionar Enter en el campo de búsqueda
    document.addEventListener('keypress', ev => {
        if (ev.key === 'Enter' && ev.target.id === 'search-query') {
            searchContr();
        }
    })
    
    
    // Inicialización        
    document.addEventListener('DOMContentLoaded', initContr);