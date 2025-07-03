import { createContext,useContext,useState } from "react";


const AuthProvider=createContext();


const Authcontext=({children})=>{

    const[user,setUser]=useState(null);
    
    return(
        <div>
            <AuthProvider.Provider value={{user,setUser}}>
                {children}
            </AuthProvider.Provider>

        </div>
    )
}

export const useAuth = () => useContext(AuthProvider);
export default Authcontext;