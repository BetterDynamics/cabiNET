document.addEventListener('DOMContentLoaded', async () => {
    // Initialize database
    await DatabaseService.init();

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    document.getElementById('title').value = tab.title || '';
    
    document.getElementById('save').addEventListener('click', async () => {
        const bookmark = {
            url: tab.url,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            fave_icon: tab.favIconUrl || null,
            document_id: null,
            tags: document.getElementById('tags').value
        };

        try {
            await DatabaseService.addBookmark(bookmark);

            const status = document.createElement('div');
            status.textContent = 'Bookmark saved successfully!';
            status.style.color = 
        }
    });
});