import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import { SpinnerImg } from '../../../compenents/loader/Loader'; 
import UserNavbar from '../../../compenents/sidebar/UserNavbar/UserNavbar';


const UserFinishedProduct = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [searchProductCode, setSearchProductCode] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); 
        const response = await axios.get('https://nihon-inventory.onrender.com/api/dateProducts');
        setData(response.data);
        setIsLoading(false); 
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data by date range and product code
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.GpnDate);

    const matchesStartDate = searchStartDate
      ? itemDate >= new Date(searchStartDate)
      : true;

    const matchesEndDate = searchEndDate
      ? itemDate <= new Date(searchEndDate)
      : true;

    const matchesDate = matchesStartDate && matchesEndDate;
    const matchesProductCode = searchProductCode ? 
      item.category.toLowerCase().includes(searchProductCode.toLowerCase()) : true;
    return matchesDate && matchesProductCode;
  });

  // Calculate total number of units for the filtered result
  const totalUnits = filteredData.reduce((sum, item) => {
    const units = Number(item.numberOfUnits) || 0;
    return sum + units;
  }, 0);

  const columns = React.useMemo(
    () => [
      {
        Header: 'GPN Date',
        accessor: 'GpnDate',
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

  const tableInstance = useTable({ columns, data: filteredData });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
<div>
    <UserNavbar/>
    <br/>

    <a href="/add-packing-product" 
   style={{
     display: 'inline-block',
     padding: '10px 20px',
     backgroundColor: '#1e40af',
     color: '#ffffff',
     textDecoration: 'none',
     borderRadius: '6px',
     fontSize: '14px',
     fontWeight: '500'
   }}
>
  Add Packing Details
</a>

    <div className="product-management">
      
      <div className="product-search-bar">
        <input
          type="date"
          placeholder="From Date"
          value={searchStartDate}
          onChange={e => setSearchStartDate(e.target.value)}
          className="search-input"
        />
        <input
          type="date"
          placeholder="To Date"
          value={searchEndDate}
          onChange={e => setSearchEndDate(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by Product Code"
          value={searchProductCode}
          onChange={e => setSearchProductCode(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Summary of the current search result */}
      <div className="product-summary">
        <span>
          Total Number of Units for current search:{" "}
          <strong>{totalUnits}</strong>
        </span>
      </div>

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
    </div>
  );
};

export default UserFinishedProduct;
