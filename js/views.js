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
// This is complex and uses innerHTML for now, will be refactored in a future iteration
export const showView = (pelicula) => {
    // For now, using a simplified safe version - full refactoring would be extensive
    const container = document.createElement('div');
    container.className = 'modal-bg';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.maxWidth = '800px';
    
    // Title
    const title = document.createElement('h2');
    const filmIcon = document.createElement('i');
    filmIcon.className = 'fas fa-film';
    title.appendChild(filmIcon);
    title.appendChild(document.createTextNode(' ' + (pelicula.titulo || 'Sin título')));
    modal.appendChild(title);
    
    // Image
    const img = document.createElement('img');
    img.src = pelicula.miniatura;
    img.style.width = '100%';
    img.style.maxWidth = '300px';
    img.style.borderRadius = '12px';
    img.style.marginBottom = '20px';
    img.onerror = function() { this.src = 'files/placeholder.png'; };
    modal.appendChild(img);
    
    // Director and year
    if (pelicula.director || pelicula.año) {
        const info = document.createElement('p');
        info.style.textAlign = 'left';
        
        if (pelicula.director) {
            const dirIcon = document.createElement('i');
            dirIcon.className = 'fas fa-user-tie';
            dirIcon.style.color = 'var(--tmdb-light-blue)';
            info.appendChild(dirIcon);
            info.appendChild(document.createTextNode(' '));
            const strong = document.createElement('strong');
            strong.textContent = 'Director: ';
            info.appendChild(strong);
            info.appendChild(document.createTextNode(pelicula.director));
        }
        
        if (pelicula.año) {
            if (pelicula.director) {
                info.appendChild(document.createElement('br'));
            }
            const yearIcon = document.createElement('i');
            yearIcon.className = 'fas fa-calendar';
            yearIcon.style.color = 'var(--tmdb-light-blue)';
            info.appendChild(yearIcon);
            info.appendChild(document.createTextNode(' '));
            const strong = document.createElement('strong');
            strong.textContent = 'Año: ';
            info.appendChild(strong);
            info.appendChild(document.createTextNode(pelicula.año));
        }
        
        modal.appendChild(info);
    }
    
    // Back button
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'actions';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'index';
    const backIcon = document.createElement('i');
    backIcon.className = 'fas fa-arrow-left';
    backBtn.appendChild(backIcon);
    backBtn.appendChild(document.createTextNode(' Volver'));
    
    buttonContainer.appendChild(backBtn);
    modal.appendChild(buttonContainer);
    
    container.appendChild(modal);
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
