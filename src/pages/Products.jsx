import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import ProductGrid from "../components/organisms/ProductGrid";

export default function Products({
  produk,
  pencarian,
  setPencarian,
  tampilan,
  loading,
  error,
  onTambah,
  onEdit,
  onDelete,
}) {
  const hasilPencarian = produk.filter((item) =>
    item.nama
      .toLowerCase()
      .includes(pencarian.toLowerCase())
  );

  return (
    <section>
      <div className="header mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Manajemen Produk
          </h1>

          <p className="mt-2 text-slate-500">
            Kelola daftar produk dan harga dalam satu tempat.
          </p>
        </div>

        <Button onClick={onTambah}>
          + Tambah Produk
        </Button>
      </div>

      <div className="mb-6 max-w-sm">
        <Input
          type="text"
          placeholder="⌕ Cari nama produk..."
          value={pencarian}
          onChange={(e) => setPencarian(e.target.value)}
        />
      </div>

      <p className="mb-4 text-right text-slate-500">
        {produk.length} produk
      </p>

      {loading ? (
        <p className="py-8 text-blue-600">
          Memuat produk dari backend...
        </p>
      ) : error ? (
        <p className="rounded-lg bg-red-50 p-4 text-red-600">
          Gagal mengambil data: {error}
        </p>
      ) : (
        <>
          <ProductGrid
            produk={hasilPencarian}
            tampilan={tampilan}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          <p className="footer mt-6 text-sm text-slate-500">
            Menampilkan {hasilPencarian.length} dari{" "}
            {produk.length} produk
          </p>
        </>
      )}
    </section>
  );
}
