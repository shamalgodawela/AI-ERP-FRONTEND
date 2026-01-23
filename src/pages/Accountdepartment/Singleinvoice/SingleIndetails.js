import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../../../compenents/footer/Footer";
import { IoMdArrowRoundBack } from "react-icons/io";

const SingleIndetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [invoice, setInvoice] = useState(null);
  const [amount, setAmount] = useState("");
  const [outstanding, setOutstanding] = useState("0.00");
  const [date, setDate] = useState("");
  const [backName, setBackname] = useState("");
  const [CHnumber, setCHnumber] = useState("");
  const [savedDetails, setSavedDetails] = useState(null);
  const [updatingChequeId, setUpdatingChequeId] = useState(null);
  const [updatingDepositDateId, setUpdatingDepositDateId] = useState(null);
  const [updatingAmountId, setUpdatingAmountId] = useState(null);
  const [depositedate, setDepositedate] = useState('');

  const backoption = ["BOC", "Commercial", "HNB","People's","Sampath","NSB","DFCC","AMANA"];

  // ---------------- SET TODAY'S DATE ----------------
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  // ---------------- FETCH INVOICE ----------------
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(
          `https://nihon-inventory.onrender.com/api/get-invoice/${id}`
        );
        setInvoice(res.data);
      } catch (error) {
        toast.error("Failed to fetch invoice");
        console.error(error);
      }
    };
    fetchInvoice();
  }, [id]);

  // ---------------- CALCULATE TOTAL ----------------
  const calculateTotal = () => {
    if (!invoice?.products) return "0.00";

    return invoice.products
      .reduce(
        (acc, p) =>
          acc + p.labelPrice * (1 - p.discount / 100) * p.quantity,
        0
      )
      .toFixed(2);
  };

  // ---------------- CALCULATE OUTSTANDING ----------------
  const handleCalculate = async () => {
    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        toast.error("Enter valid amount");
        return;
      }

      const total = parseFloat(calculateTotal());

      const res = await axios.get(
        `https://nihon-inventory.onrender.com/api/get-last-outstanding/${invoice.invoiceNumber}`
      );

      const lastOutstanding = parseFloat(res.data.outstanding);

      const newOutstanding =
        lastOutstanding === -1
          ? total - parsedAmount
          : lastOutstanding - parsedAmount;

      setOutstanding(newOutstanding.toFixed(2));
    } catch (error) {
      toast.error("Outstanding calculation failed");
    }
  };

  // ---------------- SAVE OUTSTANDING ----------------
  const handleSave = async () => {
    try {
      await axios.post(`https://nihon-inventory.onrender.com/api/create`, {
        invoiceNumber: invoice.invoiceNumber,
        date,
        backName,
        CHnumber,
        depositedate,
        amount,
        outstanding
      });
      toast.success("Outstanding saved successfully");
    } catch (error) {
      toast.error("Failed to save outstanding");
    }
  };

  // ---------------- FETCH ALL OUTSTANDING ----------------
  const handleFetchAllOutstandingDetails = async () => {
    try {
      const res = await axios.get(
        `https://nihon-inventory.onrender.com/api/get-all-outstanding/${invoice.invoiceNumber}`
      );

      if (res.data.length === 0) {
        toast.info("No outstanding history");
      } else {
        setSavedDetails(res.data);
      }
    } catch {
      toast.error("Failed to fetch outstanding history");
    }
  };

  // ---------------- UPDATE CHEQUE STATUS ----------------
  const handleUpdateChequeStatus = async (chequeId, status) => {
    try {
      setUpdatingChequeId(chequeId);

      const res = await axios.put(
        `https://nihon-inventory.onrender.com/api/invoices/cheque-status/${invoice.invoiceNumber}`,
        { chequeId, status }
      );

      setInvoice(res.data.invoice); // update UI
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Cheque update failed");
    } finally {
      setUpdatingChequeId(null);
    }
  };

  // ---------------- UPDATE DEPOSIT DATE ----------------
  const handleUpdateDepositDate = async (chequeId, depositDate) => {
    try {
      setUpdatingDepositDateId(chequeId);

      const res = await axios.put(
        `https://nihon-inventory.onrender.com/api/invoices/cheque-deposit-date/${invoice.invoiceNumber}`,
        { chequeId, depositDate }
      );

      setInvoice(res.data.invoice); // update UI
      toast.success(res.data.message || "Deposit date updated successfully");
    } catch (error) {
      toast.error("Deposit date update failed");
    } finally {
      setUpdatingDepositDateId(null);
    }
  };

  // ---------------- UPDATE CHEQUE AMOUNT ----------------
  const handleUpdateChequeAmount = async (chequeId, amount) => {
    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount < 0) {
        toast.error("Enter valid amount");
        return;
      }

      setUpdatingAmountId(chequeId);

      const res = await axios.put(
        `https://nihon-inventory.onrender.com/api/invoices/cheque-amount/${invoice.invoiceNumber}`,
        { chequeId, amount: parsedAmount }
      );

      setInvoice(res.data.invoice); // update UI
      toast.success(res.data.message || "Cheque amount updated successfully");
    } catch (error) {
      toast.error("Cheque amount update failed");
    } finally {
      setUpdatingAmountId(null);
    }
  };

  // ---------------- FORMAT NUMBERS ----------------
  const formatNumbers = (x) =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (!invoice) return <div>Loading...</div>;

  return (
    <div ref={containerRef}>
      <Link onClick={() => navigate(-1)} className="Back-Icon">
        Go Back <IoMdArrowRoundBack size={22} />
      </Link>

      <div className="cal-outstanding-container">
        <h4>Invoice: {invoice.invoiceNumber}</h4>
        <h4>Customer: {invoice.customer}</h4>
        <h4>EXE: {invoice.exe}</h4>
        <h4>Date: {invoice.invoiceDate}</h4>

        <hr />

        {/* PRODUCTS */}
        <h2>Product Details</h2>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Label Price</th>
              <th>Discount</th>
              <th>unit price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((p, i) => (
              <tr key={i}>
                <td>{p.productCode}</td>
                <td>{p.productName}</td>
                <td>{p.quantity}</td>
                <td>{p.labelPrice}</td>
                <td>{p.discount}%</td>
                <td>{p.unitPrice}</td>
                <td>
                  {formatNumbers(
                    (
                      p.labelPrice *
                      (1 - p.discount / 100) *
                      p.quantity
                    ).toFixed(2)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>Total: RS/= {formatNumbers(calculateTotal())}</div>

        <hr />

        {/* CHEQUES */}
        {invoice.cheques?.length > 0 && (
          <>
            <h2>Cheque Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Cheque No</th>
                  <th>Bank</th>
                  <th>Deposit Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoice.cheques.map((c) => (
                  <tr key={c._id}>
                    <td>{c.chequeNo}</td>
                    <td>{c.bankName}</td>
                    <td>
                      <input
                        type="date"
                        value={c.depositDate ? new Date(c.depositDate).toISOString().split('T')[0] : ''}
                        disabled={updatingDepositDateId === c._id}
                        onChange={(e) =>
                          handleUpdateDepositDate(c._id, e.target.value)
                        }
                        style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        defaultValue={c.amount || ''}
                        disabled={updatingAmountId === c._id}
                        onBlur={(e) => {
                          const newAmount = parseFloat(e.target.value);
                          if (!isNaN(newAmount) && newAmount !== c.amount) {
                            handleUpdateChequeAmount(c._id, e.target.value);
                          }
                        }}
                        style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
                      />
                    </td>
                    <td>
                      <select
                        value={c.status}
                        disabled={updatingChequeId === c._id}
                        onChange={(e) =>
                          handleUpdateChequeStatus(c._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Bounced">Bounced</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <button onClick={handleFetchAllOutstandingDetails}>
          Fetch Outstanding History
        </button>

        <hr />
        <h2>Invoice date:{invoice.invoiceDate}</h2>
        <h2>Due date:{invoice.Duedate}</h2>

        {/* OUTSTANDING HISTORY */}
        {savedDetails && (
          <>
            <h2>Outstanding History</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Bank</th>
                  <th>Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {savedDetails.map((d, i) => (
                  <tr key={i}>
                    <td>{d.date}</td>
                    <td>RS/= {formatNumbers(d.amount)}</td>
                    <td>{d.backName}</td>
                    <td>RS/= {formatNumbers(d.outstanding)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* ADD OUTSTANDING */}
      <div style={{
        maxWidth: '900px',
        margin: '40px auto',
        padding: '40px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)',
        borderRadius: '16px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(22, 77, 114, 0.08)',
      }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '600',
          color: '#164d72',
          marginBottom: '32px',
          textAlign: 'center',
          letterSpacing: '0.3px',
        }}>
          Add payment
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#1e293b',
              letterSpacing: '0.2px',
            }}>
              Details update Date
            </label>
            <input
              type="date"
              value={date || ''}
              readOnly
              disabled
              style={{
                padding: '12px 16px',
                border: '1px solid rgba(22, 77, 114, 0.15)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                cursor: 'not-allowed',
                width: '100%',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#1e293b',
              letterSpacing: '0.2px',
            }}>
              Bank Name
            </label>
            <select
              value={backName}
              onChange={(e) => setBackname(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid rgba(22, 77, 114, 0.15)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#164d72';
                e.target.style.boxShadow = '0 0 0 3px rgba(22, 77, 114, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(22, 77, 114, 0.15)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="" disabled>Select a Bank</option>
              {backoption.map((bank, index) => (
                <option key={index} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#1e293b',
              letterSpacing: '0.2px',
            }}>
              Payment Date
            </label>
            <input
              type="date"
              value={depositedate}
              onChange={(e) => setDepositedate(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid rgba(22, 77, 114, 0.15)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#164d72';
                e.target.style.boxShadow = '0 0 0 3px rgba(22, 77, 114, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(22, 77, 114, 0.15)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#1e293b',
              letterSpacing: '0.2px',
            }}>
              Cheque Number/Reference
            </label>
            <input
              type="text"
              placeholder="Enter cheque or reference number"
              value={CHnumber}
              onChange={(e) => setCHnumber(e.target.value)}
              required
              style={{
                padding: '12px 16px',
                border: '1px solid rgba(22, 77, 114, 0.15)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#164d72';
                e.target.style.boxShadow = '0 0 0 3px rgba(22, 77, 114, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(22, 77, 114, 0.15)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#1e293b',
              letterSpacing: '0.2px',
            }}>
              Amount (LKR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="0.00"
              style={{
                padding: '12px 16px',
                border: '1px solid rgba(22, 77, 114, 0.15)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#164d72';
                e.target.style.boxShadow = '0 0 0 3px rgba(22, 77, 114, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(22, 77, 114, 0.15)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '24px',
          background: 'linear-gradient(135deg, #f8fafb 0%, #f1f5f9 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(22, 77, 114, 0.08)',
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#164d72',
            padding: '12px 24px',
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            letterSpacing: '0.3px',
          }}>
            Outstanding: RS/= {formatNumbers(outstanding)}
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <button
              onClick={handleCalculate}
              style={{
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#164d72',
                backgroundColor: '#ffffff',
                border: '2px solid #164d72',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                letterSpacing: '0.3px',
                boxShadow: '0 4px 12px rgba(22, 77, 114, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#164d72';
                e.target.style.color = '#ffffff';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(22, 77, 114, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.color = '#164d72';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(22, 77, 114, 0.15)';
              }}
            >
              Calculate Outstanding
            </button>

            <button
              onClick={handleSave}
              style={{
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#164d72',
                border: '2px solid #164d72',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                letterSpacing: '0.3px',
                boxShadow: '0 4px 12px rgba(22, 77, 114, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0f4c5c';
                e.target.style.borderColor = '#0f4c5c';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(22, 77, 114, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#164d72';
                e.target.style.borderColor = '#164d72';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(22, 77, 114, 0.25)';
              }}
            >
              Save Payment
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SingleIndetails;
