import {BrowserRouter, Routes, Route} from "react-router-dom"
import { Home } from "./pages/Home/Home";
import  Login  from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Forgot from "./pages/auth/Forgot";
import Reset from "./pages/auth/Reset";
import Dashboard from "./pages/dashboard/Dashboard";
import Report from "./pages/report/Reports"
import Products from "./pages/products/Products"
import Account from "./pages/account/Account"
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getLoginStatus } from "./services/authService";
import { SET_LOGIN } from "./redux/features/auth/authSlice";
import AddProduct from "./pages/addProduct/AddProduct";
import ProductDetails from "./pages/products/productDetails/ProductDetails";
import EditProduct from "./pages/editproduct/EditProduct";
import InvoiceForm from "./pages/invoice/InvoiceForm";
import AllInvoice from "./pages/invoice/AllInvoice";
import InvoiceTemp from "./pages/invoice/InvoiceTemplate/InvoiceTemp";
import CustomerReg from "./pages/customer/CustomerReg";
import GetCustomer from "./pages/customer/getallCus/GetCustomer";
import Mdetails from "./pages/Packing/Mdetails";
import CustomerDetails from "./pages/customer/singleCustomer/CustomerDetails";
import AllOutStanding from "./pages/outstandingPage/AllOutStanding";
import CalOutstanding from "./pages/outstandingPage/CalOutstanding";
import Dateproduct from "./pages/addProduct/Dateproduct";
import ProductdateDetails from "./pages/products/productDetails/ProductdateDetails";
import AddOrderdetails from "./pages/Order/addorder/AddOrderdetails";
import Allorder from "./pages/Order/ALLorder/Allorder";
import SingleOrder from "./compenents/HandleOrder/SingleOrder";
import ViewallOrder from "./pages/orderAdmin/dashboard/ViewallOrder";
import Oneorder from "./pages/orderAdmin/dashboard/Oneorder";
import LoginForm from "./pages/orderAdmin/login/LoginForm";
import Sample from "./pages/invoice/InvoiceTemplate/Sample";
import Additeams from "./pages/officeInvrntory/Additeams";
import Getalloffice from "./pages/officeInvrntory/Getalloffice";
import UpdateCustomerForm from "./pages/customer/Updatecus/UpdateCustomerForm";
import Alldetails from "./pages/rawMaterials/Alldetails";
import Addbulk from "./pages/rawMaterials/Addbulk";
import AddReturnDetails from "./pages/returnNotes/AddReturnDetails";
import Stationery from "./pages/stationery/Stationery";
import ViewStationery from "./pages/viewstationery/ViewStationery";
import Stationeryuse from "./pages/stationeryused/Stationeryuse";
import Getalluse from "./pages/stationeryused/getall/Getalluse";
import GetAllReturnDetails from "./pages/returnNotes/gettall/GetAllReturnDetails";
import ExeLogin from "./pages/authExe/ExeLogin";
import Exedashboard from "./compenents/Exedashboard/Exedashboard";
import Dorder from "./pages/Order/MainOrder/Dorder";
import GetAllCanInvoice from "./pages/invoice/CanceledInvoice/getAllcancelinvoice/GetAllCanInvoice";
import SingleCancelinvoice from "./pages/invoice/CanceledInvoice/Singlecancelinvoice/SingleCancelinvoice";
import Sales from "./pages/Companysales/Sales";
import EditInvoice from "./pages/invoice/Editinvoice/EditInvoice";
import Exetable from "./pages/Exeproductdetails/Exetable";
import Mdashboard from "./pages/MainDashboard/Mdashboard";
import ProductQuantityChart from "./pages/ProductQuantity/totalseasonQuantity/ProductQuantityChart";
import Collectiondash from "./pages/CompanyCollection/CollectionDashboard/Collectiondash";
import NandRproduct from "./pages/AddNewProductAndReturn/NandRproduct";
import ViewallRAndn from "./pages/AddNewProductAndReturn/ViewallRAndn";
import AddNewBulk from "./pages/NewBulkDetails/AddNewBulk";
import ViewAllBulk from "./pages/NewBulkDetails/ViewAllBulk";
import DealerHistory from "./pages/orderAdmin/CheckdealerHistory/DealerHistory";
import Operationlogin from "./pages/AdminOperation/adminlogin/Operationlogin";
import OpearationHome from "./pages/AdminOperation/OpearationHome/OpearationHome";
import Opertionoutstanding from "./pages/AdminOperation/outstanding/Opertionoutstanding";
import SummeryDashboard from "./pages/AdminOperation/SalesandCollection/SummeryDashboard";
import SingleOpOutstanding from "./pages/AdminOperation/outstanding/SingleOpOutstanding";
import ViewSingleOutstanding from "./pages/AdminOperation/ViewSingleOut/ViewSingleOutstanding";
import DealerPastHistory from "./pages/ViewDealerHitory/DealerPastHistory";
import SalesByExe from "./pages/Exeproductdetails/salesEachProduct/SalesByExe";
import DamangeInventory from "./pages/DamageInventory/DamangeInventory";
import PackingDashboard from "./pages/PackingMaterials/PackingDashboard";
import AddCheque from "./pages/Cheque/AddCheque/AddCheque";
import ViewAllinvoice from "./pages/ViewAllinvoice/ViewAllinvoice";
import ViewInvoice from "./pages/invoice/ViewInvoice/ViewInvoice";
import AllTaxInvoice from "./pages/TaxInvoices/ViewAllInvoices/AllTaxInvoice";
import ViewSingleTax from "./pages/TaxInvoices/ViewSingletax/ViewSingleTax";
import GetExeInvoice from "./compenents/EXEiNVOICE/GetExeInvoice";
import InvoiceExetemp from "./compenents/EXEiNVOICE/Invoicetempexe/InvoiceExetemp";
import WithoutMallout from "./compenents/outstandingTable/WithoutMallout";
import Taxinvoice from "./pages/invoice/TaXinvoiceTemp/Taxinvoice";
import Mlogin from "./pages/MainLogin/Mlogin";
import AuthError from "./pages/MainLogin/AuthError";
import ProtectedRoute from "./services/ProtectedRoute";

