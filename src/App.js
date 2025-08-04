import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home/Home";
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
import CustomerDetails from "./pages/customer/singleCustomer/CustomerDetails";
import AllOutStanding from "./pages/outstandingPage/AllOutStanding";
import CalOutstanding from "./pages/outstandingPage/CalOutstanding";
import Dateproduct from "./pages/addProduct/Dateproduct";
import ProductdateDetails from "./pages/products/productDetails/ProductdateDetails";
import AddOrderdetails from "./pages/Order/addorder/AddOrderdetails";
import Allorder from "./pages/Order/ALLorder/Allorder";
import ViewallOrder from "./pages/orderAdmin/dashboard/ViewallOrder";
import Oneorder from "./pages/orderAdmin/dashboard/Oneorder";
import Sample from "./pages/invoice/InvoiceTemplate/Sample";
import UpdateCustomerForm from "./pages/customer/Updatecus/UpdateCustomerForm";
import Alldetails from "./pages/rawMaterials/Alldetails";
import Addbulk from "./pages/rawMaterials/Addbulk";
import AddReturnDetails from "./pages/returnNotes/AddReturnDetails";
import GetAllReturnDetails from "./pages/returnNotes/gettall/GetAllReturnDetails";
import Exedashboard from "./compenents/Exedashboard/Exedashboard";
import Dorder from "./pages/Order/MainOrder/Dorder";
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
import SalesByExe from "./pages/Exeproductdetails/salesEachProduct/SalesByExe";
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
import ProductListExe from "./compenents/product/productList/ProductListExe";
import Admin from "./compenents/AdminProfile/Admin";
import Allcustomers from "./pages/ViewDealerHitory/Allcustomer";
import ProductSummary from "./compenents/product/productSummary/ProductSummary";
import AllExeTable from "./compenents/Exetable/AllTableexe/AllExeTable";
import AllProducts from "./compenents/bulkproduct/Allproduct/AllProducts";
import BankStatement from "./compenents/BankStatements/BankStatement";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import Admininventory from "./pages/dashboard/AdminDASH/Admininventory";
import Useroutstanding from "./pages/UserDashboard/UserOutstanding/Useroutstanding";
import UserBulkProduct from "./pages/NewBulkDetails/UserBulkProduct";
import UserBulkP from "./compenents/bulkproduct/Allproduct/UserBulkP";
import UserFinishedProduct from "./pages/products/productDetails/UserFinishedProduct";
import AddateProduct from "./compenents/dateproduct/AddateProduct";
import UserAllexetable from "./compenents/Exetable/AllTableexe/UserAllexetable";
import AddUserOrder from "./compenents/HandleOrder/UserOrder/AddUserOrder";
import OprationsDashboard from "./pages/AdminOperation/OperationsDashboard/OprationsDashboard";


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
      <Route path="/caloutStanding/:id" element={<CalOutstanding/>} />
      <Route path="/adminorder/:id" element={<Oneorder/>} />
      <Route path="/Exe-product-wise-sales" element={<SalesByExe/>} />


    <Route path="/Adminallorder" element={<ViewallOrder/>} />
    <Route path="/Collectioh-dashboard" element={<Collectiondash/>} />
    <Route path="/invoice/:invoiceNumber" element={<EditInvoice/>} />
    <Route path="/AllOutstanding" element={<AllOutStanding/>} />
    <Route path="/Dorder" element={<Dorder/>} />
    <Route path="/AllOutstanding-without-Menu" element={<WithoutMallout/>} />
    <Route path="/admin-profile" element={<Admin/>} />
    <Route path="/sales" element={<Sales/>} />
    <Route path="/AllcustomerWiseHistory" element={<Allcustomers/>}/>
    <Route path="/productSummery" element={<ProductSummary/>}/>
    <Route path="/dashboard" element={<Admininventory/>}/>
    <Route path="/edit-product/:id" element={<EditProduct/>}/>
    <Route path="/product-list" element={<ProductListExe/>} />
    <Route path="/Allexetable" element={<AllExeTable/>}/>
    <Route path="/view-all-bulk" element={<ViewAllBulk/>} />
    <Route path="/view-current-bulk" element={<AllProducts/>}/>
    <Route path="/dateproductDetails" element={<ProductdateDetails/>} />
    <Route path="/bankstatement" element={<BankStatement/>}/>


    </Route>

{/* ----------------------------------------------------------------------------- */}

