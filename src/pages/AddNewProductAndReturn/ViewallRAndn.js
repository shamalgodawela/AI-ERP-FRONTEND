import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for the toast notifications
import NavBar from '../../compenents/sidebar/NavBar';
import Footer from '../../compenents/footer/Footer';
import './NandRprodcut.css'

const ViewallRAndn = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://nihon-inventory.onrender.com/api/get-alldetail-return');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="return-product-container">
  <NavBar />

  <h1 className="return-product-heading">Return Product Details</h1>
  <ToastContainer />

  <div className="return-product-table-container">
    <table className="return-product-table">
      <thead className="return-table-header">
        <tr className="return-header-row">
          <th className="return-table-cell">Invoice Number/Index No</th>
          <th className="return-table-cell">Invoice Date/Product In Date</th>
          <th className="return-table-cell">Customer</th>
          <th className="return-table-cell">Product Code</th>
          <th className="return-table-cell">Product Name</th>
          <th className="return-table-cell">Quantity</th>
          <th className="return-table-cell">Value</th>
          <th className="return-table-cell">Reason</th>
        </tr>
      </thead>
      <tbody className="return-table-body">
        {products.map((pd, index) => (
          <tr key={index} className="return-body-row">
            <td className="return-table-cell">{pd.invoiceNo}</td>
            <td className="return-table-cell">{pd.InvoiceDte}</td>
            <td className="return-table-cell">{pd.Customer}</td>
            <td className="return-table-cell">{pd.ProductCode}</td>
            <td className="return-table-cell">{pd.productName}</td>
            <td className="return-table-cell">{pd.quanity}</td>
            <td className="return-table-cell">{pd.value}</td>
            <td className="return-table-cell">{pd.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <Footer />
</div>

  );
}

export default ViewallRAndn;
