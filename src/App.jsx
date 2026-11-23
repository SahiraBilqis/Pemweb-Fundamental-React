import { useState, useEffect } from "react";
import { productApi } from "./services/productApi";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// Data produk awal
const dataAwal = [
  { id: 1, nama: "Pulpen", harga: 5000 },
  { id: 2, nama: "Buku Tulis", harga: 12000 },
  { id: 3, nama: "Spidol", harga: 8000 },
  { id: 4, nama: "Penggaris", harga: 6000 },
  { id: 5, nama: "Penghapus", harga: 3000 },
];

const formatRupiah = (nilai) => {
  return "Rp" + nilai.toLocaleString("id-ID");
};

// Navigasi antarhalaman
function Navbar() {
  return (
    <nav className="mb-8 flex flex-wrap gap-3 border-b border-slate-200 pb-4">
      <Link
        to="/products"
        className="rounded-lg bg-blue-600 px-5 py-2 text-white no-underline hover:bg-blue-700"
      >
        Produk
      </Link>

      <Link
        to="/settings"
        className="rounded-lg bg-slate-200 px-5 py-2 text-slate-800 no-underline hover:bg-slate-300"
      >
        Settings
      </Link>
    </nav>
  );
}

// Halaman detail berdasarkan ID
function ProductDetail({ produk }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = produk.find((p) => p.id === Number(id));

  if (!item) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-2xl font-bold">
          Produk Tidak Ditemukan
        </h1>
        <p>ID produk yang kamu cari tidak tersedia.</p>
        <Link to="/products" className="mt-5 inline-block text-blue-600">
          ← Kembali ke Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm">
      <h1 className="mb-5 text-3xl font-bold">
        Detail Produk
      </h1>

      <div className="space-y-4">
        <p>
          <span className="font-semibold">ID:</span> {item.id}
        </p>

        <p>
          <span className="font-semibold">Nama:</span> {item.nama}
        </p>

        <p>
          <span className="font-semibold">Harga:</span>{" "}
          <span className="font-bold text-blue-600">
            {formatRupiah(item.harga)}
          </span>
        </p>
      </div>

      <button
        onClick={() => navigate("/products")}
        className="mt-8 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
      >
        ← Kembali ke Produk
      </button>
    </div>
  );
}

// Halaman pengaturan Grid / List
function Settings({ tampilan, setTampilan }) {
  const ubahTampilan = (pilihan) => {
    setTampilan(pilihan);
    localStorage.setItem("tampilanProduk", pilihan);
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm">
      <h1 className="mb-3 text-3xl font-bold">
        Settings
      </h1>

      <p className="mb-6 text-slate-500">
        Atur bagaimana produk ditampilkan.
      </p>

      <h2 className="mb-4 text-xl font-semibold">
        Tampilan Produk
      </h2>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => ubahTampilan("grid")}
          className={`rounded-lg border px-6 py-3 ${
            tampilan === "grid"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          Grid View
        </button>

        <button
          onClick={() => ubahTampilan("list")}
          className={`rounded-lg border px-6 py-3 ${
            tampilan === "list"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          List View
        </button>
      </div>

      <p className="mt-6 text-slate-500">
        Tampilan aktif: {tampilan === "grid" ? "Grid" : "List"}
      </p>

      <Link
        to="/products"
        className="mt-6 inline-block text-blue-600"
      >
        ← Lihat Produk
      </Link>
    </div>
  );
}

// Halaman 404 untuk URL tidak dikenal
function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-7xl font-bold text-blue-600">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-semibold">
        Halaman Tidak Ditemukan
      </h2>

      <p className="mt-3 text-slate-500">
        Halaman yang kamu cari tidak tersedia.
      </p>

      <Link
        to="/products"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white no-underline"
      >
        Kembali ke Produk
      </Link>
    </div>
  );
}

