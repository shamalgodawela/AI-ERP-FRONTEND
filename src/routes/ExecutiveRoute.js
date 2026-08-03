import { Route } from "react-router-dom";
import ProtectedRoute from "../services/ProtectedRoute";

export default function ExecutiveRoute() {
    return(
        <>

        <Route element={<ProtectedRoute allowedRoles={["executive"]} />}>
  <Route path="/Exedahsboard" element={<Exedashboard/>} />
  <Route path="/exeinvoices" element={<GetExeInvoice/>} />
<Route path="/invoice-temp-exe/:id" element={<InvoiceExetemp/>} />
<Route path="/exetable" element={<Exetable/>} />
<Route path="/addorder" element={<AddOrderdetails/>} />
<Route path="/product-list" element={<ProductListExe/>} />
<Route path="/allorder" element={<Allorder/>} />
</Route>
        
        </>
    )
}