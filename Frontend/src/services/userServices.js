import protectedAPI from "../utils/protectedApi"

export const getAllUsers = async () => {
    const res = await protectedAPI.get("/users/users");
    return res.data;
}

export const deleteUser = async () => {
    const res = await protectedAPI.post("/");
    return res.data;
}

export const getUserProfile = async () => {
    const res = await protectedAPI.get("/users/profile");
    return res.data;
}

export const updateUserProfile = async (data) => {
    const res = await protectedAPI.put("/users/update" , {
        name : data.name,
        email : data.email,
        address : data.address
    })
    return res.data;
}

export const changePassword = async (data) => {
    const res = await protectedAPI.put("/users/update/password" , {
        oldPassword : data.oldPassword,
        newPassword : data.newPassword
    });

    return res.data;
}
