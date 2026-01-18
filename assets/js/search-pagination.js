document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#userTable tbody');
    const searchInput = document.getElementById('searchInput');
    const filterYear = document.getElementById('filterYear');
    const filterStatus = document.getElementById('filterStatus');
    const paginationInfo = document.getElementById('paginationInfo');
    const pagination = document.getElementById('pagination');

    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const rowsPerPage = 10;
    let currentPage = 1;
    let filteredRows = [...rows];

    // ===== Populate Tahun Otomatis =====
    const yearSet = new Set();
    rows.forEach(row => {
        if (row.dataset.year) yearSet.add(row.dataset.year);
    });
    const years = Array.from(yearSet).sort((a, b) => b - a);
    years.forEach(y => {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        filterYear.appendChild(opt);
    });

    // ===== Filter Rows =====
    function filterRows() {
        const keyword = searchInput.value.toLowerCase();
        const year = filterYear.value;
        const status = filterStatus.value;

        filteredRows = rows.filter(row => {
            const text = row.innerText.toLowerCase();
            return (
                text.includes(keyword) &&
                (year === '' || row.dataset.year === year) &&
                (status === '' || row.dataset.status === status)
            );
        });

        currentPage = 1;
        renderTable();
    }

    // ===== Render Table =====
    function renderTable() {
        rows.forEach(row => row.style.display = 'none');

        const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        filteredRows.slice(start, end).forEach(r => r.style.display = '');

        // Info jumlah data
        paginationInfo.textContent = `Menampilkan ${filteredRows.length === 0 ? 0 : start + 1}-${Math.min(end, filteredRows.length)} dari ${filteredRows.length} data`;

        renderPagination(totalPages);
    }

    // ===== Render Pagination =====
    function renderPagination(totalPages) {
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        // tombol Prev
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '‹ Prev';
        prevBtn.disabled = currentPage === 1;
        prevBtn.className = `px-3 py-1 rounded border ${prevBtn.disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-slate-100 border-slate-300'}`;
        prevBtn.addEventListener('click', () => {
            currentPage--;
            renderTable();
        });
        pagination.appendChild(prevBtn);

        // halaman: hanya ±2 dari currentPage
        const pageButtonsToShow = 2;
        const startPage = Math.max(1, currentPage - pageButtonsToShow);
        const endPage = Math.min(totalPages, currentPage + pageButtonsToShow);

        if (startPage > 1) {
            pagination.appendChild(createPageButton(1));
            if (startPage > 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'px-2 text-gray-500';
                pagination.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pagination.appendChild(createPageButton(i));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'px-2 text-gray-500';
                pagination.appendChild(dots);
            }
            pagination.appendChild(createPageButton(totalPages));
        }

        // tombol Next
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next ›';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.className = `px-3 py-1 rounded border ${nextBtn.disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-slate-100 border-slate-300'}`;
        nextBtn.addEventListener('click', () => {
            currentPage++;
            renderTable();
        });
        pagination.appendChild(nextBtn);

        // buat tombol halaman
        function createPageButton(page) {
            const btn = document.createElement('button');
            btn.textContent = page;
            btn.className = `px-3 py-1 rounded border mx-0.5 ${page === currentPage ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-slate-100 border-slate-300'}`;
            btn.addEventListener('click', () => {
                currentPage = page;
                renderTable();
            });
            return btn;
        }
    }

    // ===== Event Listeners =====
    searchInput.addEventListener('input', filterRows);
    filterYear.addEventListener('change', filterRows);
    filterStatus.addEventListener('change', filterRows);

    // Initial render
    renderTable();
});
