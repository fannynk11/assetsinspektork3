document.addEventListener('DOMContentLoaded', function () {

document.querySelectorAll('.btn-hapus').forEach(button => {
    button.addEventListener('click', function () {
        const form = this.closest('.form-hapus');

        Swal.fire({
            title: 'Yakin ingin menghapus?',
            text: 'Dokumen inspeksi ini akan dihapus permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                form.submit(); // ⬅️ baru submit ke controller
            }
        });
    });
});



    if (window.flashSuccess) {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: window.flashSuccess,
            confirmButtonText: 'OK'
        });
    }

    if (window.flashError) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: window.flashError
        });
    }

});
