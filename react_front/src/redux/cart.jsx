import { createSlice } from "@reduxjs/toolkit";


//FICHIER POUR STOCKER NOS PRODUCT
const initialState = {
items: [],
totalPrice: 0,
};

export const cartSlice = createSlice({
name: "cart",
initialState,
reducers: {
createCartItem: (state, action) => {
    const product = action.payload;
    const exists = state.items.find(item => item.id === product.id);
    if (!exists) {
    state.items.push(product);
    state.totalPrice += Number(product.price); 
    }
},
deleteFromCart: (state, action) => {
    const productId = action.payload;
    const removedItem = state.items.find(item => item.id === productId);
    if (removedItem) {
    state.items = state.items.filter(item => item.id !== productId);
    state.totalPrice -= Number(removedItem.price); 
    }
},
clearCart: (state) => {
    state.items = [];
    state.totalPrice = 0;
},
},
});

export const { createCartItem, deleteFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
