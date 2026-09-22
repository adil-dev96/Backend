import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const addItem = async ({ productId, variantId,quantity }) => {
    const url = variantId ? `/add/${productId}/${variantId}`: `/add/${productId}`

    const response = await cartApiInstance.post(url,{quantity:quantity})
    return response.data
}

export const getCart = async () => {
    const response = await cartApiInstance.get('/')
    return response.data
}

export const incrementCartItemApi = async ({ productId, variantId }) => {
    const url = variantId ? `/quantity/increment/${productId}/${variantId}`:`/quantity/increment/${productId}`;
    const response = await cartApiInstance.patch(url);
    return response.data
}

export const decrementCartItemApi = async ({ productId, variantId }) => {
    const url = variantId ? `/quantity/decrement/${productId}/${variantId}`:`/quantity/decrement/${productId}`;

    const response = await cartApiInstance.patch(url);
    return response.data
}

export const removeCartItemApi = async({productId,variantId}) =>{
    const url = variantId ? `/remove/${productId}/${variantId}`:`/remove/${productId}`;
    const response = await cartApiInstance.delete(url);
    return response.data
}