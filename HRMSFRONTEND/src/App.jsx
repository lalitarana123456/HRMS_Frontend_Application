//import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/Employee-Dashboard/Welcome';
import Login from './components/Employee-Dashboard/Login';
import './App.css';
import Main from './components/Main/Main';
import Payroll from './components/Employee-Dashboard/PayRoll&PaySlip/Payroll';
import EmpDasHome from './components/Employee-Dashboard/Home/Dashboard';
// import LeaveManagement from './components/Employee-Dashboard/leaveManagement/LeaveManagement';
 import ProtectedRoute from './components/ProtectedRoute';
// import CodeTest from './components/CodeTest';
import Main_Profile from './components/Employee-Dashboard/User/Main_Profile';
import AddEmployee from './components/Employee-Dashboard/EmpPerformanceSheet/TLComp/AddEmployee';
import RemoveList from './components/Employee-Dashboard/EmpPerformanceSheet/TLComp/RemoveList';
import ALogin from "./components/AdminLogin/ALogin.jsx";
import YearlyPerfomanceLeader from './components/Employee-Dashboard/EmpPerformanceSheet/YearlyPerformanceLeader';
import LeaveMain from './components/Employee-Dashboard/Leave_Management/LeaveMain';
import RequestLeave from './components/Employee-Dashboard/Leave_Management/Request_Leave/RequestLeave';
import EditProfile from './components/adminEditProfile/EditProfile';
import Employee from './components/adminEmployee/Employee';
 import CompanyId from './components/adminCompany/CompanyId';
import AdminDashboard from './components/Admin-Dashboard/AdminDashboard';
import AdminSidebar from './components/Admin-Sidebar/AdminSidebar.jsx';
import MonthlyPerfomanceLeader from './components/Employee-Dashboard/EmpPerformanceSheet/MonthlyPerfomanceLeader.jsx';
import PerformanceSheetDetails from './components/Employee-Dashboard/EmpPerformanceSheet/PerformanceSheetDetails.jsx';
import Team from './components/Employee-Dashboard/EmpPerformanceSheet/TLComp/Team.jsx';
import ForgetPassword from "./components/Employee-Dashboard/ForgetPassword.jsx"
import OTPVerification from "./components/Employee-Dashboard/OTP-Verification.jsx"
import ResetPassword from "./components/Employee-Dashboard/ResetPassword.jsx"
import Main_Employer_Component from './components/Employer_dashboard/Employeer_Home_Dashboard/Main_Employer_Component.jsx';
import Unauthorized from './components/Unauthorized.jsx';
import Employeer_Performence from './components/Employer_dashboard/Employeer_Performence/Employeer_Performence.jsx'
import EmployerPayroll from './components/employerPayroll/Employerpayroll';
import EmployerPayslip from './components/employerPayroll/EmployerPayslip';
import EmployerPayrollForm from './components/employerPayroll/EmployerPayrollForm';
import EmployerUser from './components/employerUser/EmployerUser';
import Profile from './components/employerProfile/Profile';
import LeaveManagement from './components/Employer-LeaveManagement/LeaveManagement';
import LeaveInfo from './components/Employer-LeaveManagement/LeaveInfo';
import Calender from './components/Employer-LeaveManagement/Calender';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmployerAttendance from './components/Employer-Attendance/EmployerAttendance.jsx';
import EmployerEdit from './components/employerProfile/EmployerEdit.jsx';
import TeamLeaders from './components/Employer-CreateTeam/TeamLeaders.jsx';

export default function App() {  // Add 'export default' here
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/AdminLogin" element={<ALogin />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Employee Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Employee" , "Team Leader"]} />}>
          <Route path="/dashboard" element={<EmpDasHome />} />
          <Route path="/leave" element={<LeaveMain />} />
          {/* <Route path="/Employee Performence Sheet Details:id" element={<PerformanceSheetDetails />} /> */}


          <Route path="/Employee Performence Sheet Details" element={<PerformanceSheetDetails />} />
         
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/request-leave" element={<RequestLeave />} />
          <Route path="/User-Profile" element={<Main_Profile />} />

          <Route path="/Team" element={<Team />} />
          {/* <Route path="/AddEmployee" element={<AddEmployee />} />
          <Route path="/RemoveEmployee" element={<RemoveList />} /> */}
          <Route path="/LeaderMonth/:_id" element={<MonthlyPerfomanceLeader />} />
          <Route path="/LeaderYear/:_id" element={<YearlyPerfomanceLeader />} />
  
        </Route>

        {/* Employer Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Employer"]} />}>
          <Route path="/Company Home" element={<Main_Employer_Component />} />
          <Route path="/Employer Performence Sheet" element={<Employeer_Performence />} />
          <Route path="/employerPayroll" element={<EmployerPayroll />} />
          <Route path="/employerPayslip" element={<EmployerPayslip />} />
          <Route path="/employerPayslipForm/:id" element={<EmployerPayrollForm />} />
          <Route path="/employerUser" element={<EmployerUser />} />
          <Route path="/leave-management" element={<LeaveManagement/>}/>
          <Route path="/leave-calender" element={<Calender/>}/>
          <Route path="/employerProfile" element={<Profile />} />
          <Route path="/Main_Profile/:empData" element={<Main_Profile/>} />
          <Route path="/EmployeePerformenceSheetDetails/:id" element={<PerformanceSheetDetails />} />
          <Route path="/employer-attendance" element={<EmployerAttendance />} />
          <Route path="/employerEditProfile" element={<EmployerEdit />} />
          <Route path="/team-leaders" element={<TeamLeaders />} />
          <Route path="/Team/:_id" element={<Team />} />
          <Route path="/AddEmployee/:_id" element={<AddEmployee />} />
          <Route path="/RemoveEmployee/:_id" element={<RemoveList />} />
          <Route path="/Admin Create Employee ID" element={<Employee />} />

        </Route>

        {/* <Route element={<ProtectedRoute allowedRoles={["Employee", "Employer"]} />}>
        <Route path="/EmployeePerformenceSheetDetails:id" element={<PerformanceSheetDetails />} />
        </Route> */}


        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/adminEdit/:id" element={<EditProfile />} />
          <Route path="/Admin Create Company ID" element={<CompanyId />} />
          <Route path="/admin-sidebar" element={<AdminSidebar />} />
        </Route>
      </Routes>
      <ToastContainer/>
      <ToastContainer />
    </Router>
  );
}

// export default App;

