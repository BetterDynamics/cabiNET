
    
const navIcons = document.querySelectorAll('.nav-icon');
const pages = document.querySelectorAll('.page-content');

function updateActivePage(pageId) {
    pages.forEach(page => {
        page.classList.toggle('active', page.id === pageId);
    });

    if (pageId === 'calendar') {
        document.querySelector('#calendar-content').classList.add('active');
    } else {
        document.querySelector('#calendar-content').classList.remove('active');
    }
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

console.log("Current Page ID: ", pageID);
console.log("All Pages: ", pages);