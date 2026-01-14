document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("userTable");
    const tbody = table.querySelector("tbody");

    const searchInput = document.getElementById("searchAll");
    const filterYear = document.getElementById("filterYear");

    const pageInfo = document.getElementById("pageInfo");
    const pagination = document.getElementById("pagination");

    const rowsPerPage = 10;
    let currentPage = 1;

    const allRows = Array.from(
        tbody.querySelectorAll("tr:not(.row-empty)")
    );

    let filteredRows = [...allRows];

    /* ======================
       INIT FILTER TAHUN
    ====================== */
    const years = new Set();
    allRows.forEach(row => {
        const text = row.textContent;
        const match = text.match(/\b(20\d{2})\b/);
        if (match) years.add(match[1]);
    });

    [...years].sort().forEach(year => {
        const opt = document.createElement("option");
        opt.value = year;
        opt.textContent = year;
        filterYear.appendChild(opt);
    });

    /* ======================
       FILTER LOGIC
    ====================== */
    function applyFilter() {
        const keyword = searchInput.value.toLowerCase();
        const year = filterYear.value;

        filteredRows = allRows.filter(row => {
            const text = row.textContent.toLowerCase();
            const rowYear = row.textContent.match(/\b(20\d{2})\b/);

            const matchText = text.includes(keyword);
            const matchYear = !year || (rowYear && rowYear[1] === year);

            return matchText && matchYear;
        });

        currentPage = 1;
        renderTable();
    }

    searchInput.addEventListener("input", applyFilter);
    filterYear.addEventListener("change", applyFilter);

    window.resetFilters = function () {
        searchInput.value = "";
        filterYear.value = "";
        filteredRows = [...allRows];
        currentPage = 1;
        renderTable();
    };

    /* ======================
       RENDER TABLE
    ====================== */
    function renderTable() {

        if (filteredRows.length === 0) {
            pageInfo.textContent = "Tidak ada data untuk ditampilkan";
            pagination.innerHTML = "";
            return;
        }

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        allRows.forEach(row => (row.style.display = "none"));
        filteredRows.slice(start, end).forEach(row => {
            row.style.display = "";
        });

        renderInfo(start, end);
        renderPagination();
    }

    function renderInfo(start, end) {
        const total = filteredRows.length;
        const from = total === 0 ? 0 : start + 1;
        const to = Math.min(end, total);

        pageInfo.textContent = `Menampilkan ${from}–${to} dari ${total} data`;
    }

    /* ======================
       PAGINATION
    ====================== */
    function renderPagination() {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

        // PREV
        const prev = document.createElement("button");
        prev.textContent = "Prev";
        prev.className =
            "px-3 py-1 text-sm border rounded-lg " +
            (currentPage === 1 ? "text-slate-400 cursor-not-allowed" : "hover:bg-slate-100");
        prev.disabled = currentPage === 1;
        prev.onclick = () => {
            currentPage--;
            renderTable();
        };
        pagination.appendChild(prev);

        // PAGE NUMBER
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.className =
                "px-3 py-1 text-sm border rounded-lg " +
                (i === currentPage
                    ? "bg-primary text-white border-primary"
                    : "hover:bg-slate-100");
            btn.onclick = () => {
                currentPage = i;
                renderTable();
            };
            pagination.appendChild(btn);
        }

        // NEXT
        const next = document.createElement("button");
        next.textContent = "Next";
        next.className =
            "px-3 py-1 text-sm border rounded-lg " +
            (currentPage === totalPages || totalPages === 0
                ? "text-slate-400 cursor-not-allowed"
                : "hover:bg-slate-100");
        next.disabled = currentPage === totalPages || totalPages === 0;
        next.onclick = () => {
            currentPage++;
            renderTable();
        };
        pagination.appendChild(next);
    }

    renderTable();
});
