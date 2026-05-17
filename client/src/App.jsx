import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './contexts/AuthContext';
import ThemeContext from './contexts/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeGoals from './pages/employee/Goals';
import EmployeeCheckins from './pages/employee/Checkins';
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerApprovals from './pages/manager/Approvals';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import Insights from './pages/analytics/Insights';
import NotFound from './pages/misc/NotFound';

const App = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <BrowserRouter>
      <div className={`min-h-screen w-full overflow-x-hidden ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.16),_transparent_20%),#020617] text-white' : 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-900'}`}>
        <div className={`grid min-h-screen ${user ? 'xl:grid-cols-[18rem_minmax(0,1fr)]' : 'grid-cols-1'}`}>
          {user && <Sidebar />}
          <div className="flex min-h-screen flex-col">
            {user && <Navbar />}
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-screen-2xl">
                <Routes>
                  <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
                  <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
                  <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" replace />} />
                  <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/" replace />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<EmployeeDashboard />} />
                    <Route path="/goals" element={<EmployeeGoals />} />
                    <Route path="/checkins" element={<EmployeeCheckins />} />
                    <Route element={<RoleRoute allowedRoles={[ 'manager', 'admin' ]} />}>
                      <Route path="/manager" element={<ManagerDashboard />} />
                      <Route path="/approvals" element={<ManagerApprovals />} />
                    </Route>
                    <Route element={<RoleRoute allowedRoles={[ 'admin' ]} />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/users" element={<AdminUsers />} />
                    </Route>
                    <Route path="/insights" element={<Insights />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
