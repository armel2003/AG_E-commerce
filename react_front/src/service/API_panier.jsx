const URL = "http://localhost:8000"; 



export async function ShowCart() {
const res = await fetch(`${URL}/cart`, {
credentials: "include", 
});
return res.json();
}

export async function addCart(productId) {
const res = await fetch(`${URL}/cart/${productId}`, {
method: "POST",
credentials: "include",
});
return res.json();
}

export async function removeCart(productId) {
const res = await fetch(`${URL}/cart/${productId}`, {
method: "DELETE",
credentials: "include",
});
return res.json();
}

export async function clearCart() {
const res = await fetch(`${URL}/cart/empty`, {
method: "DELETE",
credentials: "include",
});
return res.json();
}
