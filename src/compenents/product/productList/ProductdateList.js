import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import { SpinnerImg } from '../../loader/Loader'; // Import loading spinner
import "./productdate.css"

const ProductdateList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true when fetching starts
        const response = await axios.get('http://localhost:5000/api/dateProducts');
        setData(response.data);
        setIsLoading(false); // Set loading to false when fetching completes
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loading to false in case of error
      }
    };
    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'GPN Date',
        accessor: 'GpnDate',
      },
      {
        Header: 'GPN Number',
        accessor: 'GpnNumber',
      },
      {
        Header: 'Product Name',
        accessor: 'productName',
      },
      {
        Header: 'Product Code',
        accessor: 'category',
      },
      {
        Header: 'Unit Price(RS/=)',
        accessor: 'unitPrice',
      },
      {
        Header: 'Number of Units',
        accessor: 'numberOfUnits',
      },
      {
        Header: 'Pack Size',
        accessor: 'packsize',
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div className="product-management">
    <button type="button" className="add-product-btn" disabled>
      <a href="/dateproduct" className="add-product-link">Add Product</a>
    </button>
    {isLoading ? (
      <SpinnerImg />
    ) : (
      <table {...getTableProps()} className="product-table">
        <thead className="table-header">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="header-row">
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="header-cell">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="table-body">
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`body-row ${row.index % 2 === 0 ? 'even-row' : 'odd-row'}`}
              >
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="body-cell">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
  
  );
};

export default ProductdateList;
