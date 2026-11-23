import { Link } from "react-router-dom";
import Button from "../atoms/Button";

const formatRupiah = (nilai) =>
  "Rp" + nilai.toLocaleString("id-ID");

export default function ProductCard({
  produk,
  onEdit,
  onDelete,
}) {
  return (
    <article className="produk-card flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="produk-id text-sm text-slate-500">
        ID: {produk.id}
      </span>

      <h2 className="mt-3 text-xl font-semibold">
        {produk.nama}
      </h2>

      <h3 className="mt-2 text-xl font-bold text-blue-600">
        {formatRupiah(produk.harga)}
      </h3>

      <Link
        to={`/products/${produk.id}`}
        className="btn-detail mt-4 block rounded-lg border border-blue-500 bg-blue-50 px-4 py-3 text-center font-semibold text-blue-600 no-underline hover:bg-blue-100"
      >
        Lihat Detail
      </Link>

      <div className="aksi mt-auto flex gap-3">
        <Button
          variant="outline"
          className="min-w-0 flex-1"
          onClick={() => onEdit(produk)}
        >
          Edit
        </Button>

        <Button
          variant="danger"
          className="min-w-0 flex-1"
          onClick={() => onDelete(produk)}
        >
          Hapus
        </Button>
      </div>
    </article>
  );
}