// MAIN - Entry point and event router
// This module initializes the application and routes all events to appropriate controllers

import * as controllers from './controllers.js';

// Router function - delegates events to controllers
const router = (ev) => {
    // Get event target
    let target = ev.target;
    
    // Handle different button types
    if (target.classList.contains('index')) {
        controllers.indexContr();
    }
    else if (target.classList.contains('show')) {
        controllers.showContr(parseInt(target.dataset.myId));
    }
    else if (target.classList.contains('new')) {
        controllers.newContr();
    }
    else if (target.classList.contains('create')) {
        controllers.createContr();
    }
    else if (target.classList.contains('edit')) {
        controllers.editContr(parseInt(target.dataset.myId));
    }
    else if (target.classList.contains('update')) {
        controllers.updateContr(parseInt(target.dataset.myId));
    }
    else if (target.classList.contains('delete')) {
        controllers.deleteContr(parseInt(target.dataset.myId));
    }
    else if (target.classList.contains('reset')) {
        controllers.resetContr();
    }
    else if (target.classList.contains('search-view')) {
        controllers.searchViewContr();
    }
    else if (target.classList.contains('search')) {
        controllers.searchContr();
    }
    else if (target.classList.contains('add-from-api')) {
        controllers.addFromAPIContr(ev);
    }
    else if (target.classList.contains('consult-from-api')) {
        controllers.consultFromAPIContr(ev);
    }
    else if (target.classList.contains('back-to-search')) {
        controllers.backToSearchContr();
    }
    else if (target.classList.contains('suggestion-item')) {
        controllers.suggestionClickContr(ev);
    }
    // Auth related buttons
    else if (target.classList.contains('auth-login')) {
        controllers.showAuthContr(true);
    }
    else if (target.classList.contains('auth-logout')) {
        controllers.logoutContr();
    }
    else if (target.classList.contains('auth-toggle')) {
        controllers.authToggleContr(ev);
    }
    // Check if target is inside a button (e.g., icon inside button)
    else if (target.parentElement && target.parentElement.tagName === 'BUTTON') {
        // Trigger click on parent button
        target.parentElement.click();
    }
};

// Form submission handler
const handleFormSubmit = (ev) => {
    if (ev.target.classList.contains('auth-form')) {
        controllers.authSubmitContr(ev);
    }
};

// Keyboard event handler for search
const handleKeyPress = (ev) => {
    if (ev.key === 'Enter') {
        const target = ev.target;
        if (target.id === 'search-query') {
            controllers.searchContr();
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Add main click event listener
    document.addEventListener('click', router);
    
    // Add form submit listener
    document.addEventListener('submit', handleFormSubmit);
    
    // Add keyboard event listener
    document.addEventListener('keypress', handleKeyPress);
    
    // Initialize the application
    controllers.initContr();
});

// Export for testing purposes
export { router, handleFormSubmit, handleKeyPress };
