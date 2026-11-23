import { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { productApi } from "./services/productApi";

import PageLayout from "./components/templates/PageLayout";
import ProductForm from "./components/organisms/ProductForm";
import Button from "./components/atoms/Button";

import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import "./App.css";

const formatRupiah = (nilai) =>
  "Rp" + nilai.toLocaleString("id-ID");

function App() {
  // Data produk berasal dari backend
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pencarian
  const [pencarian, setPencarian] = useState("");

  // Modal tambah / edit / hapus
  const [modal, setModal] = useState(null);
  const [produkDipilih, setProdukDipilih] = useState(null);

  // Input formulir
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Pengaturan Grid / List
  const [tampilan, setTampilan] = useState(() => {
    return localStorage.getItem("tampilanProduk") === "list"
      ? "list"
      : "grid";
  });

  // GET produk dari backend
  const ambilProduk = useCallback(async () => {
    try {
      setError("");

      const data = await productApi.getAll();
      setProduk(data);

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    ambilProduk();
  }, [ambilProduk]);

  // Membuka modal tambah
  const handleBukaTambah = () => {
    setNama("");
    setHarga("");
    setProdukDipilih(null);
    setModal("tambah");
  };

  // Membuka modal edit
  const handleBukaEdit = (item) => {
    setNama(item.nama);
    setHarga(String(item.harga));
    setProdukDipilih(item);
    setModal("edit");
  };

  // Membuka modal konfirmasi hapus
  const handleBukaHapus = (item) => {
    setProdukDipilih(item);
    setModal("hapus");
  };

  // Menutup modal
  const handleTutupModal = () => {
    if (isSaving) return;

    setModal(null);
    setProdukDipilih(null);
  };

  // Validasi data
  const validasiProduk = () => {
    const hargaAngka = Number(harga);

    if (
      !nama.trim() ||
      !harga.trim() ||
      !Number.isSafeInteger(hargaAngka) ||
      hargaAngka <= 0
    ) {
      alert(
        "Nama wajib diisi dan harga harus bilangan bulat lebih dari 0!"
      );
      return false;
    }

    return true;
  };

  // POST: Tambah produk
  const handleTambahProduk = async (e) => {
    e.preventDefault();
    if (isSaving || !validasiProduk()) return;

    setIsSaving(true);

    try {
      await productApi.create({
        nama: nama.trim(),
        harga: Number(harga),
      });

      const berhasil = await ambilProduk();

      if (berhasil) {
        setModal(null);
        setProdukDipilih(null);
      }
    } catch (err) {
      alert("Gagal menambahkan produk: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // PUT: Edit produk
  const handleEditProduk = async (e) => {
    e.preventDefault();

    if (
      isSaving ||
      !produkDipilih ||
      !validasiProduk()
    ) {
      return;
    }

    setIsSaving(true);

    try {
      await productApi.update(produkDipilih.id, {
        nama: nama.trim(),
        harga: Number(harga),
      });

      const berhasil = await ambilProduk();

      if (berhasil) {
        setModal(null);
        setProdukDipilih(null);
      }
    } catch (err) {
      alert("Gagal mengedit produk: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // DELETE: Hapus produk
  const handleHapusProduk = async () => {
    if (!produkDipilih || isSaving) return;

    setIsSaving(true);

    try {
      await productApi.remove(produkDipilih.id);

      const berhasil = await ambilProduk();

      if (berhasil) {
        setModal(null);
        setProdukDipilih(null);
      }
    } catch (err) {
      alert("Gagal menghapus produk: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route
            path="/"
            element={
              <Products
                produk={produk}
                pencarian={pencarian}
                setPencarian={setPencarian}
                tampilan={tampilan}
                loading={loading}
                error={error}
                onTambah={handleBukaTambah}
                onEdit={handleBukaEdit}
                onDelete={handleBukaHapus}
              />
            }
          />

          <Route
            path="/products"
            element={
              <Products
                produk={produk}
                pencarian={pencarian}
                setPencarian={setPencarian}
                tampilan={tampilan}
                loading={loading}
                error={error}
                onTambah={handleBukaTambah}
                onEdit={handleBukaEdit}
                onDelete={handleBukaHapus}
              />
            }
          />

          <Route
            path="/products/:id"
            element={<ProductDetail />}
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

        {/* Modal Tambah / Edit */}
        {(modal === "tambah" || modal === "edit") && (
          <div
            className="modal-overlay"
            onClick={handleTutupModal}
          >
            <div
              className="modal-box max-h-[90vh] overflow-y-auto rounded-xl bg-white p-8 shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-label={
                modal === "tambah"
                  ? "Tambah Produk"
                  : "Edit Produk"
              }
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close"
                onClick={handleTutupModal}
                disabled={isSaving}
                aria-label="Tutup modal"
              >
                ×
              </button>

              <h2 className="mb-3 text-2xl font-bold">
                {modal === "tambah"
                  ? "Tambah Produk"
                  : "Edit Produk"}
              </h2>

              <p className="mb-6 text-slate-500">
                {modal === "tambah"
                  ? "Masukkan informasi produk baru."
                  : "Perbarui informasi produk yang dipilih."}
              </p>

              {modal === "edit" && produkDipilih && (
                <p className="mb-4 text-sm text-slate-500">
                  ID: {produkDipilih.id}
                </p>
              )}

              <ProductForm
                nama={nama}
                harga={harga}
                setNama={setNama}
                setHarga={setHarga}
                isEdit={modal === "edit"}
                isSaving={isSaving}
                onSubmit={
                  modal === "tambah"
                    ? handleTambahProduk
                    : handleEditProduk
                }
                onCancel={handleTutupModal}
              />
            </div>
          </div>
        )}

        {/* Modal Hapus */}
        {modal === "hapus" && produkDipilih && (
          <div
            className="modal-overlay"
            onClick={handleTutupModal}
          >
            <div
              className="modal-box max-h-[90vh] overflow-y-auto rounded-xl bg-white p-8 shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-label="Konfirmasi hapus produk"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close"
                onClick={handleTutupModal}
                disabled={isSaving}
                aria-label="Tutup modal"
              >
                ×
              </button>

              <div className="mb-3 text-4xl">
                🗑️
              </div>

              <h2 className="mb-3 text-2xl font-bold">
                Hapus Produk?
              </h2>

              <p className="mb-5 text-slate-500">
                Produk yang dihapus tidak dapat dikembalikan.
              </p>

              <div className="rounded-lg bg-slate-100 p-5">
                <p className="text-sm text-slate-500">
                  ID: {produkDipilih.id}
                </p>

                <h3 className="my-2 text-lg font-bold">
                  {produkDipilih.nama}
                </h3>

                <strong className="text-blue-600">
                  {formatRupiah(produkDipilih.harga)}
                </strong>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={handleTutupModal}
                  disabled={isSaving}
                >
                  Batal
                </Button>

                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleHapusProduk}
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Menghapus..."
                    : "Hapus Produk"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
