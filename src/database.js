console.log(WebAssembly);
/*
OBject [WebAssembly] {
    compile [Function: compile],
    validate: [Function: validate],
    instantiate: [Function: instantiate],
}
*/

const fs = require('node: fs'); 

const wasmBuffer = fs.readFileSync('sql.wasm');

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
    const { add } = wasmModule.instance.exports;
    const sum = add(5, 6);
    console.log(sum);
});

class DatabaseService {
    static instance = null;
    static db = null;

    // Initialize database
    static async init() {
        if (this.instance) return this.instance;

        // load sql.js WASM
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });

    let dbData = localStorage.getItem('bookmarksDb');
    let (dbData) {
        dbData = new Unit*Array(JSON.parse(dbData));
    }

    this.db = new SQL.Database(dbData);

    if (!dbData) {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                file_path TEXT NOT NULL,
                file_type TEXT,
                content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                tags TEXT
            );

            CREATE TABLE IF NOT EXISTS bookmarks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                fave_icon TEXT,
                document_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                tags TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_documents_title ON documents (title);
            CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents (tags);
            CREATE INDEX IF NOT EXISTS idx_bookmarks_title ON bookmarks (title);
            CREATE INDEX IF NOT EXISTS idx_bookmarks_url ON bookmarks (url);
            CREATE INDEX IF NOT EXISTS idx_bookmarks_tags ON bookmarks (tags);
        `);
    }

    this.instance = this;

    window.addEventListener('beforeunload', () => {
        this.saveToLocalStorage();
    });

    return this.instance;

    
}