{/* ---------------------------------User Pages--------------------------------- */}

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/view-all-order" element={<Allorder/>} />
          <Route path="/User-dashboard" element={<UserDashboard/>}/>
          <Route path="/add-products" element={<AddProduct/>}/>
          <Route path="/product-detail/:id" element={<ProductDetails/>}/>
          <Route path="/edit-product/:id" element={<EditProduct/>}/>
          <Route path="/add-invoice" element={<InvoiceForm/>}/>
        <Route path="/all-invoices" element={<AllInvoice/>} />
        <Route path="/invoice-temp/:id" element={<InvoiceTemp/>} />
        <Route path="/invoice-temp" element={<Sample/>} />
        <Route path="/customerReg" element={<CustomerReg/>} />
        <Route path="/getAllCustomer" element={<GetCustomer/>} />
        <Route path="/customer/:code" element={<CustomerDetails/>} />
        <Route path="/Add-Cheque" element={<AddCheque/>} />
        <Route path="/Packing-Materials-details" element={<PackingDashboard/>} />
        <Route path="/addreturn" element={<AddReturnDetails/>} />
        <Route path="/Maindashboard" element={<Mdashboard/>} />
        <Route path="/viewALLinvoice" element={<ViewAllinvoice/>} />
    <Route path="/view-single-invoice/:id" element={<ViewInvoice/>} />
    <Route path="/viewAll-TaxInvoices" element={<AllTaxInvoice/>} />
    <Route path="/view-single-Taxinvoice/:invoiceNumber" element={<ViewSingleTax/>} />
    <Route path="/tax-invoice/:id" element={<Taxinvoice/>} />
    <Route path="allbulkproduct" element={<Alldetails/>} />
    <Route path="/addbulkproduct" element={<Addbulk/>} />
    <Route path="/Add-New-bulk-product" element={<AddNewBulk/>} />
    <Route path="/view-all-bulk" element={<ViewAllBulk/>} />
    <Route path="/Add-newReturn-product" element={<NandRproduct/>} />
    <Route path="/view-all-product-details" element={<ViewallRAndn/>} />
    <Route path="/Season-Product-Quantity" element={<ProductQuantityChart/>} />
    <Route path="/sales" element={<Sales/>} />
    <Route path="/gesinglecancelInvoice/:invoiceNumber" element={<SingleCancelinvoice/>} />
    <Route path="/getallcanceledInvoice" element={<GetAllReturnDetails/>} />
    <Route path="/Dorder" element={<Dorder/>} />
    <Route path="/getallreturn" element={<GetAllReturnDetails/>} />
    <Route path="/dateproduct" element={<Dateproduct/>} />
    <Route path="/dateproductDetails" element={<ProductdateDetails/>} />
    <Route path="/customer/update/:customerId" element={<UpdateCustomerForm />} />
    <Route path="/user-check-outstanding" element={<Useroutstanding/>} />
    <Route path="/user-Bulk-product" element={<UserBulkProduct/>} />
    <Route path="/user-Bulk-product-ton" element={<UserBulkP/>} />
    <Route path="/user-finishedProduct" element={<UserFinishedProduct/>} />
    <Route path="/add-packing-product" element={<AddateProduct/>} />
    <Route path="/All-exe-product-user-role" element={<UserAllexetable/>}/>
    <Route path="/Add-Order-user-role" element={<AddUserOrder/>}/>

   
   
  
  

     </Route>

{/* ----------------------------------------------------------------------------- */}

{/* ---------------------------------Executive Pages--------------------------------- */}

<Route element={<ProtectedRoute allowedRoles={["executive"]} />}>
  <Route path="/Exedahsboard" element={<Exedashboard/>} />
  <Route path="/exeinvoices" element={<GetExeInvoice/>} />
<Route path="/invoice-temp-exe/:id" element={<InvoiceExetemp/>} />
<Route path="/exetable" element={<Exetable/>} />
<Route path="/addorder" element={<AddOrderdetails/>} />
<Route path="/product-list" element={<ProductListExe/>} />
<Route path="/allorder" element={<Allorder/>} />
</Route>






{/* -------------------------------------------------------------------------------- */}


{/* ---------------------------------Operation Pages--------------------------------- */}
<Route element={<ProtectedRoute allowedRoles={["Operation"]} />}>
    <Route path="/Admin-operations-dashboard" element={<OprationsDashboard/>} />
    {/* <Route path="/Exe-product-wise-sales" element={<SalesByExe/>} /> need to update */}
    <Route path="/alloutstanding" element={<AllOutStanding />} />
      <Route path="/caloutStanding/:id" element={<CalOutstanding/>} />
      <Route path="/adminorder/:id" element={<Oneorder/>} />
      <Route path="/Exe-product-wise-sales" element={<SalesByExe/>} />


    <Route path="/Adminallorder" element={<ViewallOrder/>} />
    <Route path="/Collectioh-dashboard" element={<Collectiondash/>} />
    <Route path="/AllOutstanding" element={<AllOutStanding/>} />
    <Route path="/AllOutstanding-without-Menu" element={<WithoutMallout/>} />
    <Route path="/sales" element={<Sales/>} />
    <Route path="/AllcustomerWiseHistory" element={<Allcustomers/>}/>
 
    
   

</Route>
   
{/* ------------------------------------------------------------------------------------------------ */}

    
   
    

    
 
  

    
    
   
   
    
    
   
  

   
   

    

   
   


    



    
  </Routes>

   </BrowserRouter>
  );
}

export default App;
