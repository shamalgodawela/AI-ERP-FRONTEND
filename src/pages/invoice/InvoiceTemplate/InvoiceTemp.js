import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Logo from "../../../assets/Nihon Logo-01.png"
import "./invoicetemp.css"
import ReactToPrint from 'react-to-print';

export default function InvoiceTemp() {

  const containerRef = useRef(null);
  
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-invoice/${id}`);
        setInvoice(response.data);
      } catch (error) {
        console.error(`Failed to fetch invoice with id ${id}`, error.message);
        // Handle error
      }
    };

    fetchInvoice();
  }, [id]);

  const calculateTotal = () => {
    let total = 0;

    if (invoice && invoice.products) {
        total = invoice.products.reduce((acc, product) => {
            const productTotal = product.labelPrice * (1 - product.discount / 100) * product.quantity;
            return acc + productTotal;
        }, 0);
    }

    return total.toFixed(2); // Return the total with 2 decimal places
};

const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const calculateTaxtot = () => {
    if (invoice && invoice.products) {
        const taxRate = invoice.Tax || 0; // Default to 0 if tax rate is not available

        const totalTax = invoice.products.reduce((acc, product) => {
            const productTax = parseFloat(product.invoiceTotal) * (taxRate / 100);
            return acc + productTax;
        }, 0);

        const subtotal = parseFloat(calculateTotal()); // Get the subtotal and parse it to float
        const totalWithTax = subtotal - totalTax; // Add tax amount to subtotal // temp change for discount

        console.log(typeof totalWithTax, totalWithTax); // Log type and value of totalWithTax

        return totalWithTax.toFixed(2); 
    }

    return 0;
};


  if (!invoice) {
    return <div>Loading...</div>;
  }
  

  const productsCount = invoice.products.length;
  const emptyRowsCount = Math.max(6 - productsCount, 0);
  const filledRows = invoice.products.map((product, index) => (
    <tr key={index}>
  <td className="invoice-fontcolor-invoice">{product.productCode}</td>

  {/* Product Name with "3rd word going down" */}
  <td id="invoice-description" className="invoice-fontcolor-invoice">
    {(() => {
      const words = product.productName.split(" ");
      if (words.length > 2) {
        return (
          <>
            {words.slice(0, 2).join(" ")} <br />
            {words.slice(2).join(" ")}
          </>
        );
      } else {
        return product.productName;
      }
    })()}
  </td>

  <td className="invoice-tdquantity">{product.quantity}</td>
  <td className="invoice-fontcolor-invoice">{formatNumbers(product.labelPrice.toFixed(2))}</td>
  <td className="invoice-tddiscount">{formatNumbers(product.discount.toFixed(2))}</td>
  <td id="invoice-unitprice" className="invoice-fontcolor-invoice">{formatNumbers(product.unitPrice.toFixed(2))}</td>
  <td id="invoice-total-id" className="invoice-tdtot">
    {formatNumbers(
      (product.labelPrice * (1 - product.discount / 100) * product.quantity).toFixed(2)
    )}
  </td>
</tr>



    
  ));


  const emptyRows = Array.from({ length: emptyRowsCount }, (_, index) => (
    <tr key={`empty-${index}`}>
      <td className="invoice-td-invoictemp">&nbsp;</td>
      <td className="invoice-td-invoictemp">&nbsp;</td>
      <td className="invoice-td-invoictemp">&nbsp;</td>
      <td className="invoice-td-invoictemp">&nbsp;</td>
      <td className="invoice-td-invoictemp">&nbsp;</td>
      <td className="invoice-td-invoictemp">&nbsp;</td>
      <td className="invoice-td-invoictemp">&nbsp;</td>
    </tr>
  ));
  const allRows = [...filledRows, ...emptyRows];

 
  

  

  return (
    <body>
    <div>
      <a href="/all-invoices">Go Back</a><br/>
      <ReactToPrint
      
        trigger={() => (
          <a href="#">Print this out!</a>
          
        )}
        content={() => containerRef.current}
        documentTitle=" "
        pageStyle="print"
      />
        
      <div ref={containerRef} >
      
        <div className="invoice-wrapper" id="print-area">
        <h1 className="invoice-stock_name">EA1</h1>
          {/* Your existing invoice template code */}
          <div className="invoice-image"><img src={Logo} width="270px" height="100px" /></div>
          <div className="invoice-textheader">
            <h6>No 44, Wawsiri Uyana, Kelepitimulla , Hunumulla</h6>
            <h6>Web: www.nihonagholdings.com</h6>
            <h6>Email: info@nihonagholdings.com</h6>
            <h6>Hotline: 0777666802</h6>
          </div>
          
              <p id='invoice-tax-invoice-text'>{invoice.VatNO}</p>
              <p id='invoice-vat-reg'>{invoice.VatRegNo}</p>
          
          <div className="invoice-container">
            <div className="invoice-head">
              <div className="invoice-head-top">
                <div className="invoice-head-top-left invoice-text-start"></div>
                <div className="invoice-head-top-right invoice-text-end"></div>
              </div>
              <div className="invoice-head-bottom">
                <div className="invoice-head-bottom-left">
                  
                  
                  <ul>
                    <li className='invoice-text-bold1'>Customer Details</li>
                    <li className="invoice-licus"><span className="invoice-label" >Code:</span>{invoice.code}</li>
                    <li className='invoice-cusd1'><span className="invoice-label" >Name:</span>{invoice.customer}</li>
                    <li className='invoice-cusd2'><span className="invoice-label" >Address:</span>{invoice.address}</li>
                    <li className='invoice-cusd3'><span className="invoice-label" >contact:</span>{invoice.contact}</li>
                   
                   
                  </ul>
                </div>
                <div className="invoice-head-bottom">
                  <ul>
                    <li className='invoice-text-boldorder'>Order Details</li>
                    <li className='invoice-cusd45'><span id="invoice-ornumber">Order Number:</span>{invoice.orderNumber}</li>
                    <li className='invoice-cusd4'><span id='invoice-ordate' >Date:</span>{invoice.orderDate}</li>
                    <li className='invoice-cusd44'><span id='invoice-orexe' >Exe:</span>{invoice.exe}</li>
                    <li  className="invoice-ordt" ><span id='invoice-orinvoice'>Invoice No:</span>{invoice.invoiceNumber}</li>
                    <li className='invoice-cusd46' ><span id='invoice-oridate'>Date:</span>{invoice.invoiceDate}</li>
                  </ul>
                </div>
                <p className='invoice-tav-invoice-No'>-{invoice.TaxNo}</p>
              </div>
            </div>
            <h4 className="invoice-table-cell-pay"><span className="invoice-label">Payment Details</span></h4>
            <div className="invoice-table-container">
              <div className="invoice-table-row">
                <div className="invoice-table-cell" id='invoice-mod'><span className="invoice-label" >Mode of Payment:</span>{invoice.ModeofPayment}</div>
                <div className="invoice-table-cell"><span className="invoice-label" id='invoice-mod1'>Terms of Payment:</span>{invoice.TermsofPayment} days</div>
                <div className="invoice-table-cell with-space"><span className="invoice-label" id='invoice-mod2'>Due date:</span>{invoice.Duedate}</div>
              </div>
            </div>
            <div className="overflow-view">
              <div className="invoice-body">
                <table className="invoice-thead-invoicetemp">
                  <thead className="invoice-thead-invoicetemp">
                    <tr>
                      <td  id='invoice-tdtext'>Product Code</td>
                      <td  id='invoice-tdtext'>Description</td>
                      <td   id='invoice-tdtext'>Quantity</td>
                      <td  id='invoice-tdtext'>Label Price</td>
                      <td  id='invoice-tdtext'>Discount</td>
                      <td  id='invoice-tdtext'>Unit Price</td>
                      <td  id='invoice-tdtext'>Invoice Total</td>
                    </tr>
                  </thead>
                  <tbody className="invoice-tbodyinvoice-new">
  {allRows}
</tbody>

                </table>
                <div className="invoice-body-bottom">
                  <div className="invoice-body-info-item invoice-border-bottom">
                    <div className="invoice-info-container">
                      <div className="info-item">
                        <p className="invoice-subject">Invoiced by</p>
                      </div>
                      <div className="info-item-td invoice-text-end invoice-text-bold" id="invoice-second"><span className="invoice-label">SubTotal:</span>{formatNumbers(calculateTotal())}</div>
                    </div>
                  </div>
                  <div className="invoice-body-info-item invoice-border-bottom">
                    <div className="invoice-info-container">
                      <div className="info-item">
                        <p className="invoice-subject">Checked and Approved by</p>
                      </div>
                      {/* <p id='vat-p'>VAT 18%</p> */}
                      {/* <div className="info-item-td invoice-text-end invoice-text-bold" id="invoice-discount"><span className="invoice-label"></span>Add.Discount(3%):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatNumbers((calculateTotal() - calculateTaxtot()).toFixed(2))}</div> */}
                      {/* <div className="info-item-td invoice-text-end invoice-text-bold" id="invoice-tax"><span className="invoice-label">Tax:%</span></div> */}
                    </div>
                  </div>
                  <div className="invoice-body-info-item">
                    <div className="invoice-info-container">
                      <div className="info-item">
                        <p className="invoice-subject">Goods issued by</p>
                      </div>
                      <div className="invoice-info-item-tot" id="invoice-second2"><span className="invoice-label" >Total</span>{formatNumbers(calculateTaxtot())}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="invoice-table-container">
              <div className="invoice-table-row">
                <div className="invoice-table-cell2">Security Checked by</div>
                <div className="invoice-table-cell2">Gate Pass No:{invoice.GatePassNo}</div>
                <div className="invoice-table-cell2 with-space">Vehicle No:</div>
              </div>
            </div>
            <div className="invoice-table-container">
              <div className="invoice-table-row">
                <div className="invoice-table-cell2">Driver Mobile:</div>
                <div className="invoice-table-cell2">Nic:</div>
                <div className="invoice-table-cell2 with-space">Name:</div>
              </div>
            </div>
            <h5 className="invoice-table-cell-pay">I/We acknowledge receipt of the above mentioned goods in good condition</h5>
            <div className="invoice-table-container">
              <div className="invoice-table-row">
                <div className="invoice-table-cell2">Customer stamp</div>
                <div className="invoice-table-cell2">Name and NIC</div>
                <div className="invoice-table-cell2">Signature</div>
                <div className="invoice-table-cell2 with-space">Date:</div>
              </div>
            </div>
            <div className="invoice-table-container">
              <div className="invoice-table-row">
                <div className="invoice-table-cell1"></div>
                <div className="invoice-table-cell1"></div>
                <div className="invoice-table-cell1"></div>
                <div className="invoice-table-cell1 with-space"></div>
              </div>
            </div>
            <h5 className="invoice-table-cell-final">Please draw the cheques infavour of "NIHON AGRICUTURE HOLDINGS (PVT)LTD " A/C PAYEE ONLY</h5>
          </div>
          {/* End of your existing invoice template code */}
        </div>
      </div>
    </div>
    </body>
  );
}
