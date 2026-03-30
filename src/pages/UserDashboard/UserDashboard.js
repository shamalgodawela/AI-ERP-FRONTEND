import React, { useEffect } from 'react';
import './dashboard.css';
import UserNavbar from '../../compenents/sidebar/UserNavbar/UserNavbar';


import Footer from '../../compenents/footer/Footer';
import ProductSummary from '../../compenents/product/productSummary/ProductSummary';
import ProductList from '../../compenents/product/productList/ProductList';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../redux/features/product/productSlice';


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

const UserDashboard = () => {
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
      <UserNavbar/>
     
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

export default UserDashboard;
