
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

export const createProduct = async (data) => {
    const res = await protectedAPI.post(`products/add`,{
        name : data.name,
        brand : data.brand,
        price : data.price,
        image : data.image,
        description : data.description,
        stock : data.stock
    })
}

export const updateProduct = async (id , data) => {
    const res = await protectedAPI.put(`/products/update/${id}`, {
        name : data.name,
        brand : data.brand,
        price : data.price,
        image : data.image,
        description : data.description,
        stock : data.stock
    })
}

export const deleteProduct = async (id) => {
    const res = await protectedAPI.delete(`/products/delete/${id}`);
    return res.data;
}
