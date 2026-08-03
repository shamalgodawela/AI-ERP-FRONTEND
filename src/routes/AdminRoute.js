import { Route, Routes } from "react-router-dom";
import Admin from "../compenents/AdminProfile/Admin";
import BankStatement from "../compenents/BankStatements/BankStatement";
import AllProducts from "../compenents/bulkproduct/Allproduct/AllProducts";
import EXEincentory from "../compenents/Exetable/AllTableexe/EXEincentory";
import WithoutMallout from "../compenents/outstandingTable/WithoutMallout";
import ProductListExe from "../compenents/product/productList/ProductListExe";
import ProductSummary from "../compenents/product/productSummary/ProductSummary";
import Getallcheque from "../pages/Cheque/Allcheque/Getallcheque";
import Collectiondash from "../pages/CompanyCollection/CollectionDashboard/Collectiondash";
import Sales from "../pages/Companysales/Sales";
import InventoryByDescription from "../pages/dashboard/AdminDASH/Dashboard";
import EditProduct from "../pages/editproduct/EditProduct";
import AdminViewincentive from "../pages/ExecutivesIncentive/adminincentiveview/AdminViewincentive";
import SalesByExe from "../pages/Exeproductdetails/salesEachProduct/SalesByExe";
import AdminInvoice from "../pages/invoice/AdminInvoice";
import EditInvoice from "../pages/invoice/Editinvoice/EditInvoice";
import ViewAllBulk from "../pages/NewBulkDetails/ViewAllBulk";
import Dorder from "../pages/Order/MainOrder/Dorder";
import Oneorder from "../pages/orderAdmin/dashboard/Oneorder";
import ViewallOrder from "../pages/orderAdmin/dashboard/ViewallOrder";
import AllOutStanding from "../pages/outstandingPage/AllOutStanding";
import CalOutstanding from "../pages/outstandingPage/CalOutstanding";
import ProductdateDetails from "../pages/products/productDetails/ProductdateDetails";
import Getallreturnadmin from "../pages/returnNotes/gettall/Getallreturnadmin";
import Allcustomers from "../pages/ViewDealerHitory/Allcustomer";
import DealerPastHistory from "../pages/ViewDealerHitory/DealerPastHistory";
import ProtectedRoute from "../services/ProtectedRoute";
import ViewAllusers from "../pages/UsersManagement/ViewAllusers/ViewAllusers";

export default function AdminRoute() {
  return (
    <>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="adminorder/:id" element={<Oneorder />} />
        <Route path="Exe-product-wise-sales" element={<SalesByExe />} />
        <Route path="Adminallorder" element={<ViewallOrder />} />
        <Route path="Collectioh-dashboard" element={<Collectiondash />} />
        <Route path="invoice/:invoiceNumber" element={<EditInvoice />} />
        <Route path="Dorder" element={<Dorder />} />
        <Route path="AllOutstanding-without-Menu" element={<WithoutMallout />} />
        <Route path="admin-profile" element={<Admin />} />
        <Route path="sales" element={<Sales />} />
        <Route path="AllcustomerWiseHistory" element={<Allcustomers />} />
        <Route path="productSummery" element={<ProductSummary />} />
        <Route path="dashboard" element={<InventoryByDescription />} />
        <Route path="inventory/:slug" element={<InventoryByDescription />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route path="product-list" element={<ProductListExe />} />
        <Route path="view-all-bulk" element={<ViewAllBulk />} />
        <Route path="view-current-bulk" element={<AllProducts />} />
        <Route path="dateproductDetails" element={<ProductdateDetails />} />
        <Route path="bankstatement" element={<BankStatement />} />
        <Route path="admin-incentive" element={<AdminViewincentive />} />
        <Route path="view-Delaer-historys" element={<DealerPastHistory />} />
        <Route path="Allexetable" element={<EXEincentory />} />
        <Route path="caloutStanding/:id" element={<CalOutstanding />} />
        <Route path="AllOutstanding" element={<AllOutStanding />} />
        <Route path="getall-cheques" element={<Getallcheque />} />
        <Route path="Admin-invoice" element={<AdminInvoice />} />
        <Route path="Admin-invoice-return" element={<Getallreturnadmin />} />
        <Route path="view-all-users" element={<ViewAllusers />} />
      </Route>
    </>
  );
}