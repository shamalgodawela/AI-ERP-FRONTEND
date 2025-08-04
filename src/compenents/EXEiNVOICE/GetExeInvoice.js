import { useEffect, useState } from "react";
import axios from "axios";
import HeaderExe from "../headerexe/HeaderExe";
import './exe-invoiceCss.css';
import { AiOutlineEye } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";

const GetExeInvoice = () => {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");

  const fetchInvoices = async () => {
    try {
              const response = await axios.get(`https://nihon-inventory.onrender.com/api/exe-getinvoice?password=${password}`);
      setInvoices(response.data);
      setError("");
    } catch (err) {
      setError("Invalid password or server error");
      setInvoices([]);
    }
  };

  
  useEffect(() => {
    const fetchSingleInvoice = async () => {
      if (id) {
        try {
          const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-invoice/${id}`);
          
          console.log(response.data); 
        } catch (error) {
          console.log("Error fetching data", error);
        }
      }
    };

    fetchSingleInvoice();
  }, [id]); 

  return (
    <div className="exetable-invoice">
      <HeaderExe />
      <br /><br /><br /><br />
      <div className="exetable-container">
        <h2>Invoice List</h2>
        <input
          type="password"
          className="exetable-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="exetable-button" onClick={fetchInvoices}>
          Get Invoices
        </button>

        {error && <p className="exetable-error">{error}</p>}

        {invoices.length > 0 && (
          <table className="exetable-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Customer</th>
                <th>Code</th>
                <th>Mode of Payment</th>
                <th>Terms of Payment (days)</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.customer}</td>
                  <td>{invoice.code}</td>
                  <td>{invoice.ModeofPayment}</td>
                  <td>{invoice.TermsofPayment}</td>
                  <td>{invoice.invoiceDate}</td>
                  <td>{invoice.Duedate}</td>
                  <td className="td-invoice">
                    <Link to={`/invoice-temp-exe/${invoice._id}`}>
                      <AiOutlineEye size={20} color={"purple"} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GetExeInvoice;
