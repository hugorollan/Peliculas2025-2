// MODELO DE DATOS

    // API Key de TMDb
    const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTgxNWVjZTI4ZjcyNWJlZGRmY2Y3OGE0YzRjZGU0ZiIsIm5iZiI6MTc2MDQ1NjUxNS4xNDcsInN1YiI6IjY4ZWU2ZjQzNDYzMzQ0Yjg0MTlkZjQ3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ejdXz4pm0dZn0OAVJvJ16R8SwNAa-MBkO_yttUiblLk';

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
            view += `<div style='color:#888; margin:20px 0;'>No hay películas</div>`;
        }
        while(i < peliculas.length) {
            view += `
            <div class="movie">
                <div class="movie-img">
                    <img src="${peliculas[i].miniatura}" onerror="this.src='files/placeholder.png'"/>
                </div>
                <div class="title">
                    ${peliculas[i].titulo || "<em>Sin título</em>"}
                </div>
                <div style="text-align:center; font-size:12px; color:#666; margin-bottom:6px;">
                    ${peliculas[i].año ? `Año: ${peliculas[i].año}` : ""}
                </div>
                <div class="actions">
                    <button class="show" data-my-id="${i}">ver</button>
                    <button class="edit" data-my-id="${i}">editar</button>
                    <button class="delete" data-my-id="${i}">borrar</button>
                </div>
            </div>\n`;
            i = i + 1;
        }
        return view;
    }

    const editView = (i, pelicula) => {
        return `
        <div class="modal-bg">
          <div class="modal">
            <h2>Editar Película</h2>
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
                <button class="update" data-my-id="${i}">Actualizar</button>
                <button class="index">Volver</button>
            </div>
          </div>
        </div>`;
    }

    const showView = (pelicula) => {
        // Círculo de puntuación SVG
        let ratingCircle = '';
        if (typeof pelicula.rating === 'number' && !isNaN(pelicula.rating)) {
            const percent = Math.max(0, Math.min(100, Math.round(pelicula.rating * 10)));
            const radius = 22;
            const stroke = 6;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference * (1 - percent / 100);
            ratingCircle = `
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                    <svg width="50" height="50" style="display:block;">
                        <circle cx="25" cy="25" r="${radius}" stroke="#eee" stroke-width="${stroke}" fill="none" />
                        <circle cx="25" cy="25" r="${radius}" stroke="#20b38e" stroke-width="${stroke}" fill="none" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" style="transition:stroke-dashoffset 0.6s;" />
                        <text x="25" y="30" text-anchor="middle" font-size="13" fill="#222" font-weight="bold">${percent}%</text>
                    </svg>
                    <span style="font-size:0.95rem; color:#20b38e; font-weight:600;">Puntuación usuarios</span>
                </div>
            `;
        }

        // Mostrar tagline si está disponible
        let taglineSection = '';
        if (pelicula.tagline) {
            taglineSection = `<p style="font-style:italic; color:#666; font-size:15px; margin-bottom:16px; text-align:left;">"${pelicula.tagline}"</p>`;
        }

        // Mostrar duración si está disponible
        let runtimeSection = '';
        if (pelicula.runtime) {
            const hours = Math.floor(pelicula.runtime / 60);
            const minutes = pelicula.runtime % 60;
            runtimeSection = `<p style="text-align:left;"><strong>Duración:</strong> ${hours}h ${minutes}min (${pelicula.runtime} minutos)</p>`;
        }

        // Mostrar presupuesto y recaudación si están disponibles
        let budgetRevenueSection = '';
        if (pelicula.budget || pelicula.revenue) {
            budgetRevenueSection = '<div style="margin-top:12px;">';
            if (pelicula.budget && pelicula.budget > 0) {
                const budgetFormatted = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pelicula.budget);
                budgetRevenueSection += `<p style="text-align:left;"><strong>Presupuesto:</strong> ${budgetFormatted}</p>`;
            }
            if (pelicula.revenue && pelicula.revenue > 0) {
                const revenueFormatted = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pelicula.revenue);
                budgetRevenueSection += `<p style="text-align:left;"><strong>Recaudación:</strong> ${revenueFormatted}</p>`;
            }
            budgetRevenueSection += '</div>';
        }

        // Mostrar trailer si está disponible
        let trailerSection = '';
        if (pelicula.trailerKey) {
            trailerSection = `
                <div style="margin-top:20px;">
                    <p style="font-weight:600; margin-bottom:12px; text-align:left;"><strong>🎬 Trailer:</strong></p>
                    <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.3);">
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
                <div style="margin-top:16px;">
                    <p style="font-weight:600; margin-bottom:12px; text-align:left;"><strong>Reparto:</strong></p>
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
                const ratingBadge = review.rating ? `<span style="background:#20b38e; color:white; padding:2px 8px; border-radius:12px; font-size:12px; font-weight:600;">⭐ ${review.rating}/10</span>` : '';
                const date = review.created_at ? new Date(review.created_at).toLocaleDateString('es-ES') : '';
                const truncatedContent = review.content.length > 300 ? review.content.substring(0, 300) + '...' : review.content;
                return `
                    <div style="background:#f9f9f9; padding:16px; border-radius:8px; margin-bottom:12px; border-left:4px solid #01b4e4;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <strong style="color:#032541;">${review.author}</strong>
                            ${ratingBadge}
                        </div>
                        ${date ? `<div style="font-size:12px; color:#888; margin-bottom:8px;">${date}</div>` : ''}
                        <p style="color:#444; font-size:13px; line-height:1.6; margin:0;">${truncatedContent}</p>
                    </div>
                `;
            }).join('');
            reviewsSection = `
                <div style="margin-top:20px;">
                    <p style="font-weight:600; margin-bottom:12px; text-align:left;"><strong>📝 Reseñas de usuarios:</strong></p>
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
                    <h2 style="margin-top:0; margin-bottom:16px; text-align:left;">${pelicula.titulo || "<em>Sin título</em>"}</h2>
                    ${taglineSection}
                    <p style="text-align:left;"><strong>Director:</strong> ${pelicula.director || "<em>Sin director</em>"}</p>
                    <p style="text-align:left;"><strong>Año:</strong> ${pelicula.año || "<em>Sin año</em>"}</p>
                    ${runtimeSection}
                    ${ratingCircle}
                    ${pelicula.generos && pelicula.generos.length > 0 ? `<p style="text-align:left;"><strong>Géneros:</strong> ${pelicula.generos.join(', ')}</p>` : ''}
                    ${budgetRevenueSection}
                    ${pelicula.resumen ? `<p style='margin:12px 0; color:#444; font-size:14px; text-align:left; line-height:1.6;'><strong>Resumen:</strong> ${pelicula.resumen}</p>` : ''}
                    ${trailerSection}
                    ${castSection}
                    ${reviewsSection}
                    <div class="actions" style="justify-content:flex-start; margin-top:20px;">
                        <button class="index">Volver</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    const newView = () => {
        return `
        <div class="modal-bg">
          <div class="modal">
            <h2>Crear Película</h2>
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
                <button class="create">Crear</button>
                <button class="index">Volver</button>
            </div>
          </div>
        </div>`;
    }

    const searchView = () => {
        return `
        <div class="modal-bg">
          <div class="modal">
            <h2>Buscar Película en TMDb</h2>
            <div class="field">
                Título de la película <br>
                <input type="text" id="search-query" placeholder="Ej: Inception">
            </div>
            <div class="actions">
                <button class="search">Buscar</button>
                <button class="index">Volver</button>
            </div>
          </div>
        </div>`;
    }

    const resultsView = (resultados) => {
        let view = `
        <div style="width: 100%; padding: 20px;">
            <h2 style="text-align: center; color: white; font-size: 28px; margin-bottom: 30px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Resultados de la búsqueda</h2>`;
        
        if (!resultados || resultados.length === 0) {
            view += `<div style='color: #90cea1; margin:20px 0; text-align: center; font-size: 16px;'>No se encontraron películas</div>`;
        } else {
            view += `<div style="display: flex; flex-wrap: wrap; gap: 24px; justify-content: center;">`;
            resultados.forEach(pelicula => {
                const posterUrl = pelicula.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
                    : 'files/placeholder.png';
                const releaseYear = pelicula.release_date ? pelicula.release_date.split('-')[0] : 'N/A';
                const rating = pelicula.vote_average ? pelicula.vote_average.toFixed(1) : 'N/A';
                
                view += `
                <div class="movie">
                    <div class="movie-img">
                        <img src="${posterUrl}" onerror="this.src='files/placeholder.png'"/>
                    </div>
                    <div class="title">${pelicula.title || "<em>Sin título</em>"}</div>
                    <div style="display: flex; justify-content: space-around; padding: 8px 10px; font-size: 12px; color: #666;">
                        <span>⭐ ${rating}</span>
                        <span>📅 ${releaseYear}</span>
                    </div>
                    <div class="actions">
                        <button class="add-from-api" data-movie='${JSON.stringify(pelicula).replace(/'/g, "&apos;")}'>Añadir</button>
                    </div>
                </div>`;
            });
            view += `</div>`;
        }
        
        view += `
            <div style="text-align: center; margin-top: 30px;">
                <button class="index">Volver al inicio</button>
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

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${TMDB_API_KEY}`
            }
        };

        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=es-ES`, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.results) {
                document.getElementById('main').innerHTML = resultsView(data.results);
            } else {
                alert('No se encontraron resultados');
            }
        } catch (err) {
            console.error(err);
            alert('Error al buscar películas. Por favor, intenta de nuevo.');
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

            try {
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${TMDB_API_KEY}`
                    }
                };

                // Obtener detalles completos de la película
                const detailsRes = await fetch(`https://api.themoviedb.org/3/movie/${movieData.id}?language=es-ES&append_to_response=credits,videos,reviews`, options);
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
                        const trailer = detailsData.videos.results.find(v => 
                            v.type === 'Trailer' && v.site === 'YouTube'
                        );
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
                tagline: tagline
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

    // ROUTER de eventos
    const matchEvent = (ev, sel) => ev.target.matches(sel)
    const myId = (ev) => Number(ev.target.dataset.myId)

    document.addEventListener('click', ev => {
        if      (matchEvent(ev, '.index'))        indexContr       ();
        else if (matchEvent(ev, '.edit'))         editContr        (myId(ev));
        else if (matchEvent(ev, '.update'))       updateContr      (myId(ev));
        else if (matchEvent(ev, '.show'))         showContr        (myId(ev));
        else if (matchEvent(ev, '.new'))          newContr         ();
        else if (matchEvent(ev, '.create'))       createContr      ();
        else if (matchEvent(ev, '.delete'))       deleteContr      (myId(ev));
        else if (matchEvent(ev, '.reset'))        resetContr       ();
        else if (matchEvent(ev, '.search-view'))  searchViewContr  ();
        else if (matchEvent(ev, '.search'))       searchContr      ();
        else if (matchEvent(ev, '.add-from-api')) addFromAPIContr  (ev);
    })

    // Soporte para presionar Enter en el campo de búsqueda
    document.addEventListener('keypress', ev => {
        if (ev.key === 'Enter' && ev.target.id === 'search-query') {
            searchContr();
        }
    })
    
    
    // Inicialización        
    document.addEventListener('DOMContentLoaded', initContr);