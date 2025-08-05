import { useNavigate } from "react-router-dom";
import Footer from "../../../compenents/footer/Footer";
import Getallcheque from "../../Cheque/Allcheque/Getallcheque";

const Allcheque = () => {
    const navigate = useNavigate();
  return (
    <div>
      
      <Getallcheque/>
      <button className="home-btn" onClick={() => navigate('/Admin-operations-dashboard')}>Home</button>
      <Footer/>
    </div>
  );
}
export default Allcheque;