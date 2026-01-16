/* =========================================
   SEARCH + FILTER TAHUN + PAGINATION
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
const rows = Array.from(document.querySelectorAll('#arsipTableBody tr.data-row'));
const searchInput = document.getElementById('arsipSearch');
const yearFilter = document.getElementById('arsipYearFilter');
const info = document.getElementById('arsipPageInfo');
const pagination = document.getElementById('arsipPagination');

// STATE
const perPage = 10;
let currentPage = 1;
let filteredRows = [...rows];

/* =========================================
   INIT FILTER TAHUN
   ========================================= */
function initYearFilter() {
    if (!yearFilter) return;

    const years = new Set();

    rows.forEach(row => {
        const year = row.dataset.year;
        if (year) years.add(year);
    });

    // SORT DESC
    [...years].sort((a, b) => b - a).forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

/* =========================================
   APPLY FILTER
   ========================================= */
function applyFilters() {
    const keyword = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedYear = yearFilter ? yearFilter.value : '';

    filteredRows = rows.filter(row => {
        const matchText = row.textContent.toLowerCase().includes(keyword);
        const matchYear = !selectedYear || row.dataset.year === selectedYear;
        return matchText && matchYear;
    });

    currentPage = 1;
    render();
}

/* =========================================
   RENDER TABLE
   ========================================= */
function render() {
    const total = filteredRows.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    // HIDE ALL
    rows.forEach(row => row.style.display = 'none');

    // SHOW CURRENT PAGE
    filteredRows.slice(start, end).forEach(row => {
        row.style.display = '';
    });

    // INFO
    if (info) {
        const from = total === 0 ? 0 : start + 1;
        const to = Math.min(end, total);
        info.textContent = `Menampilkan ${from}–${to} dari ${total} data`;
    }

    renderPagination(totalPages);
}

/* =========================================
   PAGINATION
   ========================================= */
function renderPagination(totalPages) {
    if (!pagination) return;
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // PREV
    pagination.appendChild(createButton('‹', currentPage === 1, () => {
        currentPage--;
        render();
    }));

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) endPage = Math.min(5, totalPages);
    if (currentPage >= totalPages - 2) startPage = Math.max(totalPages - 4, 1);

    for (let i = startPage; i <= endPage; i++) {
        pagination.appendChild(createButton(i, i === currentPage, () => {
            currentPage = i;
            render();
        }));
    }

    // NEXT
    pagination.appendChild(createButton('›', currentPage === totalPages, () => {
        currentPage++;
        render();
    }));
}

function createButton(text, disabled, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.disabled = disabled;

    btn.className = `
        min-w-[36px] px-3 py-1 text-sm rounded-lg border transition
        ${disabled
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-white hover:bg-blue-600 hover:text-white'}
    `;

    if (!disabled) btn.addEventListener('click', onClick);
    return btn;
}

/* =========================================
   EVENT LISTENER
   ========================================= */
if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
}

if (yearFilter) {
    yearFilter.addEventListener('change', applyFilters);
}

/* =========================================
   INIT
   ========================================= */
initYearFilter();
render();

});
