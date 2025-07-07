import { createContext,useContext,useState, useEffect } from "react";


const AuthProvider=createContext();


const Authcontext=({children})=>{

    const[user,setUser]=useState(() => {
        // Initialize from localStorage if available
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);
    
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