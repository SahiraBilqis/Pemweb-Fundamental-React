import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="px-4 py-16 text-center">
      <h1 className="text-7xl font-bold text-blue-600">
        404
      </h1>

      <h2 className="mt-5 text-2xl font-bold text-slate-800">
        Halaman Tidak Ditemukan
      </h2>

      <p className="mt-3 text-slate-500">
        Halaman yang kamu cari tidak tersedia.
      </p>

      <Link
        to="/products"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white no-underline hover:bg-blue-700"
      >
        Kembali ke Produk
      </Link>
    </div>
  );
}
