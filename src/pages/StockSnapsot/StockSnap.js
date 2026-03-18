import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StockSnap.css";
import UserNavbar from "../../compenents/sidebar/UserNavbar/UserNavbar";


const StockSnap = () => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        const res = await axios.get(
          "https://nihon-inventory.onrender.com/api/products/all-snapshots"
        );

        // Ensure res.data is an array
        setSnapshots(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching snapshots", err);
        setSnapshots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshots();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;
  }

  return (
    <div>
      <UserNavbar />
      <div className="stockSnap-container">
        <h2 className="stockSnap-title">Saved Stock Snapshots</h2>

        {snapshots.length === 0 ? (
          <p>No snapshots available</p>
        ) : (
          snapshots.map((snap) => (
            <div key={snap._id} className="stockSnap-card">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(snap.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Total Products:</strong> {snap.data.totalProducts}
              </p>

              <div className="stockSnap-products">
                {Array.isArray(snap.data.products) ? snap.data.products.map((p) => (
                  <div key={p._id} className="stockSnap-product">
                    <span>{p.name}</span> - <span>Qty: {p.quantity}</span> -{" "}
                    <span>Price: {p.price}</span>
                  </div>
                )) : <p>No product details</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StockSnap;