import { Route } from "react-router-dom";
import ProtectedRoute from "../services/ProtectedRoute";
import OprationsDashboard from "../pages/AdminOperation/OperationsDashboard/OprationsDashboard";
import OperationsPayments from "../pages/AdminOperation/OperationsDashboard/OperationsPayments";
import SingleOutstanding from "../pages/AdminOperation/SingleOutstanding";
import Allcheque from "../pages/AdminOperation/Cheque/Allcheque";
import ViewAllincentive from "../pages/ExecutivesIncentive/viewIncentiveAll/ViewAllincentive";
import Operationallcustomers from "../pages/ViewDealerHitory/Operationallcustomers";
import Opdealerhistory from "../pages/ViewDealerHitory/Opdealerhistory";
import BackStatmentop from "../compenents/BankStatements/BackStatmentop";
import GetallchequeOp from "../pages/Cheque/Allcheque/GetallchequeOp";
import Getallreturnop from "../pages/returnNotes/gettall/Getallreturnop";
import Productquantityop from "../pages/invoice/GetProductQuanitityEach area/Productquantityop";
import Collectionopdash from "../pages/AdminOperation/Collectionopdash";

export default function OperationRoute() {
    return(
        <>
        <Route element={<ProtectedRoute allowedRoles={["Operation"]} />}>
    <Route path="/Admin-operations-dashboard" element={<OprationsDashboard/>} />
    {/* <Route path="/Exe-product-wise-sales" element={<SalesByExe/>} /> need to update */}
    <Route path="/operationsPayment" element={<OperationsPayments />} />
    <Route path="/single-operations/:id" element={<SingleOutstanding/>} />
    <Route path="/admin-operation-getallcheque" element={<Allcheque/>} />
    <Route path="/admin-operation-incentive" element={<ViewAllincentive/>} />
    <Route path="/allcusoperation" element={<Operationallcustomers/>} />
    <Route path="/opdealerhistory" element={<Opdealerhistory/>} />
    <Route path="/bankstatement-operations" element={<BackStatmentop/>} />
    <Route path="/Getallcheque-op" element={<GetallchequeOp/>} />
    <Route path="/Getallreturn-op" element={<Getallreturnop/>} />
    <Route path="/productquantity-op" element={<Productquantityop/>} />
    <Route path="/collection-dashop" element={<Collectionopdash/>} />


</Route>
        </>
    )
}