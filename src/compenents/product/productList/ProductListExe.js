import React, { useEffect, useState } from 'react'
import "./productList.css"
import { SpinnerImg } from '../../loader/Loader'
import { FaEdit, FaTable, FaTrashAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { AiOutlineEye } from 'react-icons/ai'
import Search from '../../search/Search'
import { useDispatch, useSelector } from 'react-redux'
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { deleteProduct, getProducts } from '../../../redux/features/product/productSlicaExe'
import { FILTER_PRODUCTS, selectFilteredProducts } from '../../../redux/features/product/filterSliceExe'






const ProductListExe = ({ products, isLoading }) => {
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredProducts);


  const dispatch = useDispatch();


    const shortenText = (text, n) => {
        if (text.length > n) {
          const shortenedText = text.substring(0, n).concat("...");
          return shortenedText;
        }
        return text;
      };

      

      //delete
      
       //   Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };
  //   End Pagination

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

      
      const formatNumbers = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };


      return (
        <div className="product-list">
          <hr />
          <div className="table">
            <div className="--flex-between --flex-dir-column">
              <span>
                <h3>Inventory Items</h3>
              </span>
              
             
            </div>
    
            {isLoading && <SpinnerImg />}
    
            <div className="table">
              {!isLoading && products.length === 0 ? (
                <p>-- No product found, please add a product...</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>s/n</th>
                      <th>Name</th>
                      <th>Product Code</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Value</th>
                  
                    </tr>
                  </thead>
    
                  <tbody>
                    {currentItems.map((record, index) => {
                      const { _id, name, code, price, quantity } = record;
                      return (
                        <tr key={_id}>
                          <td>{index + 1}</td>
                          <td>{shortenText(name, 16)}</td>
                          <td>{code}</td>
                          <td>
                          {"Rs:"}
                          {typeof price === 'string' ? formatNumbers(parseFloat(price).toFixed(2)) : formatNumbers(price.toFixed(2))}
                          </td>


                          <td>{quantity}</td>
                          <td>
                          {"Rs:"}
                          {typeof price === 'string' ? formatNumbers(parseFloat(price * quantity).toFixed(2)) : formatNumbers((price * quantity).toFixed(2))}
                          </td>
                          
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={4}
        pageCount={pageCount}
        previousLabel="< Prev"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
      />
            
          </div>
        </div>
      );
}

export default ProductListExe