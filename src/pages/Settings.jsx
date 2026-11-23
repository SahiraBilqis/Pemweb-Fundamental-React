import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";

export default function Settings({
  tampilan,
  setTampilan,
}) {
  const ubahTampilan = (pilihan) => {
    setTampilan(pilihan);
    localStorage.setItem("tampilanProduk", pilihan);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-800">
        Settings
      </h1>

      <p className="mt-3 text-slate-500">
        Atur bagaimana produk ditampilkan.
      </p>

      <h2 className="mb-5 mt-8 text-xl font-semibold">
        Tampilan Produk
      </h2>

      <div className="flex flex-wrap gap-4">
        <Button
          variant={tampilan === "grid" ? "primary" : "secondary"}
          onClick={() => ubahTampilan("grid")}
        >
          Grid View
        </Button>

        <Button
          variant={tampilan === "list" ? "primary" : "secondary"}
          onClick={() => ubahTampilan("list")}
        >
          List View
        </Button>
      </div>

      <p className="mt-6 text-slate-500">
        Tampilan aktif:{" "}
        <span className="font-semibold">
          {tampilan === "grid" ? "Grid" : "List"}
        </span>
      </p>

      <Link
        to="/products"
        className="mt-8 inline-block font-semibold text-blue-600"
      >
        ← Lihat Produk
      </Link>
    </div>
  );
}
