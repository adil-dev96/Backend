import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],

    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload
            state.items = state.items.map(item => {
                if (item.product._id === productId && item.variant === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                }
                return item
            })
        },
        decrementCartItem:(state,action) =>{
            const {productId,variantId} = action.payload;
            state.items = state.items.map(item=>{
                if(String(item.product._id) === String(productId) && String(item.variant)===String(variantId)){
                    if(item.quantity === 1){
                        return null;
                    }
                    return{...item,quantity:item.quantity -1}
                }
                return item;
            }).filter(Boolean)
        }
    }
})

export const { setItems, addItem, incrementCartItem,decrementCartItem } = cartSlice.actions

export default cartSlice.reducer