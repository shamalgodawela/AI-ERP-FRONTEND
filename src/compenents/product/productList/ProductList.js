import React, { useEffect, useState } from 'react'
import "./productList.css"
import { SpinnerImg } from '../../loader/Loader'
import { FaEdit, FaTable, FaTrashAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineEye } from 'react-icons/ai'
import Search from '../../search/Search'
import { useDispatch, useSelector } from 'react-redux'
import { FILTER_PRODUCTS, selectFilteredProducts } from '../../../redux/features/product/filterSclice'
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { deleteProduct, getProducts } from '../../../redux/features/product/productSlice'






const ProductList = ({ products, isLoading }) => {
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

      const delProduct= async(id)=>{
        await dispatch(deleteProduct(id))
        await dispatch(getProducts())



      }

      //delete
      const confirmDelete=(id)=>{
        confirmAlert({
          title: 'Delete Product',
          message: 'Are you sure you want to delete this product.',
          buttons: [
            {
              label: 'Delete',
              onClick: () => delProduct(id)
            },
            {
              label: 'Cancel',
              // onClick: () => alert('Click No')
            }
          ]
        });
      }
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

      const calculateSalesPrice = (price, discount) => {
        return price - (price * discount / 100);
      };


      return (
        <div className="product-list">
          <hr />
          <div className="product-table-container">
            <div className="table">
              <div className="--flex-between --flex-dir-column">
                <span>
                  <h3>Finished Product Main Warehouse</h3>
                </span>
                <span>
                <Search
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
                </span>
               
              </div>
    
              {isLoading && <SpinnerImg />}
    
              <div className="table">
                {!isLoading && products.length === 0 ? (
                  <p>-- No product found, please add a product...</p>
                ) : (
                  <table className="modern-product-table">
                    <thead className="modern-table-header">
                      <tr>
                        <th>s/n</th>
                        <th>Name</th>
                        <th>Product Code</th>
                        <th>Price</th>
                        {/* <th>Discount</th> */}
                        <th>Sales Price</th>
                        <th>Quantity</th>
                        <th>Description</th>
                        <th>Value</th>
                        {/* <th>Actions</th> */}
                      </tr>
                    </thead>
                    <tbody className="modern-table-body">
                      {currentItems.map((record, index) => {
                        const { _id, name, category, price, quantity, description, discount } = record;
                        const salesPrice = calculateSalesPrice(price, discount);
                        return (
                          <tr key={_id}>
                            <td>{index + 1}</td>
                            <td>{shortenText(name, 16)}</td>
                            <td>{category}</td>
                            <td>{"Rs:"}{typeof price === 'string' ? formatNumbers(parseFloat(price).toFixed(2)) : formatNumbers(price.toFixed(2))}</td>
                            {/* <td>{discount}%</td> */}
                            <td>{"Rs:"}{formatNumbers(salesPrice.toFixed(2))}</td>
                            <td>{quantity}</td>
                            <td>{formatNumbers(parseFloat(description * quantity).toFixed(2))}</td>
                            <td>{"Rs:"}{typeof price === 'string' ? formatNumbers(parseFloat(salesPrice * quantity).toFixed(2)) : formatNumbers((price * quantity).toFixed(2))}</td>
                            {/* <td className="icons">
                              <span>
                                <Link to={`/edit-product/${_id}`}>
                                  <FaEdit size={20} color={"green"} />
                                </Link>
                              </span>
                              <span>
                                <FaTrashAlt
                                  size={20}
                                  onClick={() => confirmDelete(_id)}
                                />
                              </span>
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div>
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

export default ProductList