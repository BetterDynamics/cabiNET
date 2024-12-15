
    
const navIcons = document.querySelectorAll('.nav-icon');
const pages = document.querySelectorAll('.page-content');

function updateActivePage(pageId) {
    pages.forEach(page => {
        page.classList.toggle('active', page.id === pageId);
    });
}

        // Add click event listener to each nav icon
navIcons.forEach(item => {
    item.addEventListener('click', () => {
        const pageId = item.getAttribute('data-page');
        if (pageId) {
            updateActivePage(pageId);
            history.pushState({}, pageId, `#${pageId}`);
        }
    });
});

window.addEventListener('popstate', () => {
    const pageId = window.location.hash.slice(1) || 'home';
    updateActivePage(pageId);
});


window.dispatchEvent(new Event('popstate'));