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
        const title = type === 'anuncio' ? 'Agregar Anuncio' : type === 'curso' ? 'Agregar Curso' : 'Agregar al Repertorio';
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
        // Aquí se puede guardar en la base de datos
        if (this.currentType === 'repertorio') {
            repertorioManager.saveItem(data);
        }
        this.showSuccessMessage();
        this.close();
    }
    showSuccessMessage() {
        const message = this.currentType === 'anuncio' 
            ? 'Anuncio agregado exitosamente' 
            : this.currentType === 'curso'
            ? 'Curso agregado exitosamente'
            : 'Mensaje agregado al repertorio';
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

// Nuevo: Repertorio Manager
class RepertorioManager {
    constructor() {
        this.repertorioContent = document.getElementById('repertorioContent');
        this.items = this.loadItems();
        this.render();
        this.init();
    }
    init() {
        // Puede agregar eventos si quieres, por ejemplo botón para limpiar todo
    }
    loadItems() {
        const items = localStorage.getItem('repertorio');
        return items ? JSON.parse(items) : [];
    }
    saveItem(item) {
        this.items.push(item);
        localStorage.setItem('repertorio', JSON.stringify(this.items));
        this.render();
    }
    render() {
        if (!this.repertorioContent) return;
        if (this.items.length === 0) {
            this.repertorioContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-pencil-alt empty-icon"></i>
                    <p class="empty-message">No hay mensajes en tu repertorio</p>
                </div>
            `;
            return;
        }
        this.repertorioContent.innerHTML = this.items.map(item => `
            <div class="content-item">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <small>${new Date(item.created_at).toLocaleDateString()}</small>
            </div>
        `).join('');
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
        console.log('Searching for:', query);
    }
    performSearch(query) {
        if (query.trim() === '') return;
        console.log('Performing search for:', query);
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
        console.log('Loading content from database...');
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
let repertorioManager; // Declaración global para el modal
class App {
    constructor() {
        this.themeManager = new ThemeManager();
        this.modalManager = new ModalManager();
        this.searchManager = new SearchManager();
        this.contentManager = new ContentManager();
        repertorioManager = new RepertorioManager();
        this.init();
    }
    init() {
        this.bindEvents();
        this.initializeProfileActions();
    }
    bindEvents() {
        document.getElementById('addAnuncio').addEventListener('click', () => {
            this.modalManager.open('anuncio');
        });
        document.getElementById('addCurso').addEventListener('click', () => {
            this.modalManager.open('curso');
        });
        // Nuevo: botón para agregar al repertorio
        document.getElementById('addRepertorio').addEventListener('click', () => {
            this.modalManager.open('repertorio');
        });
        document.querySelector('.edit-btn').addEventListener('click', () => {
            console.log('Edit profile clicked');
        });
    }
    initializeProfileActions() {
        const userProfile = document.querySelector('.user-profile');
        const buttons = document.querySelectorAll('.add-btn');
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
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
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
    .content-item h4 { color: var(--text-primary); margin-bottom: 0.5rem; }
    .content-item p { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem; }
    .content-item small { color: var(--text-muted); font-size: 0.8rem; }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new App();
});

window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('Service Worker support detected');
    });
}

// Logout Button Management
class LogoutManage{
    constructor(){}
}

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
        this.profileImage.addEventListener('click', () => {
            this.handleProfileClick();
        });
        this.profileImage.addEventListener('error', () => {
            this.handleImageError();
        });
    }
    handleProfileClick() {
        console.log('Profile photo clicked');
        this.showProfileMessage();
    }
    handleImageError() {
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

class MensajeriaManager {
    constructor() {
        this.mensajesContent = document.getElementById('mensajesContent');
        this.sendMessageForm = document.getElementById('sendMessageForm');
        this.mensajes = this.loadMensajes();
        this.bindEvents();
        this.render();
    }
    bindEvents() {
        this.sendMessageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSendMessage();
        });
    }
    loadMensajes() {
        const mensajes = localStorage.getItem('mensajes');
        return mensajes ? JSON.parse(mensajes) : [];
    }
    saveMensajes() {
        localStorage.setItem('mensajes', JSON.stringify(this.mensajes));
    }
    handleSendMessage() {
        const recipient = this.sendMessageForm.recipient.value.trim();
        const messageText = this.sendMessageForm.messageText.value.trim();
        if (!recipient || !messageText) return;
        const nuevoMensaje = {
            sender: window.usuarioActual || "yo", // Puedes usar el nombre de sesión PHP aquí
            recipient,
            text: messageText,
            created_at: new Date().toISOString()
        };
        this.mensajes.push(nuevoMensaje);
        this.saveMensajes();
        this.sendMessageForm.reset();
        this.render();
    }
    render() {
        if (this.mensajes.length === 0) {
            this.mensajesContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments empty-icon"></i>
                    <p class="empty-message">No hay mensajes aún</p>
                </div>
            `;
            return;
        }
        this.mensajesContent.innerHTML = this.mensajes.map(msg => `
            <div class="content-item">
                <strong>De:</strong> ${msg.sender} <strong>Para:</strong> ${msg.recipient}<br>
                <p>${msg.text}</p>
                <small>${new Date(msg.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    }
}

