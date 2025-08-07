import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalPrice: 0,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        createCartItem: (state, action) => {
            if (!state.items) state.items = [];
            const product = action.payload;
            const exists = state.items.find(item => item.id === product.id);
            if (!exists) {
                state.items.push({ ...product, quantity: 1 });
                state.totalPrice += Number(product.price) || 0;
            } else {
                exists.quantity += 1;
                state.totalPrice += Number(product.price) || 0;
            }
        },
        setCartItems: (state, action) => {
            const payload = action.payload;
            const items = Array.isArray(payload) ? payload : payload.items ?? [];
            const cartItems = items.map(item => ({
                ...item,
                quantity: item.quantity ?? 1
            }));
            const totalPrice =
                cartItems.reduce(
                    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
                    0
                );
            state.items = cartItems;
            state.totalPrice = totalPrice;
        },
        deleteFromCart: (state, action) => {
            const pid = action.payload;
            const removed = state.items.find(it => it.id === pid);
            if (removed) {
                state.items = state.items.filter(it => it.id !== pid);
                state.totalPrice -= (Number(removed.price) || 0) * removed.quantity;
            }
        },
        increaseQuantity: (state, action) => {
            const pid = action.payload;
            const it = state.items.find(i => i.id === pid);
            if (it) {
                it.quantity += 1;
                state.totalPrice += Number(it.price) || 0;
            }
        },
        decreaseQuantity: (state, action) => {
            const pid = action.payload;
            const it = state.items.find(i => i.id === pid);
            if (it) {
                if (it.quantity > 1) {
                    it.quantity -= 1;
                    state.totalPrice -= Number(it.price) || 0;
                } else {
                    state.items = state.items.filter(i => i.id !== pid);
                    state.totalPrice -= Number(it.price) || 0;
                }
            }
        },
        clearCart: state => {
            state.items = [];
            state.totalPrice = 0;
        },
    },
});

export const {
    createCartItem,
    setCartItems,
    deleteFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
