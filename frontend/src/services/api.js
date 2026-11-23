// IMPORTANT:
// Physical phone: replace 192.168.1.5 with your Mac's Wi-Fi IP address.
// Mac command: ipconfig getifaddr en0
// iOS Simulator can usually use: http://localhost:5000/api/todos
// Android Emulator can usually use: http://10.0.2.2:5000/api/todos

export const API_URL = "http://192.168.1.81:5000/api/todos";

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }

  return data;
}

export const todoApi = {
  getAll: () => request(API_URL),

  create: (title) =>
    request(API_URL, {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  update: (id, changes) =>
    request(`${API_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    }),

  remove: (id) =>
    request(`${API_URL}/${id}`, {
      method: "DELETE",
    }),
};
