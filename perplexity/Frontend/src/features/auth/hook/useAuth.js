import { useDispatch } from "react-redux";
import { register,login,getMe } from "../service/auth.api";
import { setUser,setLoading,setError } from "../auth.slice";

export function useAuth(){
    const dispatch=useDispatch()
    async function handleRegister({email,username,password}) {
        try {
            dispatch (setLoading(true))
            const data = await register({username,email,password})
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
        }finally{ 
            dispatch(setLoading(false))
        }
    }


    async function  handleLogin({email,password}) {
        try{
            dispatch(setLoading(true))
            const data = await login({email,password})
            dispatch(setUser(data.user))
        }catch(err){
            dispatch(setError(err.response?.data?.message || "login failed"))
        }finally{
            dispatch(setLoading(false))
        }
        
    }

    async function  handleGetme() {
        try{
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        }catch(err){
             dispatch(setError(err.response?.data?.message||"failed to fetch user data"))
        }finally{
            dispatch(setLoading(false))
        }
        
    }


    return {
        handleGetme,
        handleLogin,
        handleRegister
    }
}   