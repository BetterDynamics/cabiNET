// Get current date information
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

// Get DOM elements
const daysContainer = document.querySelector(".calendar-days");
const currentDay = document.querySelector(".calendar-current-day");
const prevNextIcons = document.querySelectorAll(".calendar-nav span");

// Array of month names
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const manipulate = () => {
    // Get first day of month (0-6, representing Sunday-Saturday)
    let dayOne = new Date(year, month, 1).getDay();
    // Get last date of month
    let lastDate = new Date(year, month + 1, 0).getDate();
    // Get last day of month (0-6)
    let dayEnd = new Date(year, month, lastDate).getDay();
    // Get last date of previous month
    let monthLastDate = new Date(year, month, 0).getDate();
    
    let lit = "";
    
    // Add inactive days from previous month
    for (let i = dayOne; i > 0; i--) {
        lit += `<li class="inactive">${monthLastDate - i + 1}</li>`;
    }

    // Add current month days
    for (let i = 1; i <= lastDate; i++) {
        let isToday = i === date.getDate() && 
                      month === new Date().getMonth() && 
                      year === new Date().getFullYear() ? "active" : "";
        lit += `<li class="${isToday}">${i}</li>`;
    }

    // Add inactive days from next month
    for (let i = dayEnd; i < 6; i++) {
        lit += `<li class="inactive">${i - dayEnd + 1}</li>`;
    }

    // Update calendar header and days
    currentDay.innerText = `${months[month]} ${year}`;
    daysContainer.innerHTML = lit;
};

// Initialize calendar
manipulate();

// Add event listeners for previous/next month navigation
prevNextIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;
        
        if (month < 0 || month > 11) {
            date = new Date(year, month, 1);
            year = date.getFullYear();
            month = date.getMonth();
        } else {
            date = new Date(year, month, 1);
        }
        
        manipulate();
    });
});