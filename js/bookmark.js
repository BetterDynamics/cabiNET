// Create a new file: bookmarks.js

class BookmarkManager {
    constructor() {
        this.bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
        this.categories = JSON.parse(localStorage.getItem('categories')) || {};
        
        this.initializeElements();
        this.bindEvents();
        this.renderCategories();
    }

    initializeElements() {
        this.urlInput = document.getElementById('bookmarkUrl');
        this.saveButton = document.getElementById('saveBookmark');
        this.errorDiv = document.getElementById('bookmarkError');
        this.categoriesContainer = document.getElementById('bookmarkCategories');
        this.bookmarkModal = new bootstrap.Modal(document.getElementById('bookmarkModal'));
        this.confirmButton = document.getElementById('confirmBookmark');
        this.titleInput = document.getElementById('bookmarkTitle');
        this.categoryInput = document.getElementById('bookmarkCategory');
    }

    bindEvents() {
        this.saveButton.addEventListener('click', () => this.handleSaveBookmark());
        this.confirmButton.addEventListener('click', () => this.confirmSaveBookmark());
    }

    async handleSaveBookmark() {
        const url = this.urlInput.value.trim();
        
        if (!url) {
            this.showError('Please enter a URL');
            return;
        }

        if (!this.isValidUrl(url)) {
            this.showError('Please enter a valid URL');
            return;
        }

        try {
            this.saveButton.disabled = true;
            this.saveButton.innerHTML = '<i class="bi bi-hourglass"></i> Saving...';
            
            const category = await this.categorizeUrl(url);
            const title = await this.fetchPageTitle(url);
            
            // Show modal with details
            this.titleInput.value = title;
            this.categoryInput.value = category;
            this.bookmarkModal.show();
            
        } catch (error) {
            this.showError('Failed to process the URL. Please try again.');
        } finally {
            this.saveButton.disabled = false;
            this.saveButton.innerHTML = '<i class="bi bi-plus"></i> Save';
        }
    }

    async confirmSaveBookmark() {
        const url = this.urlInput.value;
        const title = this.titleInput.value;
        const category = this.categoryInput.value;

        // Add category if it's new
        if (!this.categories.includes(category)) {
            this.categories.push(category);
            localStorage.setItem('categories', JSON.stringify(this.categories));
        }

        // Save bookmark
        if (!this.bookmarks[category]) {
            this.bookmarks[category] = [];
        }

        this.bookmarks[category].push({
            url,
            title,
            date: new Date().toISOString()
        });

        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
        
        // Update UI
        this.renderCategories();
        this.urlInput.value = '';
        this.bookmarkModal.hide();
    }

    async categorizeUrl(url) {
        try {
            // Replace with your Klazify API endpoint
            const response = await fetch('YOUR_BACKEND_ENDPOINT/categorize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error('Failed to categorize URL');
            }

            const data = await response.json();
            return data.category || 'Uncategorized';
            
        } catch (error) {
            // Fallback: Simple domain-based categorization
            const domain = new URL(url).hostname;
            
            if (domain.includes('github') || domain.includes('stackoverflow')) {
                return 'Development';
            } else if (domain.includes('behance') || domain.includes('dribbble')) {
                return 'Design';
            } else if (domain.includes('edu')) {
                return 'Education';
            }
            
            return 'Uncategorized';
        }
    }

    async fetchPageTitle(url) {
        try {
            // In a real implementation, this would be a backend call to fetch the page title
            // For now, we'll extract from the URL
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (error) {
            return url;
        }
    }

    renderCategories() {
        const categoriesHtml = this.categories.map(category => {
            const categoryBookmarks = this.bookmarks[category] || [];
            const bookmarksHtml = categoryBookmarks.map(bookmark => `
                <li class="bookmark-item">
                    <i class="bi bi-bookmark"></i>
                    <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
                    <button class="btn btn-sm btn-danger delete-bookmark" 
                            data-category="${category}" 
                            data-url="${bookmark.url}">
                        <i class="bi bi-trash"></i>
                    </button>
                </li>
            `).join('');

            return `
                <li class="category-item">
                    <img src="../assets/folder.png" class="nav-icon">
                    <span>${category}</span>
                    <ul class="bookmark-list">
                        ${bookmarksHtml}
                    </ul>
                </li>
            `;
        }).join('');

        this.categoriesContainer.innerHTML = `
            <li>All Bookmarks</li>
            ${categoriesHtml}
        `;

        // Add delete event listeners
        document.querySelectorAll('.delete-bookmark').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                const url = e.target.dataset.url;
                this.deleteBookmark(category, url);
            });
        });
    }

    deleteBookmark(category, url) {
        this.bookmarks[category] = this.bookmarks[category].filter(b => b.url !== url);
        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
        this.renderCategories();
    }

    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.style.display = 'block';
        setTimeout(() => {
            this.errorDiv.style.display = 'none';
        }, 3000);
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

// Initialize the bookmark manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BookmarkManager();
});