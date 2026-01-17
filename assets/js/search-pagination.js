document.addEventListener("DOMContentLoaded", function() {

                const table = document.getElementById("userTable");
                if (!table) return;

                const rows = Array.from(table.querySelectorAll("tbody tr"))
                    .filter(row => row.dataset.status);

                const searchInput = document.getElementById("searchInput");
                const filterYear = document.getElementById("filterYear");
                const filterStatus = document.getElementById("filterStatus");
                const pagination = document.getElementById("pagination");
                const paginationInfo = document.getElementById("paginationInfo");

                const rowsPerPage = 5;
                let currentPage = 1;

                /* =============================
                   ISI DROPDOWN TAHUN
                ============================== */
                const years = new Set();
                rows.forEach(row => {
                    if (row.dataset.year) years.add(row.dataset.year);
                });

                [...years].sort((a, b) => b - a).forEach(year => {
                    const opt = document.createElement("option");
                    opt.value = year;
                    opt.textContent = year;
                    filterYear.appendChild(opt);
                });

                /* =============================
                   FILTER DATA
                ============================== */
                function getFilteredRows() {
                    const keyword = searchInput.value.toLowerCase();
                    const year = filterYear.value;
                    const status = filterStatus.value;

                    return rows.filter(row => {
                        const text = row.innerText.toLowerCase();
                        return (
                            text.includes(keyword) &&
                            (year === '' || row.dataset.year === year) &&
                            (status === '' || row.dataset.status === status)
                        );
                    });
                }

                /* =============================
                   RENDER TABLE
                ============================== */
                function renderTable() {
                    const filteredRows = getFilteredRows();
                    const totalData = filteredRows.length;
                    const totalPages = Math.ceil(totalData / rowsPerPage) || 1;

                    if (currentPage > totalPages) currentPage = 1;

                    rows.forEach(row => row.style.display = "none");

                    const start = (currentPage - 1) * rowsPerPage;
                    const end = start + rowsPerPage;

                    filteredRows.slice(start, end).forEach(row => {
                        row.style.display = "";
                    });

                    renderPagination(totalPages);
                    renderInfo(start, end, totalData);
                }

                /* =============================
                   INFO JUMLAH DATA
                ============================== */
                function renderInfo(start, end, total) {
                    if (total === 0) {
                        paginationInfo.textContent = "Tidak ada data ditampilkan";
                        return;
                    }

                    paginationInfo.textContent =
                        `Menampilkan ${start + 1}–${Math.min(end, total)} dari ${total} data`;
                }

                /* =============================
                   PAGINATION BUTTON
                ============================== */
                function renderPagination(totalPages) {
                    pagination.innerHTML = "";

                    if (totalPages <= 1) return;

                    // PREV
                    if (currentPage > 1) {
                        pagination.appendChild(createButton("‹", currentPage - 1));
                    }

                    for (let i = 1; i <= totalPages; i++) {
                        pagination.appendChild(createButton(i, i));
                    }

                    // NEXT
                    if (currentPage < totalPages) {
                        pagination.appendChild(createButton("›", currentPage + 1));
                    }
                }

                function createButton(label, page) {
                    const btn = document.createElement("button");
                    btn.textContent = label;

                    btn.className = `
            min-w-[32px] px-3 py-1 text-xs md:text-sm rounded-lg border
            ${page === currentPage
                ? 'bg-primary text-white border-primary'
                : 'bg-white hover:bg-slate-100 border-slate-300'}
        `;

                    btn.addEventListener("click", () => {
                        currentPage = page;
                        renderTable();
                    });

                    return btn;
                }

                /* =============================
                   EVENT
                ============================== */
                [searchInput, filterYear, filterStatus].forEach(el => {
                    el.addEventListener("input", () => {
                        currentPage = 1;
                        renderTable();
                    });
                });

                renderTable();

            });
