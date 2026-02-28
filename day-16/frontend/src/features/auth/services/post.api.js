import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export async function getfeed() {
    const response = await api.get('/api/posts/feed')
    return response.data
}