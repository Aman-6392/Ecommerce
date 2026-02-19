const API =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getProducts = async () => {
  try {
    const res = await fetch(`${API}/api/products`);

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error.message);
    return [];
  }
};