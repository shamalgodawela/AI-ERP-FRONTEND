import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";


import {
  getProduct,
  getProducts,
  selectIsLoading,
  selectProduct,
  updateProduct,
} from "../../redux/features/product/productSlice";
import Loader from "../../compenents/loader/Loader";
import ProductForm from "../../compenents/productForm/ProductForm";
import NavBar from "../../compenents/sidebar/NavBar";
import Footer from "../../compenents/footer/Footer";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);

  const productEdit = useSelector(selectProduct);

  const [product, setProduct] = useState(productEdit);
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    setProduct(productEdit);

    setImagePreview(
      productEdit && productEdit.image ? `${productEdit.image.filePath}` : null
    );

    setDescription(
      productEdit && productEdit.description ? productEdit.description : ""
    );
  }, [productEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const fromData = new FormData();
    fromData.append("name", product.name);

    fromData.append("code", product.code);
    fromData.append("quantity", product.quantity);
    fromData.append("price", product.price);
    fromData.append("description", description);
    if (productImage) {
        fromData.append("image", productImage);
      }



      console.log(...fromData);

      await dispatch(updateProduct({ id, fromData }));
      await dispatch(getProducts());
      navigate("/dashboard");
  };



  return (
    <div>
      
      {isLoading && <Loader />}
      <h3 className="--mt">Edit Product</h3>
      <br/><br/>
      <ProductForm
        product={product}
        productImage={productImage}
        imagePreview={imagePreview}
        description={description}
        setDescription={setDescription}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        saveProduct={saveProduct}
       
      />
       <Footer/>
    </div>
  );
};

export default EditProduct;