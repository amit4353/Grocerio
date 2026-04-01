import protectedAPI from "../utils/protectedApi";

export const getCart = async () => {
    const res = await protectedAPI.get("/cart");
    return res.data;
}

export const addToCart = async ({product_id,quantity}) => {
    const res = await protectedAPI.post("/cart/add",{
        product_id,
        quantity,
    });
    return res.data;
};

export const removeFromCart = async (id) => {
    const res = await protectedAPI.delete(`/cart/remove/${id}`);
    return res.data;
}

export const updateCartItem = async (id , quantity) => {
    const res = await protectedAPI.put(`/cart/update/${id}`, {quantity});
    return res.data;
}