import { BrowserRouter, Routes, Route } from 'react-router'
import LoginPage from './components/auth/LoginPage'
import Dashboard from './components/dashboard/Dashboard'
import ProtectedRoutes from './utils/ProtectedRoutes'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path='/login' />

        <Route element={<ProtectedRoutes />}>
          <Route element={<Dashboard />} path='/dashboard' />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
