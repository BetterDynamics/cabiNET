// Select DOM elements
const navIcons = document.querySelectorAll('.nav-icon');
const pages = document.querySelectorAll('.page-content');
const subNavBar = document.querySelector('.sub-nav-bar');
const contentPane = document.querySelector('.content-pane');

// Initially hide the sub-nav-bar
subNavBar.classList.add('hidden');

function toggleSubNavVisibility(show) {
    if (show) {
        subNavBar.classList.remove('hidden');
        subNavBar.offsetHeight; // Trigger reflow
        subNavBar.classList.add('visible');
    } else {
        subNavBar.classList.remove('visible');
        
        setTimeout(() => {
            if (!subNavBar.classList.contains('visible')) {
                subNavBar.classList.add('hidden');
            }
        }, 300);
    }
}

function updateActivePage(pageId) {
    // First, hide all content
    pages.forEach(page => {
        page.classList.remove('active');
    });

    if (pageId === 'home') {
        toggleSubNavVisibility(false);
    } else {
        toggleSubNavVisibility(true);
    }

    // Show sub-nav-bar for all pages except home
    if (pageId === 'home') {
        subNavBar.classList.add('hidden');
    } else {
        subNavBar.classList.remove('hidden');
    }

    if (pageId === 'projects') {
        subNavBar.classList.add('hidden');
    } else {
        subNavBar.classList.remove('hidden');
    }

    if (pageId === 'architecture') {
        document.querySelector('#bookmarks').classList.add('active');
    } else {
        document.querySelector('#architecture').classList.remove('active');
    }

    // Handle bookmarks section
    if (pageId === 'bookmarks' || pageId === 'architecture' || pageId === 'design') {
        document.querySelector('#bookmarks').classList.add('active');
    }

    // Handle specific page content
    const targetPage = document.querySelector(`#${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Show corresponding content in both sub-nav-bar and content-pane
    const subNavContent = subNavBar.querySelector(`#${pageId}`);
    const mainContent = contentPane.querySelector(`#${pageId}`);
    
    if (subNavContent) {
        subNavContent.classList.add('active');
    }
    
    if (mainContent) {
        mainContent.classList.add('active');
    }
}

// Add click event listener to each nav icon
navIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = icon.getAttribute('data-page');
        if (pageId) {
            updateActivePage(pageId);
            history.pushState({}, pageId, `#${pageId}`);
        }
    });
});

// Handle browser navigation
window.addEventListener('popstate', () => {
    const pageId = window.location.hash.slice(1) || 'home';
    updateActivePage(pageId);
});

// Initialize page on load
window.dispatchEvent(new Event('popstate'));

console.log("current ")

// Add necessary CSS
const style = document.createElement('style');
style.textContent = `
    .sub-nav-bar {
        transform-origin: left;
        transition: all 0.5s cubic-bezier(0.2, 0, 0, 1);
        opacity: 0;
        transform: translateX(-20px);
        visibility: visible;
    }

    .sub-nav-bar.visible {
        opacity: 1;
        transform: translateX(0);
        visibility: visible;
    }

    .sub-nav-bar .page-content {
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.5s cubic-bezier(0.2, 0, 0, 1);
        transition-delay: 0.1s;
    }

    .page-content.active {
        opacity: 1;
        transform: translateY(0);
    }

    .home-content{
        
    }

    .extension-download {
        margin-top: 20px;
    }

    .hidden {
        display: none;
    }
    
    .page-content {
        display: none;
    }
    
    .page-content.active {
        display: block;
    }
`;
document.head.appendChild(style);