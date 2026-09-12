import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/prouducts",
    withCredentials: true,
})