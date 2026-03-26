import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import AdminnavBar from "../../../compenents/AdminNavbar/AdminnavBar";
import ProductSummary from "../../../compenents/product/productSummary/ProductSummary";
import ProductList from "../../../compenents/product/productList/ProductList";
import Footer from "../../../compenents/footer/Footer";

import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { getProducts } from "../../../redux/features/product/productSlice";


const slugToLabel = {
  "Old-product": "Old product",
  "liquid-chemical": "Liquid chemical",
  liquid: "Liquid",
  fertilizer: "Fertilizer",
  chemical:"Chemical",
  sample:"Sample"
};

const stripHtmlToText = (value) => {
  return (value ?? "")
    .toString()
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const matchesInventoryByDescription = (description, inventoryLabel) => {
  const text = stripHtmlToText(description).toLowerCase();
  const label = (inventoryLabel || "").toString().trim().toLowerCase();

  if (!label || !text) return false;

  // In this project, `description` is used like a category field:
  // it should be exactly one of: "liquid", "liquid chemical", "fertilizer"
  return text === label;
};

const InventoryByDescription = () => {
  useRedirectLoggedOutUser("/All-in-one-Login");
  const navigate = useNavigate();

  const { slug } = useParams();
  const inventoryLabel = slugToLabel[slug] || "";

  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.product);


  useEffect(() => {
    // This page is already behind a ProtectedRoute, so fetch inventory on mount.
    dispatch(getProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    // If no slug is provided, show all products.
    if (!inventoryLabel) return products || [];
    return (products || []).filter((p) =>
      matchesInventoryByDescription(p?.description, inventoryLabel)
    );
  }, [products, inventoryLabel]);

  return (
    <div>
      <AdminnavBar/>
     
      <div style={{ padding: "12px 18px" }}>
        <h3 style={{ margin: "10px 0" }}>
          Inventory: {inventoryLabel || "Unknown"}
        </h3>
      </div>

      <ProductSummary products={filteredProducts} />
      <ProductList products={filteredProducts} isLoading={isLoading} />

      <Footer />
      <button className="home-btn" onClick={() => navigate('/admin-profile')}>Home</button>
    </div>
  );
};

export default InventoryByDescription;

