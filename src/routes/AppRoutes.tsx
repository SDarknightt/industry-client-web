import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import ListProduct from '../pages/products/ListProduct'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index  element={<Home />} />
        <Route index path="/produtos" element={<ListProduct />} />
      </Routes>
    </BrowserRouter>
  )
}