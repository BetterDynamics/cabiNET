
    
const navIcons = document.querySelectorAll('.nav-icon');
const pages = document.querySelectorAll('.page-content');

        // Add click event listener to each nav icon
navIcons.forEach(item => {
    item.addEventListener('click', () => {
        navIcons.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        pages.forEach(page => page.classList.remove('active'));
        const pageId = item.getAttribute('data-page');
        document.getElementById(pageId).classList.add('active');
        history.pushState({}, pageId, `#${pageId}`);
    });
});

window.addEventListener('popstate', () => {
    const pageId = window.location.hash.slice(1) || 'home';

    navIcons.forEach(nav => {
        nav.classList.toggle('active', nav.getAttribute('data-page') === pageId);
    });
});

window.dispatchEvent(new Event('popstate'));