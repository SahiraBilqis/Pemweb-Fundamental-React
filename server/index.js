import express from "express";
import fs from "node:fs/promises";
import path from "node:path";

const app = express();
const PORT = 3001;

app.use(express.json());

const filePath = path.join(process.cwd(), "server", "products.json");

const produkAwal = [
  { id: 1, nama: "Pulpen", harga: 5000 },
  { id: 2, nama: "Buku Tulis", harga: 12000 },
  { id: 3, nama: "Spidol", harga: 8000 },
  { id: 4, nama: "Penggaris", harga: 6000 },
  { id: 5, nama: "Penghapus", harga: 3000 },
];

async function bacaProduk() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;

    await fs.writeFile(filePath, JSON.stringify(produkAwal, null, 2));
    return produkAwal;
  }
}

async function simpanProduk(produk) {
  await fs.writeFile(filePath, JSON.stringify(produk, null, 2));
}

function validasiProduk(nama, harga) {
  return (
    typeof nama === "string" &&
    nama.trim().length > 0 &&
    Number.isSafeInteger(harga) &&
    harga > 0
  );
}

// GET semua produk
app.get("/api/products", async (req, res) => {
  try {
    res.json(await bacaProduk());
  } catch {
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
});

// GET produk berdasarkan ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const produk = await bacaProduk();
    const item = produk.find((p) => p.id === Number(req.params.id));

    if (!item) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json(item);
  } catch {
    res.status(500).json({ message: "Gagal mengambil detail produk" });
  }
});

// POST tambah produk
app.post("/api/products", async (req, res) => {
  try {
    const { nama, harga } = req.body;

    if (!validasiProduk(nama, harga)) {
      return res.status(400).json({ message: "Data produk tidak valid" });
    }

    const produk = await bacaProduk();

    const idBaru = Math.max(0, ...produk.map((p) => p.id)) + 1;

    const itemBaru = {
      id: idBaru,
      nama: nama.trim(),
      harga,
    };

    produk.push(itemBaru);
    await simpanProduk(produk);

    res.status(201).json(itemBaru);
  } catch {
    res.status(500).json({ message: "Gagal menambahkan produk" });
  }
});

// PUT edit produk
app.put("/api/products/:id", async (req, res) => {
  try {
    const { nama, harga } = req.body;

    if (!validasiProduk(nama, harga)) {
      return res.status(400).json({ message: "Data produk tidak valid" });
    }

    const produk = await bacaProduk();
    const index = produk.findIndex((p) => p.id === Number(req.params.id));

    if (index === -1) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    produk[index] = {
      ...produk[index],
      nama: nama.trim(),
      harga,
    };

    await simpanProduk(produk);
    res.json(produk[index]);
  } catch {
    res.status(500).json({ message: "Gagal mengedit produk" });
  }
});

// DELETE hapus produk
app.delete("/api/products/:id", async (req, res) => {
  try {
    const produk = await bacaProduk();
    const id = Number(req.params.id);

    const item = produk.find((p) => p.id === id);

    if (!item) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    await simpanProduk(produk.filter((p) => p.id !== id));

    res.json({ message: "Produk berhasil dihapus" });
  } catch {
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend berjalan di http://localhost:${PORT}`);
});