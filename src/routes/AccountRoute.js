import { Route } from "react-router-dom";
import ProtectedRoute from "../services/ProtectedRoute";
import AccountProfile from "../pages/Accountdepartment/Dashboard/AccountProfile";
import AccountPayment from "../pages/Accountdepartment/PaymentDetilas/AccountPayment";
import SingleCheque from "../pages/Accountdepartment/Singlecheque/SingleCheque";
import SingleIndetails from "../pages/Accountdepartment/Singleinvoice/SingleIndetails";
import BankAcc from "../pages/Accountdepartment/BackdepositeDetails/BankAcc";
import AccAlldealer from "../pages/Accountdepartment/AllDealerHis/AccAlldealer";
import SingleDelaer from "../pages/Accountdepartment/AllDealerHis/SingleDelaer";
import AccountPage from "../pages/Accountdepartment/AllAcount/AccountPage";
import FinancialReportEditor from "../pages/Accountdepartment/FinancialReport/Financereport";
import AllaccCheaue from "../pages/Accountdepartment/ChequeDetails/AllaccCheaue";

export default function AccountRoute() {
    return (
        <>
            <Route element={<ProtectedRoute allowedRoles={["account"]} />}>
                <Route path="/account-dash" element={<AccountProfile />} />
                <Route path="/account-payment" element={<AccountPayment />} />
                <Route path="/single-cheque/:invoiceNumber" element={<SingleCheque />} />
                <Route path="/single-invoice/:id" element={<SingleIndetails />} />
                <Route path="/All-accCheaue" element={<AllaccCheaue />} />
                <Route path="/BankAcc" element={<BankAcc />} />
                <Route path="/AccAlldealer" element={<AccAlldealer />} />
                <Route path="/SingleDelaer" element={<SingleDelaer />} />
                <Route path="/All_Account" element={<AccountPage />} />
                <Route path="/Finance_report" element={<FinancialReportEditor />} />
            </Route>
        </>
    );
}
