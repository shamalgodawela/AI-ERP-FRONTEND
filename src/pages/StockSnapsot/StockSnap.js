import React, { useState } from "react";
import axios from "axios";
import "./StockSnap.css";
import UserNavbar from "../../compenents/sidebar/UserNavbar/UserNavbar";

const StockSnapshot = () => {
  const [stockSnapLoading, setStockSnapLoading] = useState(false);
  const [stockSnapMessage, setStockSnapMessage] = useState("");

  const handleStockSnapSave = async () => {
    try {
      setStockSnapLoading(true);
      setStockSnapMessage("");

      const res = await axios.get("https://nihon-inventory.onrender.com/api/products/save-daily-stock");

      setStockSnapMessage(res.data.message);
    } catch (error) {
      setStockSnapMessage(
        error.response?.data?.message || "Error saving stock"
      );
    } finally {
      setStockSnapLoading(false);
    }
  };

  return (
    <div>
        <UserNavbar/>
    <div className="stockSnap-container">
      <h2 className="stockSnap-title">Stock Snapshot</h2>

      <button
        className="stockSnap-btn"
        onClick={handleStockSnapSave}
        disabled={stockSnapLoading}
      >
        {stockSnapLoading ? "Saving..." : "Save Daily Stock"}
      </button>

      {stockSnapMessage && (
        <p className="stockSnap-message">{stockSnapMessage}</p>
      )}
    </div>
    </div>
  );
};

export default StockSnapshot;