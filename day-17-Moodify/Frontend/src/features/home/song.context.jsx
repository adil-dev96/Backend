import { createContext } from "react";
import { useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {
  const[song, setSong] = useState({
  
    "url": "https://ik.imagekit.io/lg0khbxcq/modify/songs/Jatt_Mehkma__RiskyjaTT.CoM__Gn6Xn2YB-.mp3",
    "posterUrl":"https://ik.imagekit.io/lg0khbxcq/modify/posters/Jatt_Mehkma__RiskyjaTT.CoM__bI8y23fc_.jpeg",
    "title": "Jatt Mehkma (RiskyjaTT.CoM)",
    "mood": "happy"
  })


  const [loading, setLoading] = useState(false)

  return(
    <SongContext.Provider value={{loading,setLoading,song,setSong}} >
        {children}
    </SongContext.Provider>
  )
}
