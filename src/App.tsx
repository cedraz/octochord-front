import { BrowserRouter, Routes, Route } from 'react-router'
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoutes from './utils/ProtectedRoutes';
import ForgotPassword from './components/auth/ForgotPassword';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path='/login' />
        <Route element={<ForgotPassword />} path='/forgot-password' />

        <Route element={<ProtectedRoutes />}>
          <Route element={<Dashboard />} path='/dashboard' />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