function App() {
  // State produk dan pencarian
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pencarian, setPencarian] = useState("");

  // State modal
  const [modal, setModal] = useState(null);
  const [produkDipilih, setProdukDipilih] = useState(null);

  // State form
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");

  // State Settings
  const [tampilan, setTampilan] = useState(() => {
    return localStorage.getItem("tampilanProduk") === "list"
      ? "list"
      : "grid";
  });

  const hasilPencarian = produk.filter((item) =>
    item.nama.toLowerCase().includes(pencarian.toLowerCase())
  );

  // Membuka modal tambah
  const handleBukaTambah = () => {
    setNama("");
    setHarga("");
    setProdukDipilih(null);
    setModal("tambah");
  };

  // Membuka modal edit
  const handleBukaEdit = (item) => {
    setProdukDipilih(item);
    setNama(item.nama);
    setHarga(String(item.harga));
    setModal("edit");
  };

  // Membuka modal hapus
  const handleBukaHapus = (item) => {
    setProdukDipilih(item);
    setModal("hapus");
  };

  // Menutup modal
  const handleTutupModal = () => {
    setModal(null);
    setProdukDipilih(null);
  };

  // Validasi form
  const validasiProduk = () => {
    const hargaAngka = Number(harga);

    if (
      !nama.trim() ||
      !harga.trim() ||
      !Number.isSafeInteger(hargaAngka) ||
      hargaAngka <= 0
    ) {
      alert("Nama wajib diisi dan harga harus bilangan bulat lebih dari 0!");
      return false;
    }

    return true;
  };

  // Tambah produk
  const handleTambahProduk = async (e) => {
    e.preventDefault();

    if (!validasiProduk()) return;

    try {
      await productApi.create({
        nama: nama.trim(),
        harga: Number(harga),
      });

      await ambilProduk();
      handleTutupModal();
    } catch (err) {
      alert("Gagal menambahkan produk: " + err.message);
    }
  };

  // Edit produk
  const handleEditProduk = async (e) => {
    e.preventDefault();

    if (!validasiProduk() || !produkDipilih) return;

    try {
      await productApi.update(produkDipilih.id, {
        nama: nama.trim(),
        harga: Number(harga),
      });

      await ambilProduk();
      handleTutupModal();
    } catch (err) {
      alert("Gagal mengedit produk: " + err.message);
    }
  };

  // Hapus produk
  const handleHapusProduk = async () => {
    if (!produkDipilih) return;

    try {
      await productApi.remove(produkDipilih.id);

      await ambilProduk();
      handleTutupModal();
    } catch (err) {
      alert("Gagal menghapus produk: " + err.message);
    }
  };

    const ambilProduk = async () => {
      try {
        setError("");
        const data = await productApi.getAll();
        setProduk(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      ambilProduk();
    }, []);


  // Halaman utama CRUD
  const halamanProduk = (
    <>
      <div className="header">
        <div>
          <h1>Manajemen Produk</h1>
          <p>Kelola daftar produk dan harga dalam satu tempat.</p>
        </div>

        <button
          className="btn-tambah"
          onClick={handleBukaTambah}
        >
          + Tambah Produk
        </button>
      </div>

      <input
        type="text"
        className="input-cari"
        placeholder="⌕ Cari nama produk..."
        value={pencarian}
        onChange={(e) => setPencarian(e.target.value)}
      />

      <p className="jumlah-produk">{produk.length} produk</p>

      {loading && (
        <p className="text-blue-600">
          Memuat produk dari backend...
        </p>
      )}

      {error && (
        <p className="text-red-600">
          Gagal mengambil data: {error}
        </p>
      )}
      <div
        className={
          tampilan === "grid"
            ? "produk-grid"
            : "produk-grid produk-list"
        }
      >
        {hasilPencarian.map((item) => (
          <div className="produk-card" key={item.id}>
            <span className="produk-id">
              ID: {item.id}
            </span>

            <h2>{item.nama}</h2>
            <h3>{formatRupiah(item.harga)}</h3>

            <Link
              to={`/products/${item.id}`}
              className="btn-detail"
            >
              Lihat Detail
            </Link>

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
        <p className="produk-kosong">
          Produk tidak ditemukan.
        </p>
      )}

      <p className="footer">
        Menampilkan {hasilPencarian.length} dari{" "}
        {produk.length} produk
      </p>
    </>
  );

  return (
    <BrowserRouter>
      <div className="container">
        <Navbar />

        <Routes>
          <Route path="/" element={halamanProduk} />
          <Route path="/products" element={halamanProduk} />

          <Route
            path="/products/:id"
            element={<ProductDetail produk={produk} />}
          />

          <Route
            path="/settings"
            element={
              <Settings
                tampilan={tampilan}
                setTampilan={setTampilan}
              />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Modal tambah dan edit */}
        {(modal === "tambah" || modal === "edit") && (
          <div
            className="modal-overlay"
            onClick={handleTutupModal}
          >
            <div
              className="modal-box"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={handleTutupModal}
              >
                ×
              </button>

              <h2>
                {modal === "tambah"
                  ? "Tambah Produk"
                  : "Edit Produk"}
              </h2>

              <p className="modal-deskripsi">
                {modal === "tambah"
                  ? "Masukkan informasi produk baru."
                  : "Perbarui informasi produk yang dipilih."}
              </p>

              {modal === "edit" && produkDipilih && (
                <p className="modal-id">
                  ID: {produkDipilih.id}
                </p>
              )}

              <form
                onSubmit={
                  modal === "tambah"
                    ? handleTambahProduk
                    : handleEditProduk
                }
              >
                <label htmlFor="nama-produk">
                  Nama Produk
                </label>

                <input
                  id="nama-produk"
                  type="text"
                  placeholder="Contoh: Pulpen"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />

                <label htmlFor="harga-produk">
                  Harga (Rp)
                </label>

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

                <p className="form-hint">
                  Harga harus lebih dari 0.
                </p>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-batal"
                    onClick={handleTutupModal}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="btn-simpan"
                  >
                    {modal === "tambah"
                      ? "Simpan Produk"
                      : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal konfirmasi hapus */}
        {modal === "hapus" && produkDipilih && (
          <div
            className="modal-overlay"
            onClick={handleTutupModal}
          >
            <div
              className="modal-box modal-hapus"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={handleTutupModal}
              >
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
                <strong>
                  {formatRupiah(produkDipilih.harga)}
                </strong>
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
    </BrowserRouter>
  );
}

export default App;
