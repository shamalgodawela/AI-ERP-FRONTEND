import { Link } from "react-router-dom"


const AuthError=()=>{
    return(
        <div>
            <h1>Authentication Error</h1>
            <Link to="/">Go to Home</Link>
            
        </div>
    )
}

export default AuthError;