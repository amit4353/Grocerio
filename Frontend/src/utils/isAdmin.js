const isAdmin = (user) => {
    return user?.email === import.meta.env.VITE_ADMIN_EMAIL;
}

export default isAdmin;