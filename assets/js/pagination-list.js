document.addEventListener("DOMContentLoaded", () => {
    console.log("🔥 FILTER + PAGINATION AKTIF");

    const searchInput = document.getElementById("searchAll");
    const filterYear = document.getElementById("filterYear");
    const table = document.getElementById("userTable");
    const tbody = table.querySelector("tbody");

    const pageInfo = document.getElementById("pageInfo");
    const pagination = document.getElementById("pagination");

    const rowsPerPage = 10;
    let currentPage = 1;

    // === AMBIL SEMUA ROW DATA ===
    const allRows = Array.from(
        document.querySelectorAll("#userTable > tbody > tr")
    );

    let filteredRows = [...allRows];

    // === ISI FILTER TAHUN OTOMATIS ===
    const years = new Set();
    allRows.forEach(row => {
        const tanggal = row.children[3]?.innerText || "";
        const year = tanggal.substring(0, 4);
        if (year) years.add(year);
    });

    [...years].sort().forEach(y => {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        filterYear.appendChild(opt);
    });

    // === FILTER DATA ===
    function applyFilter() {
        const keyword = searchInput.value.toLowerCase().trim();
        const year = filterYear.value;

        filteredRows = allRows.filter(row => {
            const rowText = row.innerText.toLowerCase();
            const tanggal = row.children[3]?.innerText || "";
            const rowYear = tanggal.substring(0, 4);

            const matchText = rowText.includes(keyword);
            const matchYear = !year || rowYear === year;

            return matchText && matchYear;
        });

        currentPage = 1;
        renderTable();
        renderPagination();
    }

    // === RENDER TABLE ===
    function renderTable() {
        // SEMBUNYIKAN SEMUA BARIS DATA
        allRows.forEach(row => row.style.display = "none");

        // SEMBUNYIKAN EMPTY STATE
        const emptyRow = tbody.querySelector(".row-empty");
        if (emptyRow) emptyRow.style.display = "none";

        if (filteredRows.length === 0) {
            pageInfo.textContent = "Tidak ada data ditemukan";
            pagination.innerHTML = "";

            if (emptyRow) emptyRow.style.display = "table-row";
            return;
        }

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        filteredRows.slice(start, end).forEach(row => {
            row.style.display = "table-row";
        });

        pageInfo.textContent =
            `Menampilkan ${start + 1}–${Math.min(end, filteredRows.length)} dari ${filteredRows.length} data`;
    }


    // === PAGINATION ===
    function renderPagination() {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;

            btn.className = `
                px-3 py-1 text-sm rounded-lg border transition
                ${i === currentPage
                    ? "bg-primary text-white border-primary"
                    : "border-slate-300 hover:bg-slate-100"}
            `;

            btn.onclick = () => {
                currentPage = i;
                renderTable();
                renderPagination();
            };

            pagination.appendChild(btn);
        }
    }

    // === RESET ===
    window.resetFilters = function () {
        searchInput.value = "";
        filterYear.value = "";
        applyFilter();
    };

    // === EVENT ===
    searchInput.addEventListener("input", applyFilter);
    filterYear.addEventListener("change", applyFilter);

    // INIT
    applyFilter();
});