axios.defaults.withCredentials= true;

function App() {
  const dispatch =useDispatch();

  useEffect(()=>{
    async function loginStatus(){
      const status=await getLoginStatus()
      dispatch(SET_LOGIN(status))
    }
    loginStatus()

  },[dispatch])

  

  return (
   <BrowserRouter>
   <ToastContainer />
   <Routes>

{/* ---------------------------------Common Pages-------------------------------- */}

    <Route path="/" element={<Home/>}/>
    <Route path="/All-in-one-Login" element={<Mlogin/>}/>
    <Route path="/Unotherized" element={<AuthError/>}/>

{/* ----------------------------------------------------------------------------- */}

{/* ---------------------------------Admin Pages--------------------------------- */}

    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="/alloutstanding" element={<AllOutStanding />} />
    </Route>

{/* ----------------------------------------------------------------------------- */}

{/* ---------------------------------User Pages--------------------------------- */}

     <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
      <Route path="/dashboard" element={<Dashboard/>}/>
     </Route>


{/* ----------------------------------------------------------------------------- */}







    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/forgot" element={<Forgot/>}/>
    <Route path="/resetpassword/:resetToken" element={<Reset/>}/>
    {/* <Route path="/dashboard" element={<Dashboard/>}/> */}
    <Route path="/reports" element={<Report/>}/>
    <Route path="/add-products" element={<AddProduct/>}/>
    <Route path="/account" element={<Account/>}/>
    <Route path="/product-detail/:id" element={<ProductDetails/>}/>
    <Route path="/edit-product/:id" element={<EditProduct/>}/>
    <Route path="/add-invoice" element={<InvoiceForm/>}/>
    <Route path="/all-invoices" element={<AllInvoice/>} />
    <Route path="/invoice-temp/:id" element={<InvoiceTemp/>} />
    <Route path="/invoice-temp" element={<Sample/>} />
    <Route path="/customerReg" element={<CustomerReg/>} />
    <Route path="/getAllCustomer" element={<GetCustomer/>} />
    <Route path="/Mdetails" element={<Mdetails/>} />
    <Route path="/customer/:code" element={<CustomerDetails/>} />
    {/* <Route path="/AllOutstanding" element={<AllOutStanding/>} /> */}
    <Route path="/AllOutstanding-without-Menu" element={<WithoutMallout/>} />
    <Route path="/caloutStanding/:id" element={<CalOutstanding/>} />
    <Route path="/dateproduct" element={<Dateproduct/>} />
    <Route path="/dateproductDetails" element={<ProductdateDetails/>} />
    <Route path="/addorder" element={<AddOrderdetails/>} />
    <Route path="/allorder" element={<Allorder/>} />
    <Route path="/orders/:id" element={<SingleOrder/>} />
{/* ------------------------------------------------------------------------------------------------ */}
    <Route path="/Adminallorder" element={<ViewallOrder/>} />
    <Route path="/adminorder/:id" element={<Oneorder/>} />
    <Route path="/adminlogin" element={<LoginForm/>} />
    <Route path="/additems" element={<Additeams/>} />
    <Route path="/getallinven" element={<Getalloffice/>} />
    <Route path="/customer/update/:customerId" element={<UpdateCustomerForm />} />
    <Route path="allbulkproduct" element={<Alldetails/>} />
    <Route path="/addbulkproduct" element={<Addbulk/>} />
    <Route path="/addreturn" element={<AddReturnDetails/>} />
    <Route path="/addstationery" element={<Stationery/>} />
    <Route path="/viewstationery" element={<ViewStationery/>} />
    <Route path="/addstationeryUse" element={<Stationeryuse/>} />
    <Route path="/getallusestationery" element={<Getalluse/>} />
    <Route path="/getallreturn" element={<GetAllReturnDetails/>} />
    <Route path="/ExeLogin" element={<ExeLogin/>} />
    <Route path="/Exedahsboard" element={<Exedashboard/>} />
    <Route path="/Dorder" element={<Dorder/>} />
    <Route path="/getallcanceledInvoice" element={<GetAllCanInvoice/>} />
    <Route path="/gesinglecancelInvoice/:invoiceNumber" element={<SingleCancelinvoice/>} />
    <Route path="/sales" element={<Sales/>} />
    <Route path="/invoice/:invoiceNumber" element={<EditInvoice/>} />
    <Route path="/exetable" element={<Exetable/>} />
    <Route path="/Maindashboard" element={<Mdashboard/>} />
    <Route path="/Season-Product-Quantity" element={<ProductQuantityChart/>} />
    <Route path="/Collectioh-dashboard" element={<Collectiondash/>} />
    <Route path="/Add-newReturn-product" element={<NandRproduct/>} />
    <Route path="/view-all-product-details" element={<ViewallRAndn/>} />
    <Route path="/Add-New-bulk-product" element={<AddNewBulk/>} />
    <Route path="/view-all-bulk" element={<ViewAllBulk/>} />
    <Route path="/view-dealer-history" element={<DealerHistory/>} />
    <Route path="/viewALLinvoice" element={<ViewAllinvoice/>} />
    <Route path="/view-single-invoice/:id" element={<ViewInvoice/>} />
    <Route path="/viewAll-TaxInvoices" element={<AllTaxInvoice/>} />
    <Route path="/view-single-Taxinvoice/:invoiceNumber" element={<ViewSingleTax/>} />
    <Route path="/tax-invoice/:id" element={<Taxinvoice/>} />


{/*----------------------------------Admin Operations pages----------------------------------------------*/}

    <Route path="/admin-operation-dashboard" element={<OpearationHome/>} />
    <Route path="/admin-operation-loginpage" element={<Operationlogin/>} />
    <Route path="/admin-operation-outstanding" element={<Opertionoutstanding/>} />
    <Route path="/admin-operation-salesCollection" element={<SummeryDashboard/>} />
    <Route path="/view-single-operation/:id" element={<SingleOpOutstanding/>} />




{/* -------------------------------------Admin Page--------------------------------------------------------- */}



<Route path="/Add-Cheque" element={<AddCheque/>} />



{/* ------------------------------------------------------------------------------------------------------------ */}
<Route path="/Exe-product-wise-sales" element={<SalesByExe/>} />
<Route path="/view-admin-outstanding/:id" element={<ViewSingleOutstanding/>} />
<Route path="/view-Delaer-history" element={<DealerPastHistory/>} />


{/* --------------------------------------------------Inventory pages----------------------------------------- */}

<Route path="/Damage-Inventory" element={<DamangeInventory/>} />
<Route path="/Packing-Materials-details" element={<PackingDashboard/>} />



{/* ---------------------------------------------------------------------------------------------------------- */}

    
<Route path="/exeinvoices" element={<GetExeInvoice/>} />
<Route path="/invoice-temp-exe/:id" element={<InvoiceExetemp/>} />
   
   


    



    
  </Routes>

   </BrowserRouter>
  );
}

export default App;
