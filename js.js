// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateToggleIcon(theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    updateToggleIcon(theme) {
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            this.themeToggle.title = 'Cambiar a tema claro';
        } else {
            icon.className = 'fas fa-moon';
            this.themeToggle.title = 'Cambiar a tema oscuro';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
}

// Modal Management
class ModalManager {
    constructor() {
        this.modal = document.getElementById('addModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.closeBtn = document.getElementById('closeModal');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.addForm = document.getElementById('addForm');
        this.currentType = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    open(type) {
        this.currentType = type;
        const title = type === 'anuncio' ? 'Agregar Anuncio' : 'Agregar Curso';
        this.modalTitle.textContent = title;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.addForm.reset();
        this.currentType = null;
    }

    bindEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.cancelBtn.addEventListener('click', () => this.close());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });

        this.addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = new FormData(this.addForm);
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            type: this.currentType,
            created_at: new Date().toISOString()
        };

        // Here we would normally send data to the database
        // For now, we'll show a success message and close the modal
        console.log('Data to be saved:', data);
        
        // TODO: Integrate with MySQL database
        // DatabaseManager.saveItem(data);
        
        this.showSuccessMessage();
        this.close();
    }

    showSuccessMessage() {
        const message = this.currentType === 'anuncio' 
            ? 'Anuncio agregado exitosamente' 
            : 'Curso agregado exitosamente';
        
        // Create temporary success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Search Functionality
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(e.target.value);
            }
        });

        document.querySelector('.search-btn').addEventListener('click', () => {
            this.performSearch(this.searchInput.value);
        });
    }

    handleSearch(query) {
        // Real-time search functionality placeholder
        // TODO: Integrate with database search
        console.log('Searching for:', query);
    }

    performSearch(query) {
        if (query.trim() === '') return;
        
        console.log('Performing search for:', query);
        // TODO: Implement database search functionality
        // DatabaseManager.search(query);
    }
}

// Content Management
class ContentManager {
    constructor() {
        this.anunciosContent = document.getElementById('anunciosContent');
        this.cursosContent = document.getElementById('cursosContent');
        this.init();
    }

    init() {
        this.loadContent();
    }

    loadContent() {
        // TODO: Load content from MySQL database
        // For now, we'll keep the empty state
        console.log('Loading content from database...');
        
        // DatabaseManager.getAnuncios().then(anuncios => {
        //     this.renderAnuncios(anuncios);
        // });
        
        // DatabaseManager.getCursos().then(cursos => {
        //     this.renderCursos(cursos);
        // });
    }

    renderAnuncios(anuncios) {
        if (anuncios.length === 0) {
            this.anunciosContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bullhorn empty-icon"></i>
                    <p class="empty-message">No hay anuncios disponibles</p>
                </div>
            `;
            return;
        }

        // Render anuncios
        this.anunciosContent.innerHTML = anuncios.map(anuncio => `
            <div class="content-item">
                <h4>${anuncio.title}</h4>
                <p>${anuncio.description}</p>
                <small>${new Date(anuncio.created_at).toLocaleDateString()}</small>
            </div>
        `).join('');
    }

    renderCursos(cursos) {
        if (cursos.length === 0) {
            this.cursosContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-graduation-cap empty-icon"></i>
                    <p class="empty-message">No hay cursos disponibles</p>
                </div>
            `;
            return;
        }

        // Render cursos
        this.cursosContent.innerHTML = cursos.map(curso => `
            <div class="content-item">
                <h4>${curso.title}</h4>
                <p>${curso.description}</p>
                <small>${new Date(curso.created_at).toLocaleDateString()}</small>
            </div>
        `).join('');
    }

}

// Application Initialization
class App {
    constructor() {
        this.themeManager = new ThemeManager();
        this.modalManager = new ModalManager();
        this.searchManager = new SearchManager();
        this.contentManager = new ContentManager();
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeProfileActions();
    }

    bindEvents() {
        // Add button event listeners
        document.getElementById('addAnuncio').addEventListener('click', () => {
            this.modalManager.open('anuncio');
        });

        document.getElementById('addCurso').addEventListener('click', () => {
            this.modalManager.open('curso');
        });

        // Profile edit button (placeholder)
        document.querySelector('.edit-btn').addEventListener('click', () => {
            console.log('Edit profile clicked');
            // TODO: Implement profile editing functionality
        });
    }

    initializeProfileActions() {
        // Add smooth animations and interactions
        const userProfile = document.querySelector('.user-profile');
        const buttons = document.querySelectorAll('.add-btn');

        // Add hover effects programmatically
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
        });
    }
}

// CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .content-item {
        background: var(--bg-primary);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }

    .content-item:hover {
        box-shadow: 0 2px 8px var(--shadow-light);
        transform: translateY(-2px);
    }

    .content-item h4 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }

    .content-item p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .content-item small {
        color: var(--text-muted);
        font-size: 0.8rem;
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // TODO: Register service worker for offline functionality
        console.log('Service Worker support detected');
    });
}
// Logout Button Management
class LogoutManage{
    constructor(){
    }
}
//Hadle logout button click
// Profile Photo Management
class ProfilePhotoManager {
    constructor() {
        this.profileImage = document.querySelector('.profile-image');
        this.init();
    }
    init() {
        this.bindEvents();
    }
    bindEvents() {
        // Handle profile photo click
        this.profileImage.addEventListener('click', () => {
            this.handleProfileClick();
        });
        // Handle profile photo error (if image fails to load)
this.profileImage.addEventListener('error', () => {
            this.handleImageError();
        });
    }
    handleProfileClick() {
        console.log('Profile photo clicked');
        // TODO: Implement profile photo functionality (e.g., open profile modal, change photo)
        // For now, show a placeholder message
        this.showProfileMessage();
    }
    handleImageError() {
        // Fallback to default avatar if image fails to load
        this.profileImage.src = 'https://via.placeholder.com/40x40/4a69bd/ffffff?text=U';
}
    showProfileMessage() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-blue);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = 'Perfil de usuario';
document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}
