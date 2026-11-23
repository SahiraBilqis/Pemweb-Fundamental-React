import ProductCard from "../molecules/ProductCard";

export default function ProductGrid({
  produk,
  tampilan,
  onEdit,
  onDelete,
}) {
  if (produk.length === 0) {
    return (
      <p className="produk-kosong rounded-lg py-10 text-center text-slate-500">
        Produk tidak ditemukan.
      </p>
    );
  }

  return (
    <div
      className={
        tampilan === "grid"
          ? "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          : "flex flex-col gap-4"
      }
    >
      {produk.map((item) => (
        <ProductCard
          key={item.id}
          produk={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
