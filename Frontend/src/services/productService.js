import API from "../utils/api";
import protectedAPI from "../utils/protectedApi";

export const getProducts = async () => {
    const res = await API.get("/products");
    return res.data;
}

export const getProductById = async (id) => {
    const res = await API.get(`/products/${id}`)
    return res.data;
}

export const createProduct = async (formData) => {
    // Send FormData directly – axios will set multipart/form-data header
    const res = await protectedAPI.post(`products/add`, formData);
    return res.data;
}

export const updateProduct = async (id, formData) => {
    const res = await protectedAPI.put(`/products/update/${id}`, formData);
    return res.data;
}

export const deleteProduct = async (id) => {
    const res = await protectedAPI.delete(`/products/delete/${id}`);
    return res.data;
}