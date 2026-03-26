import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import UserNavbar from "../../compenents/sidebar/UserNavbar/UserNavbar";
import Footer from "../../compenents/footer/Footer";
import ProductSummary from "../../compenents/product/productSummary/ProductSummary";
import ProductList from "../../compenents/product/productList/ProductList";

import { getProducts } from "../../redux/features/product/productSlice";

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
  return text === label;
};

const UserInventoryByDescription = () => {
  const { slug } = useParams();
  const inventoryLabel = slugToLabel[slug] || "";

  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    if (!inventoryLabel) return products || [];
    return (products || []).filter((p) =>
      matchesInventoryByDescription(p?.description, inventoryLabel)
    );
  }, [products, inventoryLabel]);

  return (
    <div>
      <UserNavbar />
      <div style={{ padding: "12px 18px" }}>
        <h3 style={{ margin: "10px 0" }}>
          Inventory: {inventoryLabel || "All"}
        </h3>
      </div>

      <ProductSummary products={filteredProducts} />
      <ProductList
        products={filteredProducts}
        isLoading={isLoading}
        inventoryLinksBase="/user-inventory"
      />

      <Footer />
    </div>
  );
};

export default UserInventoryByDescription;

