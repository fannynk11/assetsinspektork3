document.addEventListener("DOMContentLoaded", () => {

    const table = document.getElementById("userTable");
    if (!table) return;

    const tbody = table.querySelector("tbody");
    const allRows = Array.from(tbody.querySelectorAll("tr"));

    const searchInput = document.getElementById("searchTable");
    const pagination = document.getElementById("pagination");
    const pageInfo = document.getElementById("pageInfo");

    const rowsPerPage = 10;
    const windowSize = 1;

    let currentPage = 1;
    let filteredRows = [...allRows];

    function render() {
        tbody.innerHTML = "";

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        filteredRows.slice(start, end).forEach(row => {
            tbody.appendChild(row);
        });

        updateInfo();
        renderPagination();
    }

    function updateInfo() {
        const total = filteredRows.length;

        if (total === 0) {
            pageInfo.textContent = "Tidak ada data";
            return;
        }

        const start = (currentPage - 1) * rowsPerPage + 1;
        const end = Math.min(currentPage * rowsPerPage, total);

        pageInfo.textContent = `Menampilkan ${start}–${end} dari ${total} data`;
    }

    function renderPagination() {
        pagination.innerHTML = "";

        const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
        if (totalPages <= 1) return;

        // PREV
        pagination.appendChild(navButton(
            "chevron_left",
            currentPage > 1,
            () => {
                currentPage--;
                render();
            }
        ));

        // WINDOW CALCULATION
        let startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
        let endPage = startPage + windowSize - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - windowSize + 1);
        }

        // PAGE NUMBERS
        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement("button");
            const active = i === currentPage;

            btn.className = `
                w-9 h-9 rounded-lg text-sm font-semibold transition
                ${active
                    ? "bg-primary text-white"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-100"}
            `;

            btn.textContent = i;
            btn.onclick = () => {
                currentPage = i;
                render();
            };

            pagination.appendChild(btn);
        }

        // NEXT
        pagination.appendChild(navButton(
            "chevron_right",
            currentPage < totalPages,
            () => {
                currentPage++;
                render();
            }
        ));
    }

    function navButton(icon, enabled, onClick) {
        const btn = document.createElement("button");

        btn.className = `
            w-9 h-9 flex items-center justify-center rounded-lg transition
            ${enabled
                ? "border border-slate-300 text-slate-700 hover:bg-slate-100"
                : "border border-slate-200 text-slate-400 cursor-not-allowed"}
        `;

        btn.innerHTML = `<span class="material-symbols-outlined">${icon}</span>`;
        btn.disabled = !enabled;

        if (enabled) btn.onclick = onClick;

        return btn;
    }

    // SEARCH (SAFE)
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const keyword = searchInput.value.toLowerCase();
            filteredRows = allRows.filter(row =>
                row.textContent.toLowerCase().includes(keyword)
            );
            currentPage = 1;
            render();
        });
    }

    // INIT
    render();

});
