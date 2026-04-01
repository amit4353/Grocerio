import protectedAPI from "../utils/protectedApi";

export const getAllOrders = async () => {
    const res = await protectedAPI.get("/orders/users/order");
    return res.data;
}

export const checkout = async () => {
    const res = await protectedAPI.post("/orders/checkout");
    return res.data;
}

export const getUserOrders = async () => {
    const res = await protectedAPI.get("/orders");
    return res.data;
}

export const getOrderById = async (id) => {
    const res = await protectedAPI.get(`/orders/${id}`);
    return res.data.order;
}

export const cancelOrder = async (id) => {
    const res = await protectedAPI.patch(`/orders/cancel/${id}`);
    return res.data;
}

export const updateOrderStatus = async (id, newStatus) => {
    const res = await protectedAPI.patch(`/orders/${id}/status`,{ status : newStatus });
    return res.data;
}