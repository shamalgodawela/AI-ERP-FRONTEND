import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Logo from "../../../assets/Nihon Logo-01.png"
import "./viewinvoice.css"
import ReactToPrint from 'react-to-print';

export default function ViewInvoice() {

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

    return total.toFixed(2);
};

const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const calculateTaxtot = () => {
    if (invoice && invoice.products) {
        const taxRate = invoice.Tax || 0; 

        const totalTax = invoice.products.reduce((acc, product) => {
            const productTax = parseFloat(product.invoiceTotal) * (taxRate / 100);
            return acc + productTax;
        }, 0);

        const subtotal = parseFloat(calculateTotal()); 
        const totalWithTax = subtotal - totalTax; 

        console.log(typeof totalWithTax, totalWithTax);

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
      <td className="fontfamily-td-1">{product.productCode}</td>
      <td className="fontfamily-td-1">{product.productName}</td>
      <td className="tdquantity-1">{product.quantity}</td>
      <td className="fontfamily-td-1">{formatNumbers(product.labelPrice.toFixed(2))}</td>
      <td className="tddiscount-1">{product.discount}</td>
      <td className="fontfamily-td-1">{formatNumbers(product.unitPrice.toFixed(2))}</td>
      <td className="tdtot-1" style={{ textAlign: 'end' }}>
  {formatNumbers((product.labelPrice * (1 - product.discount / 100) * product.quantity).toFixed(2))}
</td>


    </tr>
  ));
  const emptyRows = Array.from({ length: emptyRowsCount }, (_, index) => (
    <tr key={`empty-${index}`}>
      <td className="td-invoictemp-1">&nbsp;</td>
      <td className="td-invoictemp-1">&nbsp;</td>
      <td className="td-invoictemp-1">&nbsp;</td>
      <td className="td-invoictemp-1">&nbsp;</td>
      <td className="td-invoictemp-1">&nbsp;</td>
      <td className="td-invoictemp-1">&nbsp;</td>
      <td className="td-invoictemp-1">&nbsp;</td>
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
        <div class="invoice-wrapper-1" id="print-area">
          {/* Your existing invoice template code */}
          <div className="image-1"><img src={Logo} width="270px" height="100px" /></div>
          <div className="textheader-1">
            <h6>No 44, Wawsiri Uyana, Kelepitimulla , Hunumulla</h6>
            <h6>Web: www.nihonagholdings.com</h6>
            <h6>Email: info@nihonagholdings.com</h6>
            <h6>Hotline: 0777666802</h6>
          </div>
              <p id='tax-invoice-text-1'>{invoice.VatNO}</p>
              <p id='vat-reg-1'>{invoice.VatRegNo}</p>
          
          <div class="invoice-container-1">
            <div class="invoice-head-1">
              <div class="invoice-head-top-1">
                <div class="invoice-head-top-left text-start"></div>
                <div class="invoice-head-top-right text-end"></div>
              </div>
              <div class="invoice-head-bottom-1">
                <div class="invoice-head-bottom-left-1">
                  
                  <ul>
                    <li class='text-bold1-1'>Customer Details</li>
                    <li className="licus-1"><span class="label-1" >Code:</span>{invoice.code}</li>
                    <li className='cusd1-1'><span class="label-1" >Name:</span>{invoice.customer}</li>
                    <li className='cusd2-1'><span class="label-1" >Address:</span>{invoice.address}</li>
                    <li className='cusd3-1'><span class="label-1" >contact:</span>{invoice.contact}</li>
                  </ul>
                </div>
                <div class="invoice-head-bottom-1">
                  <ul>
                    <li class='text-boldorder-1'>Order Details</li>
                    <li className='cusd45-1'><span id="ornumber-1">Order Number:</span>{invoice.orderNumber}</li>
                    <li className='cusd4-1'><span id='ordate-1' >Date:</span>{invoice.orderDate}</li>
                    <li className='cusd44-1'><span id='orexe-1' >Exe:</span>{invoice.exe}</li>
                    <li  className="ordt-1" ><span id='orinvoice-1'>Invoice No:</span>{invoice.invoiceNumber}</li>
                    <li className='cusd46-1' ><span id='oridate-1'>Date:</span>{invoice.invoiceDate}</li>
                  </ul>
                </div>
                <p className='tav-invoice-No-1'>-{invoice.TaxNo}</p>
              </div>
            </div>
            <h4 className="table-cell-pay-1"><span class="label-1">Payment Details</span></h4>
            <div className="table-container-1">
              <div className="table-row-1">
                <div className="table-cell-1" id='mod'><span class="label-1" >Mode of Payment:</span>{invoice.ModeofPayment}</div>
                <div className="table-cell-1"><span class="label-1" id='mod1-1'>Terms of Payment:</span>{invoice.TermsofPayment} days</div>
                <div className="table-cell with-space"><span class="label-1" id='mod2-1'>Due date:</span>{invoice.Duedate}</div>
              </div>
            </div>
            <div class="overflow-view-1">
              <div class="invoice-body-1">
                <table className="thead-invoicetemp-1">
                  <thead className="thead-invoicetemp-1">
                    <tr>
                      <td  id='tdtext-1'>Product Code</td>
                      <td  id='tdtext-1'>Description</td>
                      <td   id='tdtext-1'>Quantity</td>
                      <td  id='tdtext-1'>Label Price</td>
                      <td  id='tdtext-1'>Discount</td>
                      <td  id='tdtext-1'>Unit Price</td>
                      <td  id='tdtext-1'>Invoice Total</td>
                    </tr>
                  </thead>
                  <tbody>
                    {allRows}
                  </tbody>
                </table>
                <div class="invoice-body-bottom-1">
                  <div class="invoice-body-info-item border-bottom">
                    <div className="info-container-1">
                      <div className="info-item-1">
                        <p className="subject-1">Invoiced by</p>
                      </div>
                      <div className="info-item-td text-end text-bold" id="second-1"><span class="label-1">SubTotal:</span>{formatNumbers(calculateTotal())}</div>
                    </div>
                  </div>
                  <div class="invoice-body-info-item border-bottom">
                    <div className="info-container-1">
                      <div className="info-item-1">
                        <p className="subject-1">Checked and Approved by</p>
                      </div>
                      {/* <p id='vat-p'>VAT 18%</p> */}
                      {/* <div className="info-item-td text-end text-bold" id="discount"><span class="label"></span>Add.Discount(3%):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatNumbers((calculateTotal() - calculateTaxtot()).toFixed(2))}</div> */}
                      {/* <div className="info-item-td text-end text-bold" id="tax"><span class="label">Tax:%</span></div> */}
                    </div>
                  </div>
                  <div class="invoice-body-info-item-1">
                    <div className="info-container-1">
                      <div className="info-item-1">
                        <p className="subject-1">Goods issued by</p>
                      </div>
                      <div className="info-item-tot-1" id="second2-1"><span class="label-1" >Total</span>{formatNumbers(calculateTaxtot())}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-container-1">
              <div className="table-row-1">
                <div className="table-cell2-1">Security Checked by</div>
                <div className="table-cell2-1">Gate Pass No:{invoice.GatePassNo}</div>
                <div className="table-cell2 with-space">Vehicle No:</div>
              </div>
            </div>
            <div className="table-container-1">
              <div className="table-row-1">
                <div className="table-cell2-1">Driver Mobile:</div>
                <div className="table-cell2-1">Nic:</div>
                <div className="table-cell2 with-space">Name:</div>
              </div>
            </div>
            <h5 className="table-cell-pay-1">I/We acknowledge receipt of the above mentioned goods in good condition</h5>
            <div className="table-container-1">
              <div className="table-row-1">
                <div className="table-cell2-1">Customer stamp</div>
                <div className="table-cell2-1">Name and NIC</div>
                <div className="table-cell2-1">Signature</div>
                <div className="table-cell2 with-space">Date:</div>
              </div>
            </div>
            <div className="table-container-1">
              <div className="table-row-1">
                <div className="table-cell1-1"></div>
                <div className="table-cell1-1"></div>
                <div className="table-cell1-1"></div>
                <div className="table-cell1 with-space"></div>
              </div>
            </div>
            <h5 className="table-cell-final-1">Please draw the cheques infavour of "NIHON AGRICUTURE HOLDINGS (PVT)LTD " A/C PAYEE ONLY</h5>
          </div>
       
        </div>
      </div>
    </div>
    </body>
  );
}
