import { Route } from "react-router-dom";
import ProtectedRoute from "../services/ProtectedRoute";
import Allorder from "../pages/Order/ALLorder/Allorder";
import UserDashboard from "../pages/UserDashboard/UserDashboard";
import UserInventoryByDescription from "../pages/UserDashboard/UserInventoryByDescription";
import AddProduct from "../pages/addProduct/AddProduct";
import ProductDetails from "../pages/products/productDetails/ProductDetails";
import EditProduct from "../pages/editproduct/EditProduct";
import InvoiceForm from "../pages/invoice/InvoiceForm";
import AllInvoice from "../pages/invoice/AllInvoice";
import InvoiceTemp from "../pages/invoice/InvoiceTemplate/InvoiceTemp";
import Sample from "../pages/invoice/InvoiceTemplate/Sample";
import CustomerReg from "../pages/customer/CustomerReg";
import CustomerDetails from "../pages/customer/singleCustomer/CustomerDetails";
import PackingDashboard from "../pages/PackingMaterials/PackingDashboard";
import AddReturnDetails from "../pages/returnNotes/AddReturnDetails";
import Mdashboard from "../pages/MainDashboard/Mdashboard";
import AllTaxInvoice from "../pages/TaxInvoices/ViewAllInvoices/AllTaxInvoice";
import ViewInvoice from "../pages/invoice/ViewInvoice/ViewInvoice";
import Taxinvoice from "../pages/invoice/TaXinvoiceTemp/Taxinvoice";
import Alldetails from "../pages/rawMaterials/Alldetails";
import Addbulk from "../pages/rawMaterials/Addbulk";
import AddNewBulk from "../pages/NewBulkDetails/AddNewBulk";
import ViewAllBulk from "../pages/NewBulkDetails/ViewAllBulk";
import NandRproduct from "../pages/AddNewProductAndReturn/NandRproduct";
import ViewallRAndn from "../pages/AddNewProductAndReturn/ViewallRAndn";
import ProductQuantityChart from "../pages/ProductQuantity/totalseasonQuantity/ProductQuantityChart";
import Sales from "../pages/Companysales/Sales";
import SingleCancelinvoice from "../pages/invoice/CanceledInvoice/Singlecancelinvoice/SingleCancelinvoice";
import GetAllReturnDetails from "../pages/returnNotes/gettall/GetAllReturnDetails";
import Dorder from "../pages/Order/MainOrder/Dorder";
import Dateproduct from "../pages/addProduct/Dateproduct";
import ProductdateDetails from "../pages/products/productDetails/ProductdateDetails";
import UpdateCustomerForm from "../pages/customer/Updatecus/UpdateCustomerForm";
import Useroutstanding from "../pages/UserDashboard/UserOutstanding/Useroutstanding";
import UserBulkProduct from "../pages/NewBulkDetails/UserBulkProduct";
import UserBulkP from "../compenents/bulkproduct/Allproduct/UserBulkP";
import UserFinishedProduct from "../pages/products/productDetails/UserFinishedProduct";
import AddateProduct from "../compenents/dateproduct/AddateProduct";
import AreaStockReturn from "../compenents/areaStockReturn/AreaStockReturn";
import UserAllexetable from "../compenents/Exetable/AllTableexe/UserAllexetable";
import AddUserOrder from "../compenents/HandleOrder/UserOrder/AddUserOrder";
import UserAllcheque from "../pages/AdminOperation/Cheque/UserAllcheque";
import EditCheque from "../pages/AdminOperation/Cheque/EditCheque";
import AreaInventory from "../pages/InventoryAreas/AreaInventory";
import AllInventories from "../pages/InventoryAreas/AllInventories";
import AddbulkProduct from "../compenents/bulkproduct/addproduct/AddbulkProduct";
import ProductQuantity from "../pages/invoice/GetProductQuanitityEach area/ProductQuantity";
import UserOneorder from "../compenents/HandleOrder/allorder/UserOneorder";
import StockSnapshot from "../pages/StockSnapsot/StockSnap";
import GetCustomer from "../pages/customer/getallCus/GetCustomer";
import ViewSingleTax from "../pages/TaxInvoices/ViewSingletax/ViewSingleTax";

export default  function UserRoute(){
    return(
        <>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                  <Route path="/view-all-order" element={<Allorder/>} />
                  <Route path="/User-dashboard" element={<UserDashboard/>}/>
                  <Route path="/user-inventory/:slug" element={<UserInventoryByDescription/>} />
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
                <Route path="/Packing-Materials-details" element={<PackingDashboard/>} />
                <Route path="/addreturn" element={<AddReturnDetails/>} />
                <Route path="/Maindashboard" element={<Mdashboard/>} />
                
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
            <Route path="/area-stock-return" element={<AreaStockReturn/>} />
            <Route path="/All-exe-product-user-role" element={<UserAllexetable/>}/>
            <Route path="/Add-Order-user-role" element={<AddUserOrder/>}/>
            <Route path="/user-cheque" element={<UserAllcheque/>}/>
            <Route path="/get-single-Cheque/:id" element={<EditCheque/>}/>
            <Route path="/add-area-inventory" element={<AreaInventory/>}/>
            <Route path="/area-allinventories" element={<AllInventories/>}/>
            <Route path="/Register-bulk" element={<AddbulkProduct/>} />
            <Route path="/product-quantity-by-code" element={<ProductQuantity/>} />
            <Route path="/userorder/:id" element={<UserOneorder/>} />
            <Route path="/stockSnap" element={<StockSnapshot/>} />
      
             </Route>
        </>
    )
}