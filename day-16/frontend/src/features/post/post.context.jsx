import { createContext, useState } from "react";

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [Loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [feed, setfeed] = useState(null);


  return (
    <PostContext.Provider value={{Loading,setLoading,post,setPost,feed,setfeed}}>{children}</PostContext.Provider>
  )
};


