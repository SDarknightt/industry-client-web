import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import ProductList from '../pages/products/ProductList'
import ProductCreate from '../pages/products/ProductCreate'
import ProductDetails from '../pages/products/ProductDetails'
import ProductUpdate from '../pages/products/ProductUpdate'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index  element={<Home />} />
        <Route path="/produtos" element={<ProductList />} />
        <Route path="/produtos/novo" element={<ProductCreate />} />
        <Route path="/produtos/:id" element={<ProductDetails />} />
        <Route path="/produtos/:id/editar" element={<ProductUpdate />} />
      </Routes>
    </BrowserRouter>
  )
}