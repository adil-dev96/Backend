import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const addItem = async ({ productId, variantId,quantity }) => {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity:quantity
    })
    return response.data
}

export const getCart = async () => {
    const response = await cartApiInstance.get('/')
    return response.data
}

export const incrementCartItemApi = async ({ productId, variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/increment/${productId}/${variantId}`)
    return response.data
}

export const decrementCartItemApi = async ({ productId, variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/decrement/${productId}/${variantId}`)
    return response.data
}

export const removeCartItemApi = async({productId,variantId}) =>{
    const url = variantId ? `/remove/${productId}/${variantId}`:`/remove/${productId}`;
    const response = await cartApiInstance.delete(url);
    return response.data
}