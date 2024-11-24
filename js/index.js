const form = document.querySelector('form');
const bookmark = document.querySelector('#bookmark');
const bookmarksFilePath = "bookmarks_10_2_24.html"
const cabDB = "CabinetDB";
const storeName = "bookmarks";
let db;

function initDB() {
    const request = indexedDB.open(cabDB, 4);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        // Create an object store for the bookmarks with a keyPath
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('urlIndex', 'url', { unique: true });
            console.log('Database setup complete.');
        } else {
            console.log('Database already exists, no setup required.');
        }
        console.log('Database setup complete.');
    };

    request.onsuccess = function(event) {
        console.log('Database opened successfully.');
        readBookmarksFile();
    };

    request.onerror = function(event) {
        console.error('Database error:', event.target.errorCode);
    };
}

function readBookmarksFile() {
    fetch(bookmarksFilePath)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            parseBookmarks(doc);
        })
        .catch(error => console.error('Error reading file:', error));
}

// Parse the HTML Document to Extract Bookmark Information
function parseBookmarks(doc) {
    // Find all <DT><A> elements (which represent bookmarks in Chrome's exported HTML format)
    const bookmarkElements = doc.querySelectorAll('DT > A');
    const bookmarks = [];

    bookmarkElements.forEach(bookmarkElement => {
        const name = bookmarkElement.textContent;
        const url = bookmarkElement.getAttribute('HREF');
        const addDate = bookmarkElement.getAttribute('ADD_DATE') || 'Unknown';
        const lastModified = bookmarkElement.getAttribute('LAST_MODIFIED') || 'Unknown';

        // Create a bookmark object with the extracted data
        const bookmark = {
            name: name,
            url: url,
            dateAdded: new Date(parseInt(addDate) * 1000).toLocaleString(), // Convert UNIX timestamp to date string
            lastModified: lastModified !== 'Unknown' ? new Date(parseInt(lastModified) * 1000).toLocaleString() : 'N/A'
        };

        bookmarks.push(bookmark);
    });

    // Store the bookmarks in IndexedDB
    storeBookmarks(bookmarks);
}
function storeBookmarks(bookmarks) {
    const request = indexedDB.open(bookmarkDB, 4);

    request.onsuccess = function(event) {
        db = event.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        // Add each bookmark to the store
        bookmarks.forEach(bookmark => {
            // Check if the URL already exists
            const getRequest = store.index('urlIndex').get(bookmark.url);

            getRequest.onsuccess = function(event) {
                if (!event.target.result) {
                    // URL does not exist, so we can add it
                    store.add(bookmark).onsuccess = function() {
                        console.log(`Bookmark added: ${bookmark.name}`);
                    };
                } else {
                    console.log(`Bookmark already exists: ${bookmark.name}`);
                }
            };

            getRequest.onerror = function(event) {
                console.error('Error checking for existing URL:', event.target.errorCode);
            };
        });

        transaction.oncomplete = function() {
            console.log('Transaction completed: All bookmarks checked/added.');
        };

        transaction.onerror = function(event) {
            console.error('Transaction error:', event.target.errorCode);
        };
    };

    request.onerror = function(event) {
        console.error('Database error:', event.target.errorCode);
    };
}

// Initialize the database when the script loads
window.onload = function() {
    initDB();
};