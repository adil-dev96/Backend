import {body,validationResult} from "express-validator";

function validateRequest(req,res,next){
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({message:"validation error",errors:errors.array()})
    }

    next();

}

export const createProductValidator = [
    body("title").notEmpty().withMessage("title is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("priceAmount").isNumeric().withMessage("priceAmount must be a number"),
    body("priceCurrency").notEmpty().withMessage("priceCurrency is required"),
    validateRequest
]