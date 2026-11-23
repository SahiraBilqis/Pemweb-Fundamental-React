const API_URL = "/api/products";

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Terjadi kesalahan API");
  }

  return response.json();
}

export const productApi = {
  getAll: () => request(API_URL),

  getById: (id) => request(`${API_URL}/${id}`),

  create: (data) =>
    request(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    request(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (id) =>
    request(`${API_URL}/${id}`, {
      method: "DELETE",
    }),
};