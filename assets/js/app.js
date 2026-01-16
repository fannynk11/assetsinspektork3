document.addEventListener('DOMContentLoaded', function () {

    /* =========================
       DROPDOWN
    ========================= */
    window.toggleDropdown = function (id) {
        const el = document.getElementById(id);
        if (!el) return;

        el.classList.toggle('hidden');
    };

    /* =========================
       SIDEBAR / HAMBURGER (FINAL FIX)
    ========================= */
    window.toggleSidebar = function () {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        if (!sidebar) return;

        // geser sidebar
        sidebar.classList.toggle('-translate-x-full');

        // overlay hanya di mobile
        if (overlay) {
            overlay.classList.toggle('hidden');
        }
    };

});




//TGL DAN WAKTU
function updateClock() {
    const now = new Date();

    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');

    const clock = document.getElementById('clock');
    if (clock) {
        clock.textContent = `${h}:${m}:${s}`;
    }
}

updateClock();
setInterval(updateClock, 1000);




//PASWWORD
const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');

toggleButton.addEventListener('click', function () {
    const isPassword = passwordInput.type === 'password';

    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    sidebar.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
}


// Inisialisasi awal
updatePagination();

function showFileName(input) {
    if (input.files.length > 0) {
        document.getElementById('fileLabel').textContent =
            input.files[0].name;
    }
}










