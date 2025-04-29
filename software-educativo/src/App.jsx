import {Routes, Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import MathPage from './pages/MathPage'
import Ortografia from './pages/Ortografia'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/math" element={<MathPage />} />
      <Route path="/spelling" element={<Ortografia />} /> 
    </Routes>
  )
}