// Simulate user state (Replace this with real authentication later)
let isAuthenticated = false;

// Elements
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');
const profileSection = document.getElementById('profile-section');
const settingsSection = document.getElementById('settings-section');
const loginSection = document.getElementById('login-section');
const logoutSection = document.getElementById('logout-section');

// Function to update dropdown based on authentication
function updateDropdown() {
    if (isAuthenticated) {
        loginSection.style.display = 'none';
        profileSection.style.display = 'block';
        settingsSection.style.display = 'block';
        logoutSection.style.display = 'block';
    } else {
        loginSection.style.display = 'block';
        profileSection.style.display = 'none';
        settingsSection.style.display = 'none';
        logoutSection.style.display = 'none';
    }
}

// Event Listeners
loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    isAuthenticated = true; // Simulated login
    alert('Logged in successfully!');
    updateDropdown();
});

logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    isAuthenticated = false; // Simulated logout
    alert('Logged out successfully!');
    updateDropdown();
});

// Initialize
updateDropdown();
