const API = process.env.REACT_APP_API_URL;

export const getProducts = async () => {
  const res = await fetch(`${API}/api/products`);
  return res.json();
};