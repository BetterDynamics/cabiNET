// JavaScript for making the columns resizable
const resizers = document.querySelectorAll('.resizer');
let currentResizer;

resizers.forEach(resizer => {
    resizer.addEventListener('mousedown', (e) => {
        currentResizer = resizer;
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });
});

function resize(e) {
    const parent = currentResizer.previousElementSibling;
    const next = currentResizer.nextElementSibling;

    if (parent && next) {
        const parentWidth = parent.getBoundingClientRect().width;
        const nextWidth = next.getBoundingClientRect().width;

        // Set new width based on mouse position
        const newParentWidth = parentWidth + e.movementX;
        const newNextWidth = nextWidth - e.movementX;

        if (newParentWidth > 100 && newNextWidth > 100) { // Minimum width
            parent.style.width = newParentWidth + 'px';
            next.style.width = newNextWidth + 'px';
        }
    }
}

function stopResize() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}
