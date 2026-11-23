import Button from "../atoms/Button";
import Input from "../atoms/Input";

export default function ProductForm({
  nama,
  harga,
  setNama,
  setHarga,
  onSubmit,
  onCancel,
  isEdit,
  isSaving = false,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4"
    >
      <Input
        id="nama-produk"
        label="Nama Produk"
        type="text"
        placeholder="Contoh: Pulpen"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />

      <Input
        id="harga-produk"
        label="Harga (Rp)"
        type="number"
        placeholder="Contoh: 5000"
        value={harga}
        onChange={(e) => setHarga(e.target.value)}
        min="1"
        step="1"
        required
      />

      <p className="text-sm text-slate-500">
        Harga harus lebih dari 0.
      </p>

      <div className="mt-4 flex gap-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1"
        >
          Batal
        </Button>

        <Button
          type="submit"
          disabled={isSaving}
          className="flex-1"
        >
          {isSaving
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Simpan Produk"}
        </Button>
      </div>
    </form>
  );
}
