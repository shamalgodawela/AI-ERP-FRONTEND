import { useNavigate } from "react-router-dom";
import Footer from "../../../compenents/footer/Footer";
import OperationsPaymentTable from "./OperationsPaymentTable";

const OperationsPayments = () => {
    const navigate = useNavigate();
    return (
        <div>
        <OperationsPaymentTable/>
        <button className="home-btn" onClick={() => navigate('/Admin-operations-dashboard')}>Home</button>
        <Footer/>
        </div>
    );
}

export default OperationsPayments;  