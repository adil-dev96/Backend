import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart,validateIncrementCartItemQuantity,validateDecrementCartItemQuantity,validateRemoveCartItem } from "../validator/cart.validator.js";
import { addToCart, getCart,incrementCartItemQuantity,decrementCartItemQuantity,removeCartItem } from "../controllers/cart.controller.js";

const router = express.Router()

/**
 * @route POST /api/cart/add/:productId
 * @route POST /api/cart/add/:productId/:variantId
 * @desc add item to cart
 * @access Private
 * @argument productId - id of the product to be added to cart
 * @argument variantId - id of the variant to be added to cart
 * @argument quantity - quantity of the product to be added to cart (optional, default is 1)
 */

router.post('/add/:productId', authenticateUser,validateAddToCart,addToCart)
router.post('/add/:productId/:variantId', authenticateUser,validateAddToCart,addToCart)

router.get('/', authenticateUser, getCart)

router.patch('/quantity/increment/:productId', authenticateUser,validateIncrementCartItemQuantity,incrementCartItemQuantity)
router.patch('/quantity/increment/:productId/:variantId', authenticateUser,validateIncrementCartItemQuantity,incrementCartItemQuantity)

router.patch('/quantity/decrement/:productId', authenticateUser,validateDecrementCartItemQuantity,decrementCartItemQuantity )
router.patch('/quantity/decrement/:productId/:variantId', authenticateUser,validateDecrementCartItemQuantity,decrementCartItemQuantity )

router.delete('/remove/:productId', authenticateUser,validateRemoveCartItem ,removeCartItem)
router.delete('/remove/:productId/:variantId', authenticateUser,validateRemoveCartItem ,removeCartItem)



export default router;