import { getfeed } from "../services/post.api";
import { useContext } from "react";
import { PostContext} from "../../post/post.context";

export const usePost=()=>{
const context = useContext(PostContext)

const{Loading,setLoading,post,setPost,feed,setfeed}= context

const handleGetFeed=async()=>{
    setLoading(true)
const data = await getfeed()
setfeed(data.posts)
setLoading(false)
}

return{Loading,feed,post,handleGetFeed}
}