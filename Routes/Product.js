import express from "express";
import { uploadFiles } from "../Middleware/multer.js";
import { createProduct , fetchProductsByCategory , fetchSingleProduct , ProductSearch, addToCart, updateProduct,getCart , incrementItem , decrementItem , getMostPurchasedProducts , getAllCartsForAdmin, deleteProduct , removeItem, BuyNowProducts, getBuyNowOrders } from "../controllers/Product.js";

const router = express.Router();
router.post("/product/new" , uploadFiles , createProduct);
router.get("/product/all-products", fetchProductsByCategory);
router.get("/product/single/:id", fetchSingleProduct);
router.get('/products/search', ProductSearch);
router.put('/products/:id', updateProduct);
router.get('/cart/:userId', getCart);
router.post("/cart" , addToCart);
router.post('/cart/increment', incrementItem);
router.post('/cart/decrement', decrementItem);
router.get("/product/MostPurchasedProducts", getMostPurchasedProducts);
router.get('/admin/carts', getAllCartsForAdmin);
router.delete('/product/all-products/:id' , deleteProduct)
router.delete('/cart/delete' , removeItem)
router.post("/buy" , BuyNowProducts);
router.get('/user/buy', getBuyNowOrders);



export default router;



