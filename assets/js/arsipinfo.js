/* ======================================================
       BAGIAN 2 — KONFIRMASI ARSIP (SweetAlert)
       AMAN UNTUK PAGINATION
    ====================================================== */
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener('click', function (e) {

        const arsipBtn = e.target.closest('.btn-arsip');
        if (!arsipBtn) return;

        e.preventDefault();

        const form = arsipBtn.closest('form');
        if (!form) return;

        Swal.fire({
            title: 'Arsipkan dokumen?',
            text: 'Dokumen akan dipindahkan ke arsip',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Arsipkan',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                form.submit();
            }
        });
    });
});