import API from "../utils/api";
import protectedAPI from "../utils/protectedApi";

export const loginUser = async (data) => {
    const res = await API.post("/users/login", data);
    return res.data;
}

export const registerUser = async (data) => {
    const res = await API.post("/users/register",data);
    return res.data;
}

export const logoutUser = async () => {
    try {
        const res = await protectedAPI.post("/users/logout");
        return res.data;
    } catch (err) {
        console.log(err);
    } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
}