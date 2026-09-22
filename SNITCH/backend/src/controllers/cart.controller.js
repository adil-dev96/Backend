import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;

  const product = await productModel.findById(productId);

  if (!product) {
    return res.status(404).json({
      message: "product not found",
      success: false,
    });
  }

  let stock;
  let selectedPrice;
  let selectedVariant = null;

  if (variantId) {
    console.log("Received variantId:", variantId);

    console.log(
      "Available variants:",
      product.variants.map((variant) => ({
        id: variant._id.toString(),
        stock: variant.stock,
      })),
    );

    selectedVariant = product.variants.id(variantId);

    console.log("Selected variant:", selectedVariant);

    if (!selectedVariant) {
      return res.status(404).json({
        message: "variant not found",
        success: false,
      });
    }

    stock = selectedVariant.stock;
    selectedPrice = selectedVariant.price || product.price;
  } else {
    stock = product.stock;
    selectedPrice = product.price;
  }

  if (quantity > stock) {
    return res.status(404).json({
      message: `only ${stock} items left in stock`,
      success: false,
    });
  }

  const cart =
    (await cartModel.findOne({ user: req.user._id })) ||
    (await cartModel.create({ user: req.user._id }));

  const existingItem = cart.items.find((item) => {
    const sameProduct = item.product.toString() === productId;

    const sameVariant = variantId
      ? item.variant?.toString() === variantId
      : !item.variant;

    return sameProduct && sameVariant;
  });

  if (existingItem) {
    if (existingItem.quantity + quantity > stock) {
      return res.status(400).json({
        message: `only ${stock} item left in stock, and you already have ${existingItem.quantity} items in your cart`,
        success: false,
      });
    }

    existingItem.quantity += quantity;

    await cart.save();

    return res.status(200).json({
      message: "cart updated successfully",
      success: true,
    });
  }

  cart.items.push({
    product: productId,
    ...(variantId && { variant: variantId }),
    quantity,
    price: selectedPrice,
  });

  await cart.save();

  return res.status(200).json({
    message: "product added to cart successfully",
    success: true,
  });
};

export const getCart = async (req, res) => {
  const user = req.user;
  let cart = await cartModel
    .findOne({ user: user._id })
    .populate("items.product");

  if (!cart) {
    cart = await cartModel.create({ user: user._id });
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};

export const incrementCartItemQuantity = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = variantId
    ? await productModel.findOne({
        _id: productId,
        "variants._id": variantId,
      })
    : await productModel.findById(productId);

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "cart not found",
      success: false,
    });
  }

  const stock = variantId
    ? await stockOfVariant(productId, variantId)
    : product.stock;

  const cartItem = cart.items.find((item) => {
    const sameProduct = item.product.toString() === productId;

    const sameVariant = variantId
      ? item.variant?.toString() === variantId
      : !item.variant;

    return sameProduct && sameVariant;
  });

  const itemQuantityInCart = cartItem?.quantity || 0;

  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock, and you already have ${itemQuantityInCart} items in your cart`,
      success: false,
    });
  }

  const itemFilter = variantId
    ? {
        "items.product": productId,
        "items.variant": variantId,
      }
    : {
        "items.product": productId,
        "items.variant": { $exists: false },
      };

  await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      ...itemFilter,
    },
    {
      $inc: { "items.$.quantity": 1 },
    },
    { new: true },
  );

  return res.status(200).json({
    message: "Cart item quantity incremented successfully",
    success: true,
  });
};

export const decrementCartItemQuantity = async (req, res) => {
  const { productId, variantId } = req.params;

  //product check (variant optional)
  const product = variantId
    ? await productModel.findOne({
        _id: productId,
        "variants._id": variantId,
      })
    : await productModel.findById(productId);

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  //cart find
  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  //cart item matching
  const cartItem = cart.items.find((item) => {
    const sameProduct = item.product.toString() === productId;

    const sameVariant = variantId
      ? item.variant?.toString() === variantId
      : !item.variant;

    return sameProduct && sameVariant;
  });

  if (!cartItem) {
    return res.status(404).json({
      message: "Cart item not found",
      success: false,
    });
  }

  //if quantity is one remove the item

  if (cartItem.quantity === 1) {
    const itemFilter = variantId
      ? {
          product: productId,
          variant: variantId,
        }
      : {
          product: productId,
          variant: { $exists: false },
        };

    await cartModel.findOneAndUpdate(
      { user: req.user._id },
      {
        $pull: {
          items: itemFilter,
        },
      },
      { new: true },
    );

    return res.status(200).json({
      message: "cart item removed successfully",
      success: true,
    });
  }

  //otherwise decrease quantity

  const itemFilter = variantId
    ? {
        "items.product": productId,
        "items.variant": variantId,
      }
    : {
        "items.product": productId,
        "items.variant": { $exists: false },
      };

  await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      ...itemFilter,
    },
    {
      $inc: {
        "items.$.quantity": -1,
      },
    },
    {
      new: true,
    },
  );

  return res.status(200).json({
    message: "cart item quantity decreased successfully",
    success: true,
  });
};

export const removeCartItem = async (req, res) => {
  const { productId, variantId } = req.params;

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const cartItem = cart.items.find((item) => {
    const sameProduct = item.product.toString() === productId;

    const sameVariant = variantId
      ? item.variant?.toString() === variantId
      : !item.variant;

    return sameProduct && sameVariant;
  });

  if (!cartItem) {
    return res.status(404).json({
      message: "cart item not found",
      success: false,
    });
  }

  const itemFilter = variantId
    ? {
        product: productId,
        variant: variantId,
      }
    : {
        product: productId,
        variant: { $exists: false },
      };

  await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        items: itemFilter,
      },
    },
    { new: true },
  );

  return res.status(200).json({
    message: "Cart item removed successfully",
    success: true,
  });
};
