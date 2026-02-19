const addProduct = (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  res.json({
    message: "Product added successfully",
    product: req.body,
    image: req.file,
  });
};

const deleteProduct = (req, res) => {
  res.json({ message: "Product deleted successfully" });
};

module.exports = { addProduct, deleteProduct };