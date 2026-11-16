import { useState } from "react";
import "./App.css";

// Data awal produk untuk inisialisasi state
const dataAwal = [
  { id: 1, nama: "Pulpen", harga: 5000 },
  { id: 2, nama: "Buku Tulis", harga: 12000 },
  { id: 3, nama: "Spidol", harga: 8000 },
  { id: 4, nama: "Penggaris", harga: 6000 },
  { id: 5, nama: "Penghapus", harga: 3000 },
];

function App() {
  // State untuk list produk dan input search
  const [produk, setProduk] = useState(dataAwal);
  const [pencarian, setPencarian] = useState("");

  // State untuk kontrol modal ('tambah' | 'edit' | 'hapus') dan produk yang dipilih
  const [modal, setModal] = useState(null);
  const [produkDipilih, setProdukDipilih] = useState(null);

  // State form input nama & harga produk
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");

  // Helper untuk format angka menjadi rupiah
  const formatRupiah = (nilai) => {
    return "Rp" + nilai.toLocaleString("id-ID");
  };

  // Filter list produk berdasarkan nama sesuai keyword pencarian
  const hasilPencarian = produk.filter((item) =>
    item.nama.toLowerCase().includes(pencarian.toLowerCase())
  );

  // Buka modal tambah produk baru (reset form)
  const handleBukaTambah = () => {
    setNama("");
    setHarga("");
    setProdukDipilih(null);
    setModal("tambah");
  };

  // Buka modal edit produk dan pasang datanya ke form
  const handleBukaEdit = (item) => {
    setProdukDipilih(item);
    setNama(item.nama);
    setHarga(String(item.harga));
    setModal("edit");
  };

  // Buka modal konfirmasi hapus produk
  const handleBukaHapus = (item) => {
    setProdukDipilih(item);
    setModal("hapus");
  };

  // Fungsi tutup dan reset modal
  const handleTutupModal = () => {
    setModal(null);
    setProdukDipilih(null);
  };

  // Handle penambahan produk baru
  const handleTambahProduk = (e) => {
    e.preventDefault();

    const hargaAngka = Number(harga);

    // Validasi form produk
    if (!nama.trim() || isNaN(hargaAngka) || hargaAngka <= 0) {
      alert("Nama produk wajib diisi dan harga harus lebih dari 0!");
      return;
    }

    // Auto generate ID (ID terbesar + 1)
    const idBaru =
      produk.length > 0
        ? Math.max(...produk.map((item) => item.id)) + 1
        : 1;

    setProduk([
      ...produk,
      {
        id: idBaru,
        nama: nama.trim(),
        harga: hargaAngka,
      },
    ]);

    handleTutupModal();
  };

  // Handle update data produk yang diedit
  const handleEditProduk = (e) => {
    e.preventDefault();

    const hargaAngka = Number(harga);

    // Validasi form produk
    if (!nama.trim() || isNaN(hargaAngka) || hargaAngka <= 0) {
      alert("Nama produk wajib diisi dan harga harus lebih dari 0!");
      return;
    }

    setProduk(
      produk.map((item) =>
        item.id === produkDipilih.id
          ? { ...item, nama: nama.trim(), harga: hargaAngka }
          : item
      )
    );

    handleTutupModal();
  };

  // Handle hapus produk dari state
  const handleHapusProduk = () => {
    setProduk(
      produk.filter((item) => item.id !== produkDipilih.id)
    );

    handleTutupModal();
  };

  return (
    <div className="container">
      {/* Header halaman */}
      <div className="header">
        <div>
          <h1>Manajemen Produk</h1>
          <p>Kelola daftar produk dan harga dalam satu tempat.</p>
        </div>

        <button className="btn-tambah" onClick={handleBukaTambah}>
          + Tambah Produk
        </button>
      </div>

      {/* Input pencarian produk */}
      <input
        type="text"
        className="input-cari"
        placeholder="⌕ Cari nama produk..."
        value={pencarian}
        onChange={(e) => setPencarian(e.target.value)}
      />

      {/* Total produk */}
      <p className="jumlah-produk">{produk.length} produk</p>

      {/* Grid tampilan produk */}
      <div className="produk-grid">
        {hasilPencarian.map((item) => (
          <div className="produk-card" key={item.id}>
            <span className="produk-id">ID: {item.id}</span>
            <h2>{item.nama}</h2>
            <h3>{formatRupiah(item.harga)}</h3>

            <div className="aksi">
              <button
                className="btn-edit"
                onClick={() => handleBukaEdit(item)}
              >
                Edit
              </button>

              <button
                className="btn-hapus"
                onClick={() => handleBukaHapus(item)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasilPencarian.length === 0 && (
        <p className="produk-kosong">Produk tidak ditemukan.</p>
      )}

      {/* Footer informasi jumlah data yang ditampilkan */}
      <p className="footer">
        Menampilkan {hasilPencarian.length} dari {produk.length} produk
      </p>

      {/* Modal Form Tambah / Edit */}
      {(modal === "tambah" || modal === "edit") && (
        <div className="modal-overlay" onClick={handleTutupModal}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={handleTutupModal}>
              ×
            </button>

            <h2>
              {modal === "tambah" ? "Tambah Produk" : "Edit Produk"}
            </h2>

            <p className="modal-deskripsi">
              {modal === "tambah"
                ? "Masukkan informasi produk baru."
                : "Perbarui informasi produk yang dipilih."}
            </p>

            {modal === "edit" && (
              <p className="modal-id">ID: {produkDipilih.id}</p>
            )}

            <form
              onSubmit={modal === "tambah" ? handleTambahProduk : handleEditProduk}
            >
              <label htmlFor="nama-produk">Nama Produk</label>
              <input
                id="nama-produk"
                type="text"
                placeholder="Contoh: Pulpen"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />

              <label htmlFor="harga-produk">Harga (Rp)</label>
              <input
                id="harga-produk"
                type="number"
                placeholder="Contoh: 5000"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                min="1"
                step="1"
                required
              />

              <p className="form-hint">Harga harus lebih dari 0.</p>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-batal"
                  onClick={handleTutupModal}
                >
                  Batal
                </button>

                <button type="submit" className="btn-simpan">
                  {modal === "tambah"
                    ? "Simpan Produk"
                    : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Produk */}
      {modal === "hapus" && produkDipilih && (
        <div className="modal-overlay" onClick={handleTutupModal}>
          <div
            className="modal-box modal-hapus"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={handleTutupModal}>
              ×
            </button>

            <div className="icon-hapus">🗑️</div>

            <h2>Hapus Produk?</h2>

            <p className="modal-deskripsi">
              Produk yang dihapus tidak dapat dikembalikan.
            </p>

            <div className="produk-preview">
              <span>ID: {produkDipilih.id}</span>
              <h3>{produkDipilih.nama}</h3>
              <strong>{formatRupiah(produkDipilih.harga)}</strong>
            </div>

            <div className="modal-actions">
              <button
                className="btn-batal"
                onClick={handleTutupModal}
              >
                Batal
              </button>

              <button
                className="btn-konfirmasi-hapus"
                onClick={handleHapusProduk}
              >
                Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
