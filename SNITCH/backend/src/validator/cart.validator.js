import {param, body, validationResult} from "express-validator";


const validateRequest = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}

export const validateAddToCart =[
    param("productId").isMongoId().withMessage("Invalid product id"),
    param('variantId').optional().isMongoId().withMessage("Invalid variant id"),
    body('quantity').optional().isInt({min:1}).withMessage('quntity must be atleast 1'),
    validateRequest
]

export const validateIncrementCartItemQuantity =[
    param('productId').isMongoId().withMessage("invalid product Id"),
    param('variantId').optional().isMongoId().withMessage("invalid variant id"),
    validateRequest
]

export const validateDecrementCartItemQuantity =[
    param('productId').isMongoId().withMessage("invalid product it"),
    param('variantId').optional().isMongoId().withMessage('invalid variatn id'),
    validateRequest
]

export const validateRemoveCartItem =[
    param('productId').isMongoId().withMessage('invalid product id'),
    param('variantId').optional().isMongoId().withMessage('invalid variant id'),
    validateRequest
]