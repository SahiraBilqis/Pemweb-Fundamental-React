import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productApi } from "../services/productApi";

const formatRupiah = (nilai) =>
  "Rp" + nilai.toLocaleString("id-ID");

export default function ProductDetail() {
  const { id } = useParams();

  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let aktif = true;

    const ambilDetail = async () => {
      setLoading(true);
      setError("");
      setProduk(null);

      try {
        const data = await productApi.getById(id);

        if (aktif) {
          setProduk(data);
        }
      } catch (err) {
        if (aktif) {
          setError(err.message);
        }
      } finally {
        if (aktif) {
          setLoading(false);
        }
      }
    };

    ambilDetail();

    return () => {
      aktif = false;
    };
  }, [id]);

  if (loading) {
    return (
      <p className="py-8 text-blue-600">
        Memuat detail produk...
      </p>
    );
  }

  if (error || !produk) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">
          Produk Tidak Ditemukan
        </h1>

        <p className="mt-3 text-slate-500">
          {error || "Produk yang kamu cari tidak tersedia."}
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block font-semibold text-blue-600"
        >
          ← Kembali ke Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        Detail Produk
      </h1>

      <div className="space-y-5">
        <p>
          <span className="font-semibold">ID:</span>{" "}
          {produk.id}
        </p>

        <p>
          <span className="font-semibold">Nama:</span>{" "}
          {produk.nama}
        </p>

        <p>
          <span className="font-semibold">Harga:</span>{" "}
          <span className="font-bold text-blue-600">
            {formatRupiah(produk.harga)}
          </span>
        </p>
      </div>

      <Link
        to="/products"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white no-underline hover:bg-blue-700"
      >
        ← Kembali ke Produk
      </Link>
    </div>
  );
}
