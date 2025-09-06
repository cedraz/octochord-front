import { BrowserRouter, Routes, Route } from 'react-router'
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/pages/Dashboard';
import ProtectedRoutes from './utils/ProtectedRoutes';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import NotFound from './components/pages/NotFound';
import ChangePasswordPage from './components/pages/ChangePasswordPage';
import { Toaster } from './components/ui/sonner';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path='/login' />
        <Route element={<ForgotPassword />} path='/forgot-password' />
        <Route element={<ResetPassword />} path='/reset-password' />


        <Route element={<ProtectedRoutes />}>
          <Route element={<Dashboard />} path='/dashboard' >
            <Route path="settings/change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position='bottom-right' />
    </BrowserRouter>
  )
}

export default App
