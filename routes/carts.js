const express = require("express");
const CartManager = require("../managers/CartManager");
const auth = require("../middlewares/auth");

const router = express.Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const updatedCart = await cartManager.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    res.json(updatedCart);
  } catch (error) {
    if (error.message === "Carrito no encontrado") {
      return res.status(404).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

// Endpoint para obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json(carts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

// Estadísticas de carritos
router.get("/stats/general", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    const stats = {
      total: carts.length,
      withProducts: carts.filter((c) => c.products.length > 0).length,
      empty: carts.filter((c) => c.products.length === 0).length,
      totalProducts: carts.reduce((sum, c) => sum + c.products.length, 0),
    };
    res.json(stats);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

module.exports = router;
