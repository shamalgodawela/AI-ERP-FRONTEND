import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import AdminnavBar from "../../../compenents/AdminNavbar/AdminnavBar";
import ProductSummary from "../../../compenents/product/productSummary/ProductSummary";
import ProductList from "../../../compenents/product/productList/ProductList";
import Footer from "../../../compenents/footer/Footer";

import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../../redux/features/auth/authSlice";
import { getProducts } from "../../../redux/features/product/productSlice";
import UserNavbar from "../../../compenents/sidebar/UserNavbar/UserNavbar";

const slugToLabel = {
  "liquid-chemical": "Liquid chemical",
  liquid: "Liquid",
  fertilizer: "Fertilizer",
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
  useRedirectLoggedOutUser("/login");

  const { slug } = useParams();
  const inventoryLabel = slugToLabel[slug] || "";

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { products, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProducts());
    }
  }, [isLoggedIn, dispatch]);

  const filteredProducts = useMemo(() => {
    if (!inventoryLabel) return [];
    return (products || []).filter((p) =>
      matchesInventoryByDescription(p?.description, inventoryLabel)
    );
  }, [products, inventoryLabel]);

  return (
    <div>
      <UserNavbar />
      <div style={{ padding: "12px 18px" }}>
        <h3 style={{ margin: "10px 0" }}>
          Inventory: {inventoryLabel || "Unknown"}
        </h3>
      </div>

      <ProductSummary products={filteredProducts} />
      <ProductList products={filteredProducts} isLoading={isLoading} />

      <Footer />
    </div>
  );
};

export default InventoryByDescription;

