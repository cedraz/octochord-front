import { BrowserRouter, Routes, Route } from 'react-router'
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/pages/Dashboard';
import ProtectedRoutes from './utils/ProtectedRoutes';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import NotFound from './components/pages/NotFound';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path='/login' />
        <Route element={<ForgotPassword />} path='/forgot-password' />
        <Route element={<ResetPassword />} path='/reset-password' />


        <Route element={<ProtectedRoutes />}>
          <Route element={<Dashboard />} path='/dashboard' />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
