const toggleArrow = document.getElementsById("dropdown-toggle::after");

const toggleDropdown = () => {
    dropdownMenu.classList.toggle("show");
    toggleArrow.classList.toggle("dropdown-toggle::after");
};

dropdownBtn.adEventListener('click', function (e) {
    e.preventDefault();
    toggleDropdown();
});