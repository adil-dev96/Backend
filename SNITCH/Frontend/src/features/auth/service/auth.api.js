import axios from "axios"

const authApiInstance = axios.create({
    baseURL: "http://loacalhost:3000/api/auth",
    withCredentials: true,
})

export async function register({ email, fullname, password, contact, isSeller }) {

    const response = await authApiInstance.post("/register", {
        email,
        fullname,
        password,
        contact,
        isSeller
    })

    return response.data


}