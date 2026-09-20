import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const router = express.Router()

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc add item to cart
 * @access Private
 * @argument productId - id of the product to be added to cart
 * @argument variantId - id of the variant to be added to cart
 * @argument quantity - quantity of the product to be added to cart (optional, default is 1)
 */

router.post('/add/:productId/:variantId', authenticateUser,validateAddToCart,addToCart)

router.get('/', authenticateUser, getCart)

export default router;