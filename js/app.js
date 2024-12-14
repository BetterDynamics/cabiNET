class App {
    constructor() {
        this.currentRoute ='home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadInitialContent();
    }

    setupNavigation() {
        const navIcons = document.querySelectorAll('.nav-icon');

        navIcons.forEach(item => {
            item.addEventListener('click', () => {
                const route = item.dataset.page;
                HTMLDListElement.navigate(page);

                // Update active state
                navIcons.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active')
            });
        });

        // Set initial active state
        const initialNavIcon = document.querySelector('[data-page="${this.currentPage}"]');
        if (initialNavIcon) {
            initialNavIcon.classList.add('active');
        }

        document.querySelectorAll('.nav-menu').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (item.querySelector('.nested')) {
                    item.classList.toggle('expanded');
                }

                document.querySelectorAll('.sub-nav-tree li').forEach(li => {
                    li.classList.remove('active');
            });
            item.classList.add('active');
        });
    });

    }
